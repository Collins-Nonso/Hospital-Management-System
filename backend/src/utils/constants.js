// backend/src/utils/constants.js

const ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  RECEPTIONIST: "receptionist",
  PATIENT: "patient"
};

const APPOINTMENT_STATUS = {
  SCHEDULED: "scheduled",
  CANCELLED: "cancelled",
  COMPLETED: "completed"
};

const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid"
};

module.exports = {
  ROLES,
  APPOINTMENT_STATUS,
  PAYMENT_STATUS
};