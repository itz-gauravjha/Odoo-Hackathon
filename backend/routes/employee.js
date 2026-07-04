const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireHR } = require('../middleware/auth');

// @route   GET /api/employee/profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// @route   PUT /api/employee/profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { 
      phone, address, profilePicture, 
      about, loveJob, hobbies, skills, certifications, mobile 
    } = req.body;

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    
    // Resume and private updates
    if (about !== undefined) user.about = about;
    if (loveJob !== undefined) user.loveJob = loveJob;
    if (hobbies !== undefined) user.hobbies = hobbies;
    if (skills !== undefined) user.skills = skills;
    if (certifications !== undefined) user.certifications = certifications;
    if (mobile !== undefined) user.mobile = mobile;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        about: user.about,
        loveJob: user.loveJob,
        hobbies: user.hobbies,
        skills: user.skills,
        certifications: user.certifications,
        mobile: user.mobile
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// HR Admin routes
router.get('/list', requireAuth, requireHR, async (req, res) => {
  try {
    const employees = await User.find({}).select('-password').sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    console.error('Error listing employees:', error);
    res.status(500).json({ message: 'Server error listing employees' });
  }
});

router.get('/:id', requireAuth, requireHR, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).json({ message: 'Server error fetching employee details' });
  }
});

router.put('/:id', requireAuth, requireHR, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      address, 
      role, 
      jobTitle, 
      department, 
      employeeId, 
      salaryStructure 
    } = req.body;

    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employeeId && employeeId !== employee.employeeId) {
      const idExists = await User.findOne({ employeeId });
      if (idExists) {
        return res.status(400).json({ message: 'Employee ID is already in use by another user' });
      }
      employee.employeeId = employeeId;
    }

    if (email && email.toLowerCase() !== employee.email.toLowerCase()) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ message: 'Email address is already in use by another user' });
      }
      employee.email = email.toLowerCase();
    }

    if (name) employee.name = name;
    if (phone !== undefined) employee.phone = phone;
    if (address !== undefined) employee.address = address;
    if (role) employee.role = role;
    if (jobTitle) employee.jobTitle = jobTitle;
    if (department) employee.department = department;

    // Save resume info
    if (req.body.about !== undefined) employee.about = req.body.about;
    if (req.body.loveJob !== undefined) employee.loveJob = req.body.loveJob;
    if (req.body.hobbies !== undefined) employee.hobbies = req.body.hobbies;
    if (req.body.skills !== undefined) employee.skills = req.body.skills;
    if (req.body.certifications !== undefined) employee.certifications = req.body.certifications;

    // Save location / private details
    if (req.body.mobile !== undefined) employee.mobile = req.body.mobile;
    if (req.body.manager !== undefined) employee.manager = req.body.manager;
    if (req.body.location !== undefined) employee.location = req.body.location;

    // Save salary structures
    if (req.body.monthlyWage !== undefined) employee.monthlyWage = Number(req.body.monthlyWage);
    if (req.body.workingDaysPerWeek !== undefined) employee.workingDaysPerWeek = Number(req.body.workingDaysPerWeek);
    if (req.body.breakTimeHours !== undefined) employee.breakTimeHours = Number(req.body.breakTimeHours);
    if (req.body.pfRate !== undefined) employee.pfRate = Number(req.body.pfRate);
    if (req.body.professionalTax !== undefined) employee.professionalTax = Number(req.body.professionalTax);
    if (req.body.standardAllowance !== undefined) employee.standardAllowance = Number(req.body.standardAllowance);

    if (salaryStructure) {
      if (salaryStructure.basic !== undefined) employee.salaryStructure.basic = Number(salaryStructure.basic);
      if (salaryStructure.allowances !== undefined) employee.salaryStructure.allowances = Number(salaryStructure.allowances);
      if (salaryStructure.deductions !== undefined) employee.salaryStructure.deductions = Number(salaryStructure.deductions);
    }

    await employee.save();
    res.json({ success: true, message: 'Employee details updated successfully by HR', employee });
  } catch (error) {
    console.error('Error updating employee details:', error);
    res.status(500).json({ message: 'Server error updating employee details' });
  }
});

router.delete('/:id', requireAuth, requireHR, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    if (employee._id.toString() === req.session.userId) {
      return res.status(400).json({ message: 'You cannot delete your own HR account' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Employee record deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error deleting employee' });
  }
});

module.exports = router;
