const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Apply for Doctor
const applyDoctorController = async (req, res) => {
  try {
    const { name, email, phone, address, specialization, experience, fees, timings } = req.body;
    const userId = req.body.userId;

    // Check if doctor application already exists for this user
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      if (existingDoctor.status === 'approved') {
        return res.status(200).send({
          success: false,
          message: 'You are already registered as an approved doctor.',
        });
      } else if (existingDoctor.status === 'pending') {
        return res.status(200).send({
          success: false,
          message: 'Your previous application is already pending admin review.',
        });
      }
    }

    const newDoctor = new Doctor({
      userId,
      name,
      email,
      phone,
      address,
      specialization,
      experience,
      fees,
      timings: timings || ['09:00', '18:00'],
      status: 'pending',
    });
    await newDoctor.save();

    // Notify all admins
    const admins = await User.find({ isAdmin: true });
    for (const admin of admins) {
      admin.unseenNotifications.push({
        type: 'apply-doctor-request',
        message: `${newDoctor.name} has applied for doctor registration`,
        data: {
          doctorId: newDoctor._id,
          name: newDoctor.name,
          onClickPath: '/admin/doctors',
        },
        createdAt: new Date(),
      });
      await admin.save();
    }

    res.status(201).send({
      success: true,
      message: 'Doctor Registration request sent successfully',
    });
  } catch (error) {
    console.error('Apply doctor error:', error);
    res.status(500).send({
      success: false,
      message: 'Error while applying for doctor: ' + error.message,
    });
  }
};

// Get All Approved Doctors
const getAllApprovedDoctorsController = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: 'Doctors List Fetched Successfully',
      data: doctors,
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).send({
      success: false,
      message: 'Error while fetching doctors list: ' + error.message,
    });
  }
};

// Book Appointment
const bookAppointmentController = async (req, res) => {
  try {
    const { doctorId, date, time, doctorInfo } = req.body;
    const userId = req.body.userId;

    const user = await User.findById(userId);
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: 'Doctor not found',
      });
    }

    let documentUrl = '';
    let documentName = '';

    if (req.file) {
      documentUrl = `/uploads/${req.file.filename}`;
      documentName = req.file.originalname;
    }

    const newAppointment = new Appointment({
      userId,
      doctorId,
      doctorInfo: doctorInfo ? (typeof doctorInfo === 'string' ? JSON.parse(doctorInfo) : doctorInfo) : {
        name: doctor.name,
        specialization: doctor.specialization,
        fees: doctor.fees,
        phone: doctor.phone,
        address: doctor.address,
      },
      userInfo: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      date,
      time,
      documentUrl,
      documentName,
      status: 'pending',
    });

    await newAppointment.save();

    // Push notification to doctor user
    const doctorUser = await User.findById(doctor.userId);
    if (doctorUser) {
      doctorUser.unseenNotifications.push({
        type: 'New-appointment-request',
        message: `New appointment booked by ${user.name} for ${date} at ${time}`,
        data: {
          appointmentId: newAppointment._id,
          onClickPath: '/doctor/appointments',
        },
        createdAt: new Date(),
      });
      await doctorUser.save();
    }

    // Push notification to patient user
    user.unseenNotifications.push({
      type: 'appointment-booked',
      message: `Your appointment request with ${doctor.name} for ${date} at ${time} is submitted.`,
      data: {
        appointmentId: newAppointment._id,
        onClickPath: '/appointments',
      },
      createdAt: new Date(),
    });
    await user.save();

    res.status(200).send({
      success: true,
      message: 'Appointment booked successfully! Awaiting doctor approval.',
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).send({
      success: false,
      message: 'Error while booking appointment: ' + error.message,
    });
  }
};

// Get User Appointments
const getUserAppointmentsController = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId }).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: 'User Appointments Fetched Successfully',
      data: appointments,
    });
  } catch (error) {
    console.error('Get user appointments error:', error);
    res.status(500).send({
      success: false,
      message: 'Error while fetching appointments: ' + error.message,
    });
  }
};

// Mark all notifications as seen
const markAllNotificationsAsSeenController = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }
    const unseenNotifications = user.unseenNotifications || [];
    user.seenNotifications = [...(user.seenNotifications || []), ...unseenNotifications];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: 'All notifications marked as seen',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Mark notifications error:', error);
    res.status(500).send({
      success: false,
      message: 'Error in notification controller: ' + error.message,
    });
  }
};

// Delete all notifications
const deleteAllNotificationsController = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: 'All notifications deleted successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Delete notifications error:', error);
    res.status(500).send({
      success: false,
      message: 'Error deleting notifications: ' + error.message,
    });
  }
};

module.exports = {
  applyDoctorController,
  getAllApprovedDoctorsController,
  bookAppointmentController,
  getUserAppointmentsController,
  markAllNotificationsAsSeenController,
  deleteAllNotificationsController,
};
