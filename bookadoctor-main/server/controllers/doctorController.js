const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Get Doctor Info by userId
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: 'Doctor data fetched successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Get doctor info error:', error);
    res.status(500).send({
      success: false,
      message: 'Error fetching doctor details: ' + error.message,
    });
  }
};

// Update Doctor Profile
const updateDoctorProfileController = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).send({
      success: false,
      message: 'Error updating doctor profile: ' + error.message,
    });
  }
};

// Get Doctor Appointments
const getDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id }).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: 'Doctor appointments fetched successfully',
      data: appointments,
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).send({
      success: false,
      message: 'Error in fetching doctor appointments: ' + error.message,
    });
  }
};

// Update Appointment Status (Approve / Reject)
const updateAppointmentStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: 'Appointment not found',
      });
    }

    const patient = await User.findById(appointment.userId);
    if (patient) {
      patient.unseenNotifications.push({
        type: 'appointment-status-updated',
        message: `Your appointment with ${appointment.doctorInfo.name} scheduled for ${appointment.date} at ${appointment.time} has been ${status.toUpperCase()}`,
        data: {
          appointmentId: appointment._id,
          onClickPath: '/appointments',
        },
        createdAt: new Date(),
      });
      await patient.save();
    }

    res.status(200).send({
      success: true,
      message: `Appointment successfully ${status}!`,
      data: appointment,
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).send({
      success: false,
      message: 'Error updating appointment status: ' + error.message,
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateDoctorProfileController,
  getDoctorAppointmentsController,
  updateAppointmentStatusController,
};
