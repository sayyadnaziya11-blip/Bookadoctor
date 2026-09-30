const User = require('../models/User');
const Doctor = require('../models/Doctor');

// Get All Doctors (for Admin)
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: 'Doctors Data List Fetched Successfully',
      data: doctors,
    });
  } catch (error) {
    console.error('Admin get doctors error:', error);
    res.status(500).send({
      success: false,
      message: 'Error fetching doctors: ' + error.message,
    });
  }
};

// Get All Users (for Admin)
const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: 'Users Data List Fetched Successfully',
      data: users,
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).send({
      success: false,
      message: 'Error fetching users: ' + error.message,
    });
  }
};

// Change Doctor Account Status (Approve / Reject)
const changeDoctorStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: 'Doctor not found',
      });
    }

    const user = await User.findById(doctor.userId);
    if (user) {
      user.isDoctor = status === 'approved';
      user.unseenNotifications.push({
        type: 'doctor-account-request-updated',
        message: `Your doctor application status has been updated to: ${status.toUpperCase()}`,
        data: {
          doctorId: doctor._id,
          name: doctor.name,
          status: status,
          onClickPath: '/doctor/appointments',
        },
        createdAt: new Date(),
      });
      await user.save();
    }

    res.status(200).send({
      success: true,
      message: 'Successfully updated approve status of the doctor!',
      data: doctor,
    });
  } catch (error) {
    console.error('Change doctor status error:', error);
    res.status(500).send({
      success: false,
      message: 'Error in changing doctor status: ' + error.message,
    });
  }
};

module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  changeDoctorStatusController,
};
