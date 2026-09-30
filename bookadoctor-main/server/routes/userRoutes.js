const express = require('express');
const {
  applyDoctorController,
  getAllApprovedDoctorsController,
  bookAppointmentController,
  getUserAppointmentsController,
  markAllNotificationsAsSeenController,
  deleteAllNotificationsController,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/apply-doctor', authMiddleware, applyDoctorController);
router.get('/getAllDoctors', getAllApprovedDoctorsController);
router.post('/book-appointment', authMiddleware, upload.single('document'), bookAppointmentController);
router.get('/user-appointments', authMiddleware, getUserAppointmentsController);
router.post('/get-all-notification', authMiddleware, markAllNotificationsAsSeenController);
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationsController);

module.exports = router;
