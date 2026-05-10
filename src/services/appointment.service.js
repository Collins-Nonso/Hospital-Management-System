const Appointment = require("../models/Appointment");

const bookAppointment = async (data) => {
  const existingAppointment = await Appointment.findOne({
    doctor: data.doctor,
    appointmentDate: data.appointmentDate,
    status: "scheduled"
  });

  if (existingAppointment) {
    throw new Error("Doctor already booked for this slot");
  }

  return await Appointment.create(data);
};

module.exports = {
  bookAppointment
};