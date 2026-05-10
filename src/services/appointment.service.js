const Appointment = require("../models/Appointment");

const createAppointment = async (data) => {
  const appointmentDate = new Date(data.appointmentDate);

  if (appointmentDate < new Date()) {
    throw new Error("Past appointment dates are not allowed");
  }

  const existingAppointment = await Appointment.findOne({
    doctor: data.doctor,
    appointmentDate: data.appointmentDate,
    status: {
      $in: ["pending", "confirmed"]
    }
  });

  if (existingAppointment) {
    throw new Error("Doctor already booked for this time");
  }

  return await Appointment.create(data);
};

module.exports = {
  createAppointment
};