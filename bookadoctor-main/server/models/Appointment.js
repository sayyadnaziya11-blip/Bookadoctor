const mongoose = require('mongoose');
const { ModelWrapper } = require('../config/storage');

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    doctorInfo: {
      type: Object,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    documentUrl: {
      type: String,
      default: '',
    },
    documentName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['pending', 'approved', 'rejected', 'completed'],
    },
  },
  { timestamps: true, bufferCommands: false }
);

const MongooseAppointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
const wrapper = new ModelWrapper('appointments', MongooseAppointment);

function AppointmentModel(data) {
  return wrapper.instantiate(data);
}

Object.setPrototypeOf(AppointmentModel, wrapper);
AppointmentModel.findOne = wrapper.findOne.bind(wrapper);
AppointmentModel.findById = wrapper.findById.bind(wrapper);
AppointmentModel.find = wrapper.find.bind(wrapper);
AppointmentModel.findByIdAndUpdate = wrapper.findByIdAndUpdate.bind(wrapper);
AppointmentModel.findOneAndUpdate = wrapper.findOneAndUpdate.bind(wrapper);
AppointmentModel.countDocuments = wrapper.countDocuments.bind(wrapper);
AppointmentModel.create = wrapper.create.bind(wrapper);

module.exports = AppointmentModel;
