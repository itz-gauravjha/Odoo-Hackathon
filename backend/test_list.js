const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('./models/User');
const Attendance = require('./models/Attendance');
const LeaveRequest = require('./models/LeaveRequest');

async function test() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrms';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    const employees = await User.find({}).select('-password').sort({ name: 1 }).lean();
    console.log('Found', employees.length, 'employees');

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayAttendances = await Attendance.find({
      date: { $gte: todayStart, $lte: todayEnd }
    });
    console.log('Found', todayAttendances.length, 'attendances');

    const todayLeaves = await LeaveRequest.find({
      status: 'Approved',
      startDate: { $lte: todayEnd },
      endDate: { $gte: todayStart }
    });
    console.log('Found', todayLeaves.length, 'leaves');

    const employeesWithStatus = employees.map(emp => {
      const checkedIn = todayAttendances.some(att => att.employee && att.employee.toString() === emp._id.toString());
      if (checkedIn) {
        emp.todayStatus = 'present';
        return emp;
      }

      const onLeave = todayLeaves.some(lv => lv.employee && lv.employee.toString() === emp._id.toString());
      if (onLeave) {
        emp.todayStatus = 'leave';
        return emp;
      }

      emp.todayStatus = 'absent';
      return emp;
    });

    console.log('Success! Computed statuses for', employeesWithStatus.length, 'employees');
    process.exit(0);
  } catch (err) {
    console.error('CRASH ERROR:', err.stack);
    process.exit(1);
  }
}

test();
