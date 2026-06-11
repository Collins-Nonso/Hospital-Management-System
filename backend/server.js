// backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const errorMiddleware = require("./src/middlewares/error.middleware");

const appointmentRoutes = require("./src/routes/appointment.routes");
const authRoutes = require("./src/routes/auth.routes");
const billingRoutes = require("./src/routes/billing.routes");
const consultationRoutes = require("./src/routes/consultation.routes");
const departmentRoutes = require("./src/routes/department.routes");
const doctorRoutes = require("./src/routes/doctor.routes");
const labResultRoutes = require("./src/routes/labResult.routes");
const labRequestRoutes = require("./src/routes/labRequest.route");
const medicalRecordRoutes = require("./src/routes/medicalRecord.routes");
const notificationRoutes = require("./src/routes/notification.route");
const patientRoutes = require("./src/routes/patient.routes");
const pharmacyRoutes = require("./src/routes/pharmacy.routes");
const prescriptionRoutes = require("./src/routes/prescription.routes");
const userRoutes = require("./src/routes/user.routes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/billings", billingRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/lab-results", labResultRoutes);
app.use("/api/lab-requests", labRequestRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
