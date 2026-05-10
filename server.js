const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const errorMiddleware = require("./src/middlewares/error.middleware");

const authRoutes = require("./src/routes/auth.routes");
const patientRoutes = require("./src/routes/patient.routes");
const doctorRoutes = require("./src/routes/doctor.routes");
const appointmentRoutes = require("./src/routes/appointment.routes");
const medicalRecordRoutes = require("./src/routes/medicalRecord.routes");
const prescriptionRoutes = require("./src/routes/prescription.routes");
const billingRoutes = require("./src/routes/billing.routes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/billings", billingRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});