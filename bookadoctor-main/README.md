# MediCareBook - Book A Doctor Web Application

A full-stack healthcare booking platform built using the **MERN** stack (MongoDB, Express.js, React, Node.js). The application connects patients with doctors, featuring role-based dashboards, appointment scheduling with document uploads, and an instant notification system.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v16+)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or MongoDB Atlas connection string)

---

### 2. Backend Setup (`server/`)
1. Open a terminal and navigate to `server/`:
   ```bash
   cd server
   ```
2. Install dependencies (already installed):
   ```bash
   npm install
   ```
3. Configure environment variables in `.env` (already created):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/book_a_doctor
   JWT_SECRET=medicare_secret_jwt_key_2026_super_secure
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *The server runs on `http://localhost:5000`.*

---

### 3. Frontend Setup (`client/`)
1. Open a second terminal and navigate to `client/`:
   ```bash
   cd client
   ```
2. Install dependencies (already installed):
   ```bash
   npm install
   ```
3. Start Vite React development server:
   ```bash
   npm run dev
   ```
   *The frontend runs on `http://localhost:3000`.*

---

## 🔑 Default Accounts & Credentials

### Admin Account (Pre-seeded)
- **Email:** `admin@medicare.com`
- **Password:** `Admin@123`
- **Features:** Manage doctor applications (Approve / Reject), view all users and doctors.

### Pre-seeded Sample Doctors
- **Dr. Koushick** (`k@gmail.com` / `Doctor@123`) - ENT Specialization
- **Dr. SHIVA** (`user@gamil.com` / `Doctor@123`) - Blood Specialization
- **Dr. Karthick** (`ka@gmail.com` / `Doctor@123`) - Cardiology (Pending approval)

### New Users / Patients
- Click **Register** on the login screen to register as a new User or Admin.

---

## ✨ Features & User Flows

1. **User Registration & Login**: Role selection (User or Admin) with secure JWT and bcrypt encryption.
2. **Doctor Browsing & Booking**: View approved doctors with specialty, experience, fees, and schedule.
3. **Medical Document Upload**: Attach prescriptions, lab reports, or scans when scheduling an appointment.
4. **Doctor Application & Admin Approval**: Users can apply to become doctors; Admin reviews, approves, or rejects requests.
5. **Role-based Dashboards & Notifications**: Bell notifications with badge count for booking updates, doctor status approvals, and appointment confirmations.
