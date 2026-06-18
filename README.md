# MediCore — Hospital Management System
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start-FF4154)](https://tanstack.com/start)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#license)
A full-stack Hospital Management platform that unifies **patients, doctors,
appointments, consultations, lab, pharmacy and billing** behind a single
role-based dashboard.
- **Frontend** — React 19 + TanStack Start + Tailwind v4 + shadcn/ui
- **Backend** — Node.js + Express + Mongoose (MongoDB) + JWT auth
- **Auth** — JWT bearer tokens, role-based access control (RBAC)
- **Real-time UX** — optimistic updates with background polling refresh
---
## Table of contents
- [Features](#features)
- [Architecture](#architecture)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [User roles](#user-roles)
- [API reference](#api-reference)
- [Postman collection](#postman-collection)
- [Sample requests](#sample-requests)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
---
## Features
| Module | What it does |
| --- | --- |
| **Patients** | Register, search, edit and remove patient records with allergies, history and emergency contacts. |
| **Doctors** | Manage doctor profiles, department assignment and live availability toggle. |
| **Departments** | Create departments, toggle active/inactive status, see live doctor counts. |
| **Appointments** | Book, confirm, complete or cancel appointments with double-booking and past-date protection. |
| **Consultations** | Capture symptoms, diagnosis and treatment plans linked to appointments. |
| **Medical records** | Persistent clinical notes per patient. |
| **Lab** | Lab requests, result uploads, duplicate-upload prevention. |
| **Prescriptions & Pharmacy** | Issue prescriptions and dispense with audit trail. |
| **Billing** | Invoice generation, item-level pricing, mark paid. |
| **Notifications** | In-app bell with mark-read / mark-all-read. |
| **Users & roles** | Admin-only CRUD for staff accounts across six roles. |
| **Dashboard** | KPI cards plus Bar/Pie charts driven from live MongoDB data. |
---
## Architecture
```text
┌──────────────────────────┐      HTTPS/JSON      ┌──────────────────────────┐
│  Web client              │  ───── Bearer ───►   │  Express API             │
│  React 19 + TanStack     │                      │  /api/*                  │
│  Start, shadcn/ui        │  ◄──── JSON ──────   │  Controllers → Services  │
└─────────────┬────────────┘                      └─────────────┬────────────┘
              │                                                 │
              │ optimistic store (zustand-like)                 │ Mongoose ODM
              ▼                                                 ▼
        local cache + polling                            MongoDB (Atlas)
```
- **Stateless API** — every request carries `Authorization: Bearer <jwt>`.
- **RBAC** — `protect` + `authorizeRoles("admin", …)` middleware on sensitive routes.
- **Client cache** — pages read from a small in-memory store that is rehydrated
  on login, after every mutation, on tab focus and every 15s.
---
## Quick start
### Prerequisites
- Node.js ≥ 18 and npm / bun
- A MongoDB connection string (local or Atlas)
### 1. Clone
```bash
git clone https://github.com/Collins-Nonso/Hospital-Management-System.git
cd Hospital-Management-System
```
### 2. Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, PORT
npm run dev            # http://localhost:5000
```
### 3. Frontend
```bash
cd ../client            # or the root if the client lives there
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev             # http://localhost:8080
```
Open `http://localhost:8080`, register the first user (becomes admin if you
seed it so), then sign in.
---
## Environment variables
### Backend (`backend/.env`)
| Variable | Required | Example |
| --- | --- | --- |
| `PORT` | yes | `5000` |
| `MONGO_URI` | yes | `mongodb+srv://user:pass@cluster.mongodb.net/medicore` |
| `JWT_SECRET` | yes | `super-secret-string` |
| `JWT_EXPIRES_IN` | no | `7d` |
| `NODE_ENV` | no | `development` |
### Frontend (`.env`)
| Variable | Required | Example |
| --- | --- | --- |
| `VITE_API_URL` | yes | `http://localhost:5000/api` |
---
## User roles
| Role | Capabilities |
| --- | --- |
| `admin` | Full access, manages users, departments, doctors, billing |
| `doctor` | Consultations, prescriptions, lab requests, own appointments |
| `nurse` | View patients, appointments, basic record entry |
| `receptionist` | Register patients, book appointments, billing |
| `pharmacist` | View prescriptions, dispense medications |
| `lab_scientist` | Receive lab requests, upload results |
---
## API reference
Base URL: `http://localhost:5000/api`
All protected routes require `Authorization: Bearer <token>`.
### Auth
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | public | Create account, returns user + JWT |
| POST | `/auth/login` | public | Sign in, returns user + JWT |
| POST | `/auth/logout` | bearer | Invalidate session |
| GET | `/auth/:id` | bearer | Re-validate session for a user |
### Users (admin)
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/users` | admin | List staff accounts |
| POST | `/users` | admin | Create staff account |
| GET | `/users/:id` | bearer | Get user |
| PUT | `/users/:id` | bearer | Update user (admin or self) |
| DELETE | `/users/:id` | admin | Delete user |
### Patients · Doctors · Departments
| Method | Endpoint | Description |
| --- | --- | --- |
| GET/POST | `/patients` · `/patients/:id` (PUT, DELETE) | Patient CRUD |
| GET/POST | `/doctors` · `/doctors/:id` (PUT, DELETE) | Doctor CRUD |
| GET/POST | `/departments` · `/departments/:id` (PUT, DELETE) | Department CRUD |
### Appointments · Consultations · Records
| Method | Endpoint | Description |
| --- | --- | --- |
| GET/POST | `/appointments` | List / create |
| PATCH | `/appointments/:id` | Update (status, notes) |
| PATCH | `/appointments/:id/cancel` | Cancel |
| GET/POST | `/consultations`, PUT `/consultations/:id` | Consultation CRUD |
| GET/POST | `/medical-records` | Record CRUD |
### Lab · Prescriptions · Pharmacy · Billing
| Method | Endpoint | Description |
| --- | --- | --- |
| GET/POST | `/lab-requests` | Lab orders |
| GET/POST | `/lab-results` | Lab results upload |
| GET/POST | `/prescriptions` | Prescriptions |
| POST | `/pharmacies/dispense` | Dispense a prescription |
| GET | `/pharmacies` | Dispensed log |
| GET/POST | `/billings` | Invoices |
| PATCH | `/billings/:id/pay` | Mark paid |
### Notifications
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/notifications` | List |
| PATCH | `/notifications/:id` | Mark single read |
| POST | `/notifications/read-all` | Mark all read |
---
## Postman collection
Save the following as `postman/MediCore.postman_collection.json` and import
into Postman. Set a collection variable `baseUrl = http://localhost:5000/api`
and `token` (auto-populated on login via the test script).
```json
{
  "info": {
    "name": "MediCore Hospital Management System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:5000/api" },
    { "key": "token", "value": "" }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [{ "key": "token", "value": "{{token}}", "type": "string" }]
  },
  "item": [
    {
      "name": "Auth — Register",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "url": "{{baseUrl}}/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"firstName\": \"Ada\",\n  \"lastName\": \"Lovelace\",\n  \"email\": \"ada@medicore.com\",\n  \"password\": \"secret123\",\n  \"role\": \"admin\"\n}"
        }
      }
    },
    {
      "name": "Auth - Login",
      "event": [{
        "listen": "test",
        "script": { "exec": [
          "const json = pm.response.json();",
          "const token = json?.data?.token || json?.token;",
          "if (token) pm.collectionVariables.set('token', token);"
        ]}
      }],
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "url": "{{baseUrl}}/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"ada@medicore.com\",\n  \"password\": \"secret123\"\n}"
        }
      }
    },
    {
      "name": "Patients - Create",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/patients",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": { "mode": "raw", "raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"gender\": \"male\",\n  \"dateOfBirth\": \"1990-05-12\",\n  \"phone\": \"+2348012345678\",\n  \"address\": \"12 Health Street\",\n  \"bloodGroup\": \"O+\",\n  \"allergies\": [\"penicillin\"],\n  \"emergencyContact\": { \"name\": \"Jane Doe\", \"phone\": \"+2348098765432\", \"relationship\": \"spouse\" }\n}" }
      }
    },
    {
      "name": "Departments - Toggle status",
      "request": {
        "method": "PUT",
        "url": "{{baseUrl}}/departments/:id",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": { "mode": "raw", "raw": "{ \"status\": \"inactive\" }" }
      }
    },
    {
      "name": "Appointments - Book",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/appointments",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": { "mode": "raw", "raw": "{\n  \"patient\": \"<patientId>\",\n  \"doctor\": \"<doctorId>\",\n  \"appointmentDate\": \"2026-07-01\",\n  \"appointmentTime\": \"10:30\",\n  \"reason\": \"Routine checkup\"\n}" }
      }
    },
    {
      "name": "Billing - Mark paid",
      "request": {
        "method": "PATCH",
        "url": "{{baseUrl}}/billings/:id/pay"
      }
    }
  ]
}
```
---
## Sample requests
### Register
```http
POST /api/auth/register
Content-Type: application/json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@medicore.com",
  "password": "secret123",
  "role": "admin"
}
```
Response `201`:
```json
{ "success": true, "data": { "user": { "id": "…", "email": "john@medicore.com", "role": "admin" }, "token": "eyJhbGciOi..." } }
```
### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "john@medicore.com", "password": "secret123" }'
```
### Create a user (admin only)
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Grace",
    "lastName": "Hopper",
    "email": "grace@medicore.com",
    "password": "cobol123",
    "role": "doctor"
  }'
```
### Toggle a department
```bash
curl -X PUT http://localhost:5000/api/departments/64f0…/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "inactive" }'
```
### Book an appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patient": "<patientId>",
    "doctor":  "<doctorId>",
    "appointmentDate": "2026-07-01",
    "appointmentTime": "10:30",
    "reason": "Routine checkup"
  }'
```
---
## Project structure
```text
.
├── backend/
│   └── src/
│       ├── controllers/      # request → service
│       ├── services/         # business logic, Mongoose calls
│       ├── models/           # Mongoose schemas
│       ├── routes/           # Express routers
│       ├── middlewares/      # auth, role, validate, error
│       └── validations/      # Joi schemas
├── client
│   └── src/                  # React client (TanStack Start)
│       ├── routes/           # file-based routing (/, /login, /dashboard/*)
│       ├── components/       # UI + shadcn/ui
│       ├── lib/              # api client, auth, store, theme
│       └── styles.css        # Tailwind v4
└── README.md
```
---
## Scripts
### Backend
```bash
npm run dev      # nodemon, hot reload
npm start        # production
npm test         # jest (if configured)
```
### Frontend
```bash
npm run dev      # Vite dev server on :8080
npm run build    # production build
npm run preview  # preview the build
```
---
## Contributing
## Group 4 — TS Academy Backend Development Capstone Project
1. Fork and create a feature branch (`git checkout -b feat/my-change`).
2. Commit with conventional messages (`feat:`, `fix:`, `docs:`).
3. Open a Pull Request describing the change and screenshots if UI.
Please run `npm run build` and ensure no TypeScript errors before pushing.
---
## License
[MIT](LICENSE) © Collins Nonso