With the below information as reference, using React/Vite framework, design a modern, simple admin dashboard, a home/landing page and all necessary actions that can be performed on the platform. The site should have a light/dark theme functionality, login/logout function, Register function and it should display all alerts, notofications, messages in a very nice and clean format. Responsive design for all devices and browsers and all other necessary features.


-----------------------------------------------------------------------------------------------------------------------------------------------------------

# 🏥 Hospital Management System API

A robust and scalable RESTful Hospital Management System API built with Node.js, Express.js, MongoDB, and Mongoose.

This project simulates a real-world hospital workflow including:

- User Authentication & Authorization
- Patient Management
- Doctor & Department Management
- Appointment Booking
- Consultations
- Medical Records
- Laboratory Requests & Results
- Prescriptions
- Pharmacy Dispensing
- Billing & Payments

The API follows industry-standard backend architecture patterns using Controllers, Services, Routes, Middleware, and Validation layers.

---

# 🚀 Features

## ✅ Authentication & Authorization
- JWT Authentication
- Password Hashing with bcryptjs
- Protected Routes
- Role-Based Access Control (RBAC)

## ✅ User Management
- Create users
- Get users
- Update users
- Delete users
- User roles:
  - Admin
  - Doctor
  - Nurse
  - Receptionist
  - Pharmacist
  - Lab Scientist

## ✅ Patient Management
- Create patient profile
- Medical details
- Emergency contacts
- Allergies
- Medical history

## ✅ Department Management
- Create departments
- Update departments
- Department status management

## ✅ Doctor Management
- Doctor profiles
- Specializations
- Availability
- Department assignment

## ✅ Appointment Management
- Book appointments
- Prevent double booking
- Confirm appointments
- Cancel appointments
- Complete appointments

## ✅ Consultation Management
- Symptoms
- Diagnosis
- Treatment plans
- Appointment linking

## ✅ Medical Records
- Patient medical history
- Treatment notes
- Diagnosis tracking

## ✅ Laboratory Module
- Create lab requests
- Upload lab results
- Prevent duplicate uploads

## ✅ Prescription Management
- Medication
- Dosage
- Frequency
- Duration
- Instructions

## ✅ Pharmacy Module
- Dispense prescriptions
- Prevent double dispensing
- Pharmacist tracking

## ✅ Billing & Payments
- Generate invoices
- Bill items
- Payment tracking
- Prevent duplicate payment

---

# 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| Node.js | Runtime Environment |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Joi | Validation |
| Jest | Testing |
| Supertest | API Testing |
| Morgan | Logging |
| CORS | Cross-Origin Requests |
| dotenv | Environment Variables |

---

# 📁 Project Structure

```bash
hospital-management-api/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validations/
│   ├── utils/
│   ├── tests/
│   └── app.js
│
├── server.js
├── package.json
├── .env
└── README.md
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/hospital-management-api.git
```

---

## 2. Navigate Into Project

```bash
cd hospital-management-api
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Create Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/hospital_management

JWT_SECRET=supersecretkey
```

---

## 5. Start Development Server

```bash
npm run dev
```

---

# ✅ Server Running

```bash
Server running on port 5000
MongoDB Connected
```

---

# 🔐 Authentication

The API uses JWT authentication.

After login:

```json
{
  "token": "YOUR_JWT_TOKEN"
}
```

Use token in protected routes:

```http
Authorization: Bearer YOUR_TOKEN
```

---

# 📌 Base URL

```http
http://localhost:5000/api
```

---

# 📚 API ENDPOINTS

# 🔑 AUTH ROUTES

## Register User

### POST `/api/auth/register`

### Request

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "123456",
  "role": "admin"
}
```

### Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## Login User

### POST `/api/auth/login`

### Request

```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "token": "JWT_TOKEN"
}
```

---

# 👤 USER ROUTES

## Get All Users

### GET `/api/users`

### Headers

```http
Authorization: Bearer TOKEN
```

### Response

```json
{
  "success": true,
  "count": 1,
  "data": []
}
```

---

# 🏥 DEPARTMENT ROUTES

## Create Department

### POST `/api/departments`

### Request

```json
{
  "name": "Cardiology",
  "description": "Heart treatment department"
}
```

### Response

```json
{
  "success": true,
  "message": "Department created successfully"
}
```

---

## Get Departments

### GET `/api/departments`

---

# 👨‍⚕️ DOCTOR ROUTES

## Create Doctor

### POST `/api/doctors`

### Request

```json
{
  "user": "USER_ID",
  "department": "DEPARTMENT_ID",
  "specialization": "Cardiologist",
  "availability": true
}
```

---

## Get Doctors

### GET `/api/doctors`

---

# 🧑‍🤝‍🧑 PATIENT ROUTES

## Create Patient

### POST `/api/patients`

### Request

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "dateOfBirth": "1990-05-20",
  "phone": "08012345678",
  "address": "Lagos",
  "bloodGroup": "O+",
  "allergies": ["Dust"]
}
```

---

## Get Patients

### GET `/api/patients`

---

# 📅 APPOINTMENT ROUTES

## Book Appointment

### POST `/api/appointments`

### Request

```json
{
  "patient": "PATIENT_ID",
  "doctor": "DOCTOR_ID",
  "appointmentDate": "2026-05-25",
  "appointmentTime": "10:00 AM"
}
```

### Features
- Prevents double booking
- Prevents past dates

---

## Cancel Appointment

### PATCH `/api/appointments/:id/cancel`

---

# 🩺 CONSULTATION ROUTES

## Create Consultation

### POST `/api/consultations`

### Request

```json
{
  "appointment": "APPOINTMENT_ID",
  "patient": "PATIENT_ID",
  "doctor": "DOCTOR_ID",
  "symptoms": "Fever",
  "diagnosis": "Malaria",
  "treatmentPlan": "Medication and rest"
}
```

---

# 📋 MEDICAL RECORD ROUTES

## Create Medical Record

### POST `/api/medical-records`

### Request

```json
{
  "patient": "PATIENT_ID",
  "doctor": "DOCTOR_ID",
  "diagnosis": "Typhoid",
  "symptoms": "Weakness",
  "treatmentNotes": "Prescribed antibiotics"
}
```

---

# 🧪 LAB ROUTES

## Create Lab Request

### POST `/api/labs/requests`

### Request

```json
{
  "patient": "PATIENT_ID",
  "doctor": "DOCTOR_ID",
  "testType": "Blood Test"
}
```

---

## Upload Lab Result

### POST `/api/labs/results`

### Request

```json
{
  "labRequest": "REQUEST_ID",
  "result": "Positive"
}
```

---

# 💊 PRESCRIPTION ROUTES

## Create Prescription

### POST `/api/prescriptions`

### Request

```json
{
  "patient": "PATIENT_ID",
  "doctor": "DOCTOR_ID",
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Twice Daily",
      "duration": "5 Days"
    }
  ]
}
```

---

# 🏪 PHARMACY ROUTES

## Dispense Prescription

### POST `/api/pharmacy/dispense`

### Request

```json
{
  "prescription": "PRESCRIPTION_ID",
  "patient": "PATIENT_ID",
  "pharmacist": "USER_ID",
  "drugsDispensed": [
    "Paracetamol",
    "Vitamin C"
  ]
}
```

### Features
- Prevent duplicate dispensing
- Updates prescription status

---

# 💳 BILLING ROUTES

## Create Bill

### POST `/api/billings`

### Request

```json
{
  "patient": "PATIENT_ID",
  "appointment": "APPOINTMENT_ID",
  "consultant": "DOCTOR_ID",
  "items": [
    {
      "name": "Consultation",
      "amount": 10000
    },
    {
      "name": "Lab Test",
      "amount": 5000
    }
  ]
}
```

---

## Mark Bill as Paid

### PATCH `/api/billings/:id/pay`

---

# ❌ Error Responses

## Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Validation Error

```json
{
  "success": false,
  "message": "\"email\" is required"
}
```

---

## Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

# 🧪 Running Tests

## Run All Tests

```bash
npm test
```

---

# ✅ Test Coverage Includes

- Authentication
- Departments
- Users
- Patients
- Appointments
- Medical Records
- Billing
- Prescriptions

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing
- Role Authorization
- Request Validation
- Error Handling
- Protected Routes

---

# 📦 Postman Collection

Import the included Postman collection:

```bash
Hospital-Management-System.postman_collection.json
```

---

# 🧰 Useful NPM Scripts

## Start Server

```bash
npm start
```

---

## Start Development Server

```bash
npm run dev
```

---

## Run Tests

```bash
npm test
```

---

# 👥 Contributors

## Group 4 — TS Academy Backend Development Capstone Project

### Contributors
- Collins Obetta
- Team Members

---

# 📄 License

MIT License

---

# 🌟 Acknowledgements

Special thanks to:

- TS Academy
- Open Source Community
- Node.js Community
- MongoDB Team

---

# 📬 Contact

For contributions, issues, or suggestions:

- GitHub: https://github.com/Collins-Nonso
- Email: Collinsnonso55@gmail.com

---

# ⭐ Support

If you found this project useful:

- Star the repository
- Fork the project
- Contribute improvements

---