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
  },
  about: {
    type: String,
    default: ''
  },
  loveJob: {
    type: String,
    default: ''
  },
  hobbies: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  certifications: {
    type: [String],
    default: []
  },
  monthlyWage: {
    type: Number,
    default: 50000
  },
  workingDaysPerWeek: {
    type: Number,
    default: 5
  },
  breakTimeHours: {
    type: Number,
    default: 1
  },
  pfRate: {
    type: Number,
    default: 12
  },
  professionalTax: {
    type: Number,
    default: 200
  },
  standardAllowance: {
    type: Number,
    default: 4167
  },
  mobile: {
    type: String,
    default: ''
  },
  manager: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
