const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const Attendance = require('../models/Attendance');
const { requireAuth, requireHR } = require('../middleware/auth');

const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let current = new Date(startDate);
  const end = new Date(endDate);
  
  current.setHours(12,0,0,0);
  end.setHours(12,0,0,0);

  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// @route   POST /api/leave/apply
router.post('/apply', requireAuth, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, remarks } = req.body;

    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ message: 'Leave type, start date, and end date are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid start or end date.' });
    }

    if (start > end) {
      return res.status(400).json({ message: 'Start date cannot be after end date.' });
    }

    const newRequest = new LeaveRequest({
      employee: req.session.userId,
      leaveType,
      startDate: start,
      endDate: end,
      remarks: remarks || '',
      status: 'Pending'
    });

    await newRequest.save();
    res.status(201).json({ success: true, message: 'Leave application submitted successfully!', request: newRequest });
  } catch (error) {
    console.error('Error applying for leave:', error);
    res.status(500).json({ message: 'Server error during leave application' });
  }
});

// @route   GET /api/leave/my-requests
router.get('/my-requests', requireAuth, async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ employee: req.session.userId })
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching employee leave requests:', error);
    res.status(500).json({ message: 'Server error fetching leave requests' });
  }
});

// HR Admin routes
router.get('/all', requireAuth, requireHR, async (req, res) => {
  try {
    const requests = await LeaveRequest.find({})
      .populate('employee', 'name employeeId role department')
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching all leave requests:', error);
    res.status(500).json({ message: 'Server error fetching all leave requests' });
  }
});

router.post('/approve/:id', requireAuth, requireHR, async (req, res) => {
  try {
    const { status, adminComments } = req.body;
    
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Valid status (Approved or Rejected) is required.' });
    }

    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    if (leaveRequest.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave request is already processed.' });
    }

    leaveRequest.status = status;
    leaveRequest.adminComments = adminComments || '';
    leaveRequest.approvedBy = req.session.userId;
    await leaveRequest.save();

    if (status === 'Approved') {
      const datesToMark = getDatesInRange(leaveRequest.startDate, leaveRequest.endDate);
      
      const bulkOps = datesToMark.map(dateStr => ({
        updateOne: {
          filter: { employee: leaveRequest.employee, date: dateStr },
          update: {
            status: 'Leave',
            remarks: `Approved Leave: ${leaveRequest.leaveType}. Comments: ${adminComments || ''}`
          },
          upsert: true
        }
      }));

      if (bulkOps.length > 0) {
        await Attendance.bulkWrite(bulkOps);
      }
    }

    res.json({ success: true, message: `Leave request has been ${status.toLowerCase()} successfully.`, leaveRequest });
  } catch (error) {
    console.error('Error processing leave request:', error);
    res.status(500).json({ message: 'Server error processing leave request' });
  }
});

module.exports = router;
