const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  loginId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  companyName: {
    type: String,
    trim: true,
    default: ''
  },
  companyLogo: {
    type: String,
    default: ''
  },
  employeeId: {
    type: String,
    trim: true,
    default: ''
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Employee', 'HR'],
    default: 'Employee'
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  jobTitle: {
    type: String,
    default: 'Junior Associate'
  },
  department: {
    type: String,
    default: 'General Support'
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    default: ''
  },
  salaryStructure: {
    basic: {
      type: Number,
      default: 3000
    },
    allowances: {
      type: Number,
      default: 500
    },
    deductions: {
      type: Number,
      default: 200
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
