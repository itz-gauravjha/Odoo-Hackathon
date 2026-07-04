const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireHR } = require('../middleware/auth');

// @route   GET /api/payroll/my-slip
router.get('/my-slip', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('name employeeId jobTitle department salaryStructure');
    if (!user) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const { basic, allowances, deductions } = user.salaryStructure;
    const grossSalary = basic + allowances;
    const netSalary = grossSalary - deductions;

    res.json({
      success: true,
      name: user.name,
      employeeId: user.employeeId,
      jobTitle: user.jobTitle,
      department: user.department,
      salaryStructure: {
        basic,
        allowances,
        deductions,
        grossSalary,
        netSalary
      }
    });
  } catch (error) {
    console.error('Error fetching payroll details:', error);
    res.status(500).json({ message: 'Server error fetching payroll details' });
  }
});

// HR Admin routes
router.get('/all', requireAuth, requireHR, async (req, res) => {
  try {
    const employees = await User.find({}).select('name employeeId jobTitle department salaryStructure');
    
    const payrollData = employees.map(emp => {
      const { basic, allowances, deductions } = emp.salaryStructure;
      const grossSalary = basic + allowances;
      const netSalary = grossSalary - deductions;

      return {
        _id: emp._id,
        name: emp.name,
        employeeId: emp.employeeId,
        jobTitle: emp.jobTitle,
        department: emp.department,
        salaryStructure: {
          basic,
          allowances,
          deductions,
          grossSalary,
          netSalary
        }
      };
    });

    res.json({ success: true, payroll: payrollData });
  } catch (error) {
    console.error('Error listing payroll:', error);
    res.status(500).json({ message: 'Server error listing payroll records' });
  }
});

router.put('/update/:id', requireAuth, requireHR, async (req, res) => {
  try {
    const { basic, allowances, deductions } = req.body;

    if (basic === undefined && allowances === undefined && deductions === undefined) {
      return res.status(400).json({ message: 'At least one salary component must be provided.' });
    }

    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    if (basic !== undefined) employee.salaryStructure.basic = Number(basic);
    if (allowances !== undefined) employee.salaryStructure.allowances = Number(allowances);
    if (deductions !== undefined) employee.salaryStructure.deductions = Number(deductions);

    await employee.save();

    const updatedGross = employee.salaryStructure.basic + employee.salaryStructure.allowances;
    const updatedNet = updatedGross - employee.salaryStructure.deductions;

    res.json({
      success: true,
      message: 'Salary structure updated successfully.',
      salaryStructure: {
        basic: employee.salaryStructure.basic,
        allowances: employee.salaryStructure.allowances,
        deductions: employee.salaryStructure.deductions,
        grossSalary: updatedGross,
        netSalary: updatedNet
      }
    });
  } catch (error) {
    console.error('Error updating salary structure:', error);
    res.status(500).json({ message: 'Server error updating salary structure' });
  }
});

module.exports = router;
