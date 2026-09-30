const express = require('express');
const {
  getDoctorInfoController,
  updateDoctorProfileController,
  getDoctorAppointmentsController,
  updateAppointmentStatusController,
} = require('../controllers/doctorController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);
router.post('/updateProfile', authMiddleware, updateDoctorProfileController);
router.get('/doctor-appointments', authMiddleware, getDoctorAppointmentsController);
router.post('/change-appointment-status', authMiddleware, updateAppointmentStatusController);

module.exports = router;
