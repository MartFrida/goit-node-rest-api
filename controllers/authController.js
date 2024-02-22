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
    throw HttpError(409, 'Email is already in use')
  }
  const newUser = await authServises.signup(req.body);
  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  })
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.findUser({ email })
  if (!user) {
    throw HttpError(401, 'Email or password invalid')
  }
  const passwordCompare = await bcrypt.compare(password, user.password)
  if (!passwordCompare) {
    throw HttpError(401, 'Password invalid')
  }

  const payload = {
    id: user._id
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' })

  res.json({
    token,
  })
}

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
}