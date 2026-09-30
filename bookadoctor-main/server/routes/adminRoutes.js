const express = require('express');
const {
  getAllDoctorsController,
  getAllUsersController,
  changeDoctorStatusController,
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);
router.get('/getAllUsers', authMiddleware, getAllUsersController);
router.post('/changeDoctorStatus', authMiddleware, changeDoctorStatusController);

module.exports = router;
