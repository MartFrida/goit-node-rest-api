import * as authServises from '../services/authServices.js';
import * as userServices from '../services/userServices.js'
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findUser({ email })
  if (user) {
    throw HttpError(409, 'Email in use')
  }
  const newUser = await authServises.signup(req.body);
  res.status(201).json({
    user: {
      email: newUser.email,
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