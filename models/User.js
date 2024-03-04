import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from './hooks.js';
import { emailRegexp } from '../constants/regexp.js'

const userSchema = new Schema({
  email: {
    type: String,
    match: emailRegexp,
    unique: true,
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  avatarURL: {
    type: String,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  }
}, { versionKey: false, timestamps: true })

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', setUpdateSetting);
userSchema.post('findOneAndUpdate', handleSaveError);

const User = model('user', userSchema)

export default User;