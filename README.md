# 🏢 HRMS — Human Resource Management System

> A full-stack, production-ready Human Resource Management System built for the **Odoo Hackathon**. Features dual portals (Employee + HR Admin), real-time attendance tracking, leave management, payroll slips, email OTP verification, and one-click Render deployment.

**🌐 Live Demo:** https://odoo-hackathon-1wcv.onrender.com  
**👤 Employee Portal:** `/`  
**🛡️ HR Admin Console:** `/admin/`

---

## 📸 Screenshots

| Employee Portal | HR Admin Console |
|---|---|
| Login with email or Login ID | Manage all employees |
| Attendance check-in/check-out | Approve/reject leave requests |
| Leave request submission | Edit employee salary structures |
| Payroll slip viewer | Employee directory with status dots |

---

## ✨ Features

### 👤 Employee Portal
- **Secure Login** — Sign in with Email or auto-generated Login ID (e.g. `OIJODO20260001`)
- **Email OTP Verification** — Account activation via 6-digit OTP sent to registered email
- **Employee Directory** — View all colleagues with live presence indicators (🟢 Present / ✈️ On Leave / 🟡 Absent)
- **Attendance Tracker** — One-click check-in & check-out with a visual monthly calendar
- **Leave Requests** — Submit Paid / Sick / Unpaid leave with date range picker
- **Profile Management** — Update personal details, contact info, and profile picture
- **Payroll Slip** — View monthly salary breakdown (Basic, HRA, Allowances, Deductions, Net Pay)
- **View-Only Colleague Profiles** — Browse teammates' resumes, skills, certifications (read-only)

### 🛡️ HR Admin Console
- **HR-Only Access** — Restricted to accounts with the `HR` role
- **Employee Management** — Full CRUD on all employee profiles
- **Salary Configuration** — Set Wage Type, Basic, HRA, Allowances, Deductions, Bonus per employee
- **Leave Administration** — Approve or reject employee leave requests with comments
- **Attendance Overview** — View check-in/out records across all employees
- **Employee Detail Inspector** — Multi-tab profile editor (Resume, Private Info, Salary)

### 🔒 Security
- Session-based authentication with `express-session`
- Password hashing with `bcryptjs`
- Role-based route protection (`requireAuth`, `requireHR` middleware)
- Secure HTTPS cookies (`sameSite: none`, `secure: true`) on production
- Render reverse proxy support (`trust proxy: 1`)

---

## 🏗️ Architecture

```
school management/
├── backend/                  # Express.js API Server
│   ├── models/
│   │   ├── User.js           # Employee schema (profile, salary, resume fields)
│   │   ├── Attendance.js     # Check-in/out records
│   │   └── LeaveRequest.js   # Leave request schema
│   ├── routes/
│   │   ├── auth.js           # Signup, Signin, OTP verify, Signout
│   │   ├── employee.js       # Profile CRUD, Employee list
│   │   ├── attendance.js     # Check-in, Check-out, Logs
│   │   ├── leave.js          # Apply leave, List, Admin approve/reject
│   │   └── payroll.js        # Salary slip generation
│   ├── middleware/
│   │   └── auth.js           # requireAuth, requireHR guards
│   ├── db.js                 # MongoDB Atlas connection with auto /hrms DB injection
│   ├── server.js             # Express app, static serving, session config
│   └── seed.js               # Demo data seeder
│
├── frontend/                 # Employee Portal (React + Vite)
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx     # Sign in / Sign up / OTP verify
│       │   └── Dashboard.jsx # Main portal (Directory, Attendance, Leave, Profile, Payroll)
│       └── components/
│           ├── EmployeeDirectory.jsx   # Colleague cards with status dots
│           ├── EmployeeDetailView.jsx  # View/edit profile modal (view-only for others)
│           ├── ClockPanel.jsx          # Check-in / Check-out widget
│           ├── AttendanceCalendar.jsx  # Monthly attendance heatmap
│           ├── LeaveForm.jsx           # Leave request form
│           ├── LeaveHistoryTable.jsx   # Leave history list
│           ├── ProfileView.jsx         # Profile display
│           ├── ProfileEditForm.jsx     # Profile edit form
│           └── PayrollSlip.jsx         # Salary slip component
│
├── admin/                    # HR Admin Console (React + Vite)
│   └── src/
│       ├── pages/
│       │   ├── AdminLogin.jsx      # HR-only login page
│       │   └── AdminDashboard.jsx  # Full HR control panel
│       └── components/
│           ├── EmployeeDirectory.jsx   # Clickable employee cards
│           └── EmployeeDetailView.jsx  # Full editor with salary config
│
├── package.json              # Root build scripts for Render
├── render_deployment_guide.md
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TailwindCSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | express-session, bcryptjs |
| **Email** | Nodemailer (Gmail SMTP) |
| **Deployment** | Render (single service, dual Vite builds) |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with App Password for SMTP

### 1. Clone the repository
```bash
git clone https://github.com/itz-gauravjha/Odoo-Hackathon.git
cd Odoo-Hackathon
git checkout hrms-features
```

### 2. Set up environment variables
Create `backend/.env`:
```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/hrms?appName=Cluster0
SESSION_SECRET=your_secret_key_here
NODE_ENV=development
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail".

### 3. Install dependencies & seed the database
```bash
# Install root dependencies
npm install

# Seed demo users into MongoDB
node backend/seed.js
```

### 4. Run all three servers concurrently
```bash
npm run dev
```

This starts:
- **Backend API** on `http://localhost:3000`
- **Employee Portal** on `http://localhost:5173`
- **HR Admin Console** on `http://localhost:5174`

---

## 🔑 Demo Credentials

| Portal | URL | Login | Password |
|---|---|---|---|
| Employee Portal | `http://localhost:5173` | `employee@company.com` or `EMP-001` | `password123` |
| HR Admin Console | `http://localhost:5174` | `hr@company.com` or `HR-001` | `password123` |

---

## 🆔 Login ID Format

Auto-generated Login IDs follow this format:

```
[CompanyPrefix (2 chars)] + [Name Initials (4 chars)] + [Year] + [Serial (4 digits)]
```

**Example:** Employee "John Doe" joining company "Odoo India" in 2026:
```
OI + JODO + 2026 + 0001  →  OIJODO20260001
```

---

## 🌐 Production Deployment (Render)

### One-time setup
1. Go to [Render.com](https://render.com/) → **New Web Service**
2. Connect repo: `https://github.com/itz-gauravjha/Odoo-Hackathon.git`
3. Configure:
   - **Branch**: `hrms-features`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

### Environment Variables on Render
| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://...mongodb.net/?appName=Cluster0` |
| `SESSION_SECRET` | *(any strong random string)* |
| `SMTP_USER` | `your_email@gmail.com` |
| `SMTP_PASS` | `your_gmail_app_password` |

### How production serving works
The single Express server serves **both** React apps:
- `https://your-app.onrender.com/` → Employee Portal (`frontend/dist`)
- `https://your-app.onrender.com/admin/` → HR Admin Console (`admin/dist`)
- `https://your-app.onrender.com/api/*` → REST API

### Seed the live database
```bash
# Run from your local machine against the Atlas URI
MONGODB_URI="mongodb+srv://..." node backend/seed.js
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user (sends OTP email) |
| POST | `/api/auth/verify-otp` | Verify OTP and activate account |
| POST | `/api/auth/signin` | Login with LoginID or Email |
| POST | `/api/auth/signout` | Logout and destroy session |
| GET | `/api/auth/status` | Check current session |

### Employee
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/employee/profile` | Employee | Own profile |
| PUT | `/api/employee/profile` | Employee | Update own profile |
| GET | `/api/employee/list` | Employee | All employees with today's status |
| GET | `/api/employee/:id` | HR | Specific employee |
| PUT | `/api/employee/:id` | HR | Update any employee |

### Attendance
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/attendance/checkin` | Record check-in |
| POST | `/api/attendance/checkout` | Record check-out |
| GET | `/api/attendance/today` | Today's record |
| GET | `/api/attendance/my-logs` | Own history |

### Leave
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/leave/apply` | Submit leave request |
| GET | `/api/leave/my-requests` | Own leave history |
| GET | `/api/leave/all` | All requests (HR only) |
| PUT | `/api/leave/:id/approve` | Approve (HR only) |
| PUT | `/api/leave/:id/reject` | Reject (HR only) |

### Payroll
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/payroll/my-slip` | Current salary slip |

---

## 🧩 Key Design Decisions

### Dual Portal Architecture
Two separate Vite apps (`frontend/` and `admin/`) share the same backend API. In production they are compiled into `frontend/dist` and `admin/dist` and served by a single Express server.

### Session Cookies on HTTPS
`express-session` is configured with:
```js
cookie: {
  sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
  secure:   NODE_ENV === 'production'
}
```
Combined with `app.set('trust proxy', 1)` for Render's load balancer.

### Auto DB Name Injection
If `MONGODB_URI` omits the database name (common Render pattern), `db.js` automatically appends `/hrms`:
```
.net/?appName=Cluster0  →  .net/hrms?appName=Cluster0
```

---

## 👥 Team

Built for the **Odoo Hackathon** by:
- Imran Hussain
- Gaurav Jha ([@itz-gauravjha](https://github.com/itz-gauravjha))
- Saleh Hayat

---

## 📄 License

MIT License — free to use, modify, and distribute.
