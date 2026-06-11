// backend/src/app.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const appointmentRoutes = require("./routes/appointment.routes");
const authRoutes = require("./routes/auth.routes");
const billingRoutes = require("./routes/billing.routes");
const consultationRoutes = require("./routes/consultation.routes");
const departmentRoutes = require("./routes/department.routes");
const doctorRoutes = require("./routes/doctor.routes");
const labResultRoutes = require("./routes/labResult.routes");
const labRquestsRoutes = require("./routes/labRequest.route");
const medicalRecordRoutes = require("./routes/medicalRecord.routes");
const notificationRoutes = require("./routes/notification.route");
const patientRoutes = require("./routes/patient.routes");
const pharmacyRoutes = require("./routes/pharmacy.routes");
const prescriptionRoutes = require("./routes/prescription.routes");
const userRoutes = require("./routes/user.routes");

const loggerMiddleware = require("./middlewares/logger.middleware");

const errorMiddleware = require("./middlewares/error.middleware");

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(morgan("dev"));

app.use(loggerMiddleware);

app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/billings", billingRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/lab-results", labResultRoutes);
app.use("/api/lab-requests", labRquestsRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(errorMiddleware);

module.exports = app;
