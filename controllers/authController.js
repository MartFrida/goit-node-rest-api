import * as authServises from '../services/authServices.js';
import * as userServices from '../services/userServices.js'
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import gravatar from 'gravatar';



const avatarDir = path.resolve('public', 'avatars')

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const gravatarPath = gravatar.profile_url(req.body.email, { format: 'jpg' });
  console.log('gravatarPath: ', gravatarPath)
  console.log(req.body)
  console.log(req.file)
  const { path: oldPath, filename } = req.file
  const newPath = path.join(avatarDir, filename)
  await fs.rename(oldPath, newPath)
  const { email } = req.body;
  const user = await userServices.findUser({ email })
  if (user) {
    throw HttpError(409, 'Email in use')
  }
  const avatar = path.join('avatars', filename)
  const newUser = await authServises.signup(req.body, avatar);
  res.status(201).json({
    user: {
      email: newUser.email,
      avatarURL: avatar,
      subscription: "starter",
    }
  })
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.findUser({ email })
  if (!user) {
    throw HttpError(401, 'Email or password is wrong')
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

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
}