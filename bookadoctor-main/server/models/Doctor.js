const mongoose = require('mongoose');
const { ModelWrapper } = require('../config/storage');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
    },
    fees: {
      type: Number,
      required: [true, 'Fees per consultation is required'],
    },
    timings: {
      type: [String],
      required: [true, 'Work timings are required'],
      default: ['09:00', '18:00'],
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'approved', 'rejected'],
    },
  },
  { timestamps: true, bufferCommands: false }
);

const MongooseDoctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
const wrapper = new ModelWrapper('doctors', MongooseDoctor);

function DoctorModel(data) {
  return wrapper.instantiate(data);
}

Object.setPrototypeOf(DoctorModel, wrapper);
DoctorModel.findOne = wrapper.findOne.bind(wrapper);
DoctorModel.findById = wrapper.findById.bind(wrapper);
DoctorModel.find = wrapper.find.bind(wrapper);
DoctorModel.findByIdAndUpdate = wrapper.findByIdAndUpdate.bind(wrapper);
DoctorModel.findOneAndUpdate = wrapper.findOneAndUpdate.bind(wrapper);
DoctorModel.countDocuments = wrapper.countDocuments.bind(wrapper);
DoctorModel.create = wrapper.create.bind(wrapper);

module.exports = DoctorModel;
