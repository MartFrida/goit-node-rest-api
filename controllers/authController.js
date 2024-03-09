import * as authServises from '../services/authServices.js';
import * as userServices from '../services/userServices.js'
import HttpError from '../helpers/HttpError.js';
import sendEmail from '../helpers/sendEmail.js';
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import gravatar from 'gravatar';
import Jimp from 'jimp';
import { nanoid } from 'nanoid';

const avatarDir = path.resolve('public', 'avatars')

const { JWT_SECRET, BASE_URL } = process.env;

const signup = async (req, res) => {

  const { email } = req.body;
  const user = await userServices.findUser({ email })
  if (user) {
    throw HttpError(409, 'Email already in use')
  }
  const gravatarPath = gravatar.url(email);

  const verificationCode = nanoid();

  const newUser = await authServises.signup(req.body, gravatarPath, verificationCode);

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/api/auth/users/verify/${verificationCode}">Click to verify email</a > `
  }

  await sendEmail(verifyEmail)

  res.status(201).json({
    user: {
      email: newUser.email,
      avatarURL: newUser.gravatarPath,
      subscription: "starter",
      verificationCode: newUser.verificationCode,
    }
  })
};

const verify = async (req, res) => {
  const { verificationCode } = req.params
  const user = await userServices.findUser({ verificationCode })
  if (!user) {
    throw HttpError(404, 'User not found')
  }
  await userServices.updateUser({ _id: user._id }, { verify: true, verificationCode: '' })
  res.json({
    message: 'Verify success'
  })
}

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body
  const user = await userServices.findUser({ email })
  if (!user) {
    throw HttpError(404, 'User not found')
  }
  if (user.validate) {
    throw HttpError(400, 'User already verified')
  }
  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/api/auth/users/verify/${user.verificationCode}">Click to verify email</a > `
  }

  await sendEmail(verifyEmail)
  res.json({
    message: 'Verify email sent success'
  })
}

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.findUser({ email })
  if (!user) {
    throw HttpError(401, 'Email or password is wrong')
  }
  if (!user.verify) {
    throw HttpError(401, 'Email is not verify')
  }
  const passwordCompare = await bcrypt.compare(password, user.password)
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong')
  }
  const payload = {
    id: user._id
  }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' })
  await authServises.setToken(user._id, token)

  res.json({
    token,
    user: {
      email: user.email,
      avatarURL: user.avatarURL,
      subscription: user.subscription,
    }
  })
}

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  })
}

const signout = async (req, res) => {
  const { _id } = req.user
  await authServises.setToken(_id)

  res.json({
    message: 'Signout success'
  })
}

async function updateAvatar(req, res) {
  const { _id } = req.user
  const { path: oldPath, filename } = req.file
  Jimp.read(oldPath)
    .then((image) => {
      if (!image) {
        return;
      }
      return image
        .cover(250, 250)
        .quality(60)
        .write(newPath);
    })
    .catch((err) => {
      console.error(err);
    })
  const newPath = path.join(avatarDir, filename)
  await fs.rename(oldPath, newPath)

  const avatarURL = path.join(avatarDir, filename)
  const newUser = await userServices.updateAvatar(_id, avatarURL)

  res.json({ avatarURL: newUser.avatarURL })
}

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateAvatar: ctrlWrapper(updateAvatar),
}