const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('./models/User');
const Attendance = require('./models/Attendance');
const LeaveRequest = require('./models/LeaveRequest');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrms';

// Helpers to get relative date strings YYYY-MM-DD
function getDateOffset(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helpers to get full date object offsets
function getDateTimeOffset(offsetDays, hours = 9, minutes = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 4000 });
    console.log('Connected. Cleaning existing database collection records...');
    
    await User.deleteMany({});
    await Attendance.deleteMany({});
    await LeaveRequest.deleteMany({});

    console.log('Generating password hashes...');
    const salt = await bcrypt.genSalt(10);
    const commonHashedPassword = await bcrypt.hash('password123', salt);

    console.log('Creating users...');
    
    // 1. Create HR Officer / Admin
    const hrAdmin = new User({
      loginId: 'HR-001',
      employeeId: 'HR-001',
      name: 'Sarah Jenkins',
      email: 'hr@company.com',
      password: commonHashedPassword,
      role: 'HR',
      companyName: 'Delta HRMS Systems',
      companyLogo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%236366f1"><rect width="100" height="100" rx="20"/><text x="50" y="55" font-size="28" font-family="sans-serif" font-weight="bold" fill="white" text-anchor="middle">D</text></svg>',
      phone: '+1 555-0199',
      address: '100 Executive Way, Suite 400',
      jobTitle: 'HR Director',
      department: 'People Operations',
      isVerified: true,
      salaryStructure: {
        basic: 6500,
        allowances: 1200,
        deductions: 500
      }
    });

    // 2. Create Employee 1
    const emp1 = new User({
      loginId: 'EMP-001',
      employeeId: 'EMP-001',
      name: 'David Miller',
      email: 'employee@company.com',
      password: commonHashedPassword,
      role: 'Employee',
      phone: '+1 555-0144',
      address: '452 Elm Street, Apt 3B',
      jobTitle: 'Senior Software Engineer',
      department: 'Engineering',
      isVerified: true,
      salaryStructure: {
        basic: 5200,
        allowances: 800,
        deductions: 400
      }
    });

    // 3. Create Employee 2
    const emp2 = new User({
      loginId: 'EMP-002',
      employeeId: 'EMP-002',
      name: 'Emily Watson',
      email: 'emily@company.com',
      password: commonHashedPassword,
      role: 'Employee',
      phone: '+1 555-0177',
      address: '78 Pine Road, Flat A',
      jobTitle: 'Product Designer',
      department: 'Product & Design',
      isVerified: true,
      salaryStructure: {
        basic: 4600,
        allowances: 600,
        deductions: 300
      }
    });

    const savedHr = await hrAdmin.save();
    const savedEmp1 = await emp1.save();
    const savedEmp2 = await emp2.save();

    console.log('Users created successfully.');
    console.log('Seeding attendance records...');

    // Attendance for David Miller
    const attendances = [
      new Attendance({
        employee: savedEmp1._id,
        date: getDateOffset(0),
        checkIn: getDateTimeOffset(0, 9, 5),
        checkOut: getDateTimeOffset(0, 18, 12),
        status: 'Present',
        remarks: 'Total hours: 9.12h'
      }),
      new Attendance({
        employee: savedEmp1._id,
        date: getDateOffset(-1),
        checkIn: getDateTimeOffset(-1, 8, 55),
        checkOut: getDateTimeOffset(-1, 18, 2),
        status: 'Present',
        remarks: 'Total hours: 9.12h'
      }),
      new Attendance({
        employee: savedEmp1._id,
        date: getDateOffset(-2),
        checkIn: getDateTimeOffset(-2, 9, 0),
        checkOut: getDateTimeOffset(-2, 12, 30),
        status: 'Half-day',
        remarks: 'Early checkout. Total hours: 3.50h'
      }),
      new Attendance({
        employee: savedEmp1._id,
        date: getDateOffset(-3),
        status: 'Absent',
        remarks: 'Unexcused absence'
      }),

      new Attendance({
        employee: savedEmp2._id,
        date: getDateOffset(0),
        checkIn: getDateTimeOffset(0, 8, 48),
        status: 'Present',
        remarks: 'Checked in'
      }),
      new Attendance({
        employee: savedEmp2._id,
        date: getDateOffset(-1),
        status: 'Leave',
        remarks: 'Approved Leave: Sick'
      })
    ];

    for (const att of attendances) {
      await att.save();
    }

    console.log('Attendance records seeded.');
    console.log('Seeding leave requests...');

    const leave1 = new LeaveRequest({
      employee: savedEmp1._id,
      leaveType: 'Sick',
      startDate: getDateTimeOffset(-2),
      endDate: getDateTimeOffset(-2),
      remarks: 'Dental checkup and recovery',
      status: 'Approved',
      adminComments: 'Approved by HR. Get well soon.',
      approvedBy: savedHr._id
    });

    const leave2 = new LeaveRequest({
      employee: savedEmp2._id,
      leaveType: 'Paid',
      startDate: getDateTimeOffset(3),
      endDate: getDateTimeOffset(5),
      remarks: 'Family vacation trip',
      status: 'Pending'
    });

    await leave1.save();
    await leave2.save();

    console.log('Leave requests seeded.');
    console.log('\n======================================================');
    console.log('DATABASE SEEDING SUCCESSFUL');
    console.log('------------------------------------------------------');
    console.log('Credential Details for testing:');
    console.log('1. HR Admin Account:');
    console.log('   Email: hr@company.com');
    console.log('   Password: password123');
    console.log('2. Employee Account:');
    console.log('   Email: employee@company.com');
    console.log('   Password: password123');
    console.log('======================================================\n');

  } catch (error) {
    console.error('\n======================================================');
    console.error(`SEEDING ERROR: Could not connect to MongoDB database.`);
    console.error(`Details: ${error.message}`);
    console.error(`======================================================\n`);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedDatabase();
