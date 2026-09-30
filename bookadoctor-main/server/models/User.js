const mongoose = require('mongoose');
const { ModelWrapper } = require('../config/storage');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    seenNotifications: {
      type: Array,
      default: [],
    },
    unseenNotifications: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, bufferCommands: false }
);

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);
const wrapper = new ModelWrapper('users', MongooseUser);

function UserModel(data) {
  return wrapper.instantiate(data);
}

Object.setPrototypeOf(UserModel, wrapper);
UserModel.findOne = wrapper.findOne.bind(wrapper);
UserModel.findById = wrapper.findById.bind(wrapper);
UserModel.find = wrapper.find.bind(wrapper);
UserModel.findByIdAndUpdate = wrapper.findByIdAndUpdate.bind(wrapper);
UserModel.findOneAndUpdate = wrapper.findOneAndUpdate.bind(wrapper);
UserModel.countDocuments = wrapper.countDocuments.bind(wrapper);
UserModel.create = wrapper.create.bind(wrapper);

module.exports = UserModel;
