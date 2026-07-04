const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { requireAuth, requireHR } = require('../middleware/auth');

const getLocalDateString = (dateObj = new Date()) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// @route   GET /api/attendance/today
router.get('/today', requireAuth, async (req, res) => {
  try {
    const todayStr = getLocalDateString();
    const record = await Attendance.findOne({
      employee: req.session.userId,
      date: todayStr
    });
    res.json({ success: true, record });
  } catch (error) {
    console.error('Error fetching today\'s attendance:', error);
    res.status(500).json({ message: 'Server error fetching today\'s attendance' });
  }
});

// @route   POST /api/attendance/checkin
router.post('/checkin', requireAuth, async (req, res) => {
  try {
    const todayStr = getLocalDateString();
    
    let record = await Attendance.findOne({
      employee: req.session.userId,
      date: todayStr
    });

    if (record && record.checkIn) {
      return res.status(400).json({ message: 'You have already checked in for today.' });
    }

    if (!record) {
      record = new Attendance({
        employee: req.session.userId,
        date: todayStr,
        checkIn: new Date(),
        status: 'Present'
      });
    } else {
      record.checkIn = new Date();
      record.status = 'Present';
    }

    await record.save();
    res.json({ success: true, message: 'Checked in successfully!', record });
  } catch (error) {
    console.error('Checkin error:', error);
    res.status(500).json({ message: 'Server error during check-in' });
  }
});

// @route   POST /api/attendance/checkout
router.post('/checkout', requireAuth, async (req, res) => {
  try {
    const todayStr = getLocalDateString();

    const record = await Attendance.findOne({
      employee: req.session.userId,
      date: todayStr
    });

    if (!record) {
      return res.status(400).json({ message: 'You must check-in first before checking out.' });
    }

    if (record.checkOut) {
      return res.status(400).json({ message: 'You have already checked out for today.' });
    }

    record.checkOut = new Date();
    
    const diffMs = record.checkOut - record.checkIn;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 4) {
      record.status = 'Half-day';
      record.remarks = `Early checkout. Total hours: ${diffHours.toFixed(2)}h`;
    } else {
      record.remarks = `Total hours: ${diffHours.toFixed(2)}h`;
    }

    await record.save();
    res.json({ success: true, message: 'Checked out successfully!', record });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Server error during check-out' });
  }
});

// @route   GET /api/attendance/my-logs
router.get('/my-logs', requireAuth, async (req, res) => {
  try {
    const logs = await Attendance.find({ employee: req.session.userId }).sort({ date: -1 });
    res.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Server error fetching attendance logs' });
  }
});

// HR Admin routes
router.get('/all', requireAuth, requireHR, async (req, res) => {
  try {
    const { date, employeeId } = req.query;
    let query = {};

    if (date) {
      query.date = date;
    }
    if (employeeId) {
      query.employee = employeeId;
    }

    const records = await Attendance.find(query)
      .populate('employee', 'name employeeId role department')
      .sort({ date: -1 });

    res.json({ success: true, records });
  } catch (error) {
    console.error('Error fetching all attendance records:', error);
    res.status(500).json({ message: 'Server error fetching attendance records' });
  }
});

router.post('/mark', requireAuth, requireHR, async (req, res) => {
  try {
    const { employeeId, date, status, remarks, checkIn, checkOut } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({ message: 'Employee ID, Date, and Status are required.' });
    }

    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const filter = { employee: employeeId, date };
    const update = {
      status,
      remarks: remarks || '',
      checkIn: checkIn ? new Date(checkIn) : undefined,
      checkOut: checkOut ? new Date(checkOut) : undefined
    };

    const record = await Attendance.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true
    });

    res.json({ success: true, message: 'Attendance record updated successfully.', record });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error updating attendance record' });
  }
});

module.exports = router;
