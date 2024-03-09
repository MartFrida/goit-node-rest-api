import Joi from "joi";

import { emailRegexp } from '../constants/regexp.js'

export const signupSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
})

export const signinSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
})

export const verifyEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
})