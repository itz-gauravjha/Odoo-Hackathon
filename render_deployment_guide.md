# Render Deployment Guide

Follow these instructions to host the HRMS system on Render as a single unified service. This handles both the Employee Portal and the HR Admin Console under a single domain, optimizing performance and staying completely within Render's free tier.

---

## 1. Production Architecture Overview

To avoid paying for separate hosting instances, the application is configured to build both frontends and serve them statically from the Express backend:
* **Employee Portal (`http://localhost:5173/` in dev)** compiles and is served at the root path: `/`
* **HR Admin Console (`http://localhost:5174/` in dev)** compiles with base path `/admin/` and is served at: `/admin/`
* **Express APIs** remain mounted under `/api/*`

---

## 2. Git Setup (Before Deploying)
Ensure all modified build pipelines are committed and pushed to the `hrms-features` branch on your GitHub repository:
```powershell
git add .
git commit -m "Configure production Vite config paths and Render build pipelines"
git push origin hrms-features
```

---

## 3. Render Web Service Configurations

1. **Log in** to your dashboard at [Render.com](https://render.com/).
2. Click **New +** and select **Web Service**.
3. **Connect your Repository**: Select `itz-gauravjha/Odoo-Hackathon` (or search for its URL: `https://github.com/itz-gauravjha/Odoo-Hackathon.git`).
4. Set the following basic parameters:
   * **Name**: `odoo-hrms-system` (or any name you prefer)
   * **Region**: Choose the closest location (e.g., Singapore or US East)
   * **Branch**: `hrms-features`
   * **Runtime**: `Node`
   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
   * **Instance Type**: `Free`

---

## 4. Environment Variables Configuration
In the **Environment** tab, click **Add Environment Variable** and enter the following values:

| Key | Value | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Switches Express optimization mode |
| `MONGODB_URI` | `mongodb+srv://salehhayat632_db_user:nPzMWir6kqLgpb52@cluster0.p2tlj3m.mongodb.net/?appName=Cluster0` | Database URI |
| `SESSION_SECRET` | `supersecretkeyhrms123` | Session encryption secret key |
| `SMTP_USER` | `stackzyx@gmail.com` | Email account for OTP delivery |
| `SMTP_PASS` | `yfec jafh tryu xsni` | Gmail App Password for SMTP |

Click **Save Changes**. Render will automatically kick off the build!

---

## 5. Verifying the Deployment
Once the build completes successfully, Render will provide a deployment URL (e.g., `https://odoo-hrms-system.onrender.com/`).
* **Staff Access**: Go to `https://odoo-hrms-system.onrender.com/` to access the main Employee Portal.
* **HR Authority Access**: Go to `https://odoo-hrms-system.onrender.com/admin/` to log in to the HR Admin Console.
* **Live Switching**: Logging in as an HR account on the Employee Portal will show an `Admin Console ➜` header button that routes cleanly to `/admin/` in the browser tab.
