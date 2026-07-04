# 🏢 HRMS — Human Resource Management System

> A full-stack, production-ready Human Resource Management System built for the **Odoo Hackathon**. Features dual portals (Employee + HR Admin), real-time attendance tracking, leave management, payroll slips, email OTP verification, and one-click Render deployment.

**🌐 Live Demo:** [odoo-hackathon-1wcv.onrender.com](https://odoo-hackathon-1wcv.onrender.com)  
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

## 🏗️ Interactive Directory Structure & Key Files

Click any file to open it directly in the workspace:

- 📂 [school-management](file:///c:/Users/Imran%20Hussain/Desktop/school%20management)
  - 📂 **[backend](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend)** — Express.js API Server
    - 📂 **[models](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/models)** — Database Schemas
      - 📄 [User.js](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/models/User.js) — Employee profile, authentication details, and salary configuration
      - 📄 [Attendance.js](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/models/Attendance.js) — Daily clock-in/out logs
      - 📄 [LeaveRequest.js](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/models/LeaveRequest.js) — Employee leave applications
    - 📂 **[routes](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/routes)** — API Controllers
      - 📄 [auth.js](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/routes/auth.js) — User signup, signin, OTP generation, and email alerts
      - 📄 [employee.js](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/routes/employee.js) — Employee profiles CRUD & directories list
      - 📄 [attendance.js](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/routes/attendance.js) — Clocking status and monthly calendars
      - 📄 [leave.js](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/routes/leave.js) — Leave requests processing and approvals
      - 📄 [payroll.js](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/routes/payroll.js) — Payslip builder backend
    - 📂 **[middleware](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/middleware)** — Guards
      - 📄 [auth.js](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/middleware/auth.js) — Authentication check & Role verification guards
    - 📄 [db.js](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/db.js) — Mongoose database connection controller with database name injection
    - 📄 [server.js](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/server.js) — Main backend entrypoint, static assets hosting, and proxy settings
    - 📄 [seed.js](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/backend/seed.js) — Local database seeder script
  - 📂 **[frontend](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend)** — Employee Portal (React + Vite)
    - 📂 **[src/pages](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/pages)** — Views
      - 📄 [Login.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/pages/Login.jsx) — User account creation, signing in, and email confirmation
      - 📄 [Dashboard.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/pages/Dashboard.jsx) — Core user control panel
    - 📂 **[src/components](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/components)** — Components
      - 📄 [AttendanceCalendar.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/components/AttendanceCalendar.jsx) — Attendance logs calendar heatmap
      - 📄 [ClockPanel.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/components/ClockPanel.jsx) — Interactive clocking switch
      - 📄 [EmployeeDetailView.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/components/EmployeeDetailView.jsx) — Detail profile modal with view-only protection
      - 📄 [EmployeeDirectory.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/components/EmployeeDirectory.jsx) — List of team members with presence status indicators
      - 📄 [LeaveForm.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/components/LeaveForm.jsx) — Leave applications creator
      - 📄 [LeaveHistoryTable.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/components/LeaveHistoryTable.jsx) — Submitted requests log
      - 📄 [ProfileView.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/components/ProfileView.jsx) — Summary view of own details
      - 📄 [ProfileEditForm.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/components/ProfileEditForm.jsx) — Form to update profile details
      - 📄 [PayrollSlip.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/frontend/src/components/PayrollSlip.jsx) — Printable salary breakdown card
  - 📂 **[admin](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin)** — HR Admin Console (React + Vite)
    - 📂 **[src/pages](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin/src/pages)** — Views
      - 📄 [AdminLogin.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin/src/pages/AdminLogin.jsx) — Secure gateway for HR users
      - 📄 [AdminDashboard.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin/src/pages/AdminDashboard.jsx) — Full overview dashboard for HR operations
    - 📂 **[src/components](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin/src/components)** — Controls
      - 📄 [AttendanceGrid.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin/src/components/AttendanceGrid.jsx) — Real-time attendance grid for HR audit
      - 📄 [EditEmployeeModal.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin/src/components/EditEmployeeModal.jsx) — Admin employee details config window
      - 📄 [EmployeeDetailView.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin/src/components/EmployeeDetailView.jsx) — Multi-tab editor for profile, settings, and wage
      - 📄 [EmployeeDirectory.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin/src/components/EmployeeDirectory.jsx) — Employee roster search
      - 📄 [LeaveReviewTable.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin/src/components/LeaveReviewTable.jsx) — Action buttons to approve/reject requests
      - 📄 [ManualAttendanceModal.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin/src/components/ManualAttendanceModal.jsx) — Tool to retroactively override attendance
      - 📄 [PayrollRegistry.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin/src/components/PayrollRegistry.jsx) — Registry of payslips by employee
      - 📄 [SalaryModal.jsx](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/admin/src/components/SalaryModal.jsx) — Quick editor for monthly payroll values
  - 📄 [package.json](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/package.json) — Monorepo commands configuration
  - 📄 [render_deployment_guide.md](file:///c:/Users/Imran%20Hussain/Desktop/school%20management/render_deployment_guide.md) — Render deployment guide

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
