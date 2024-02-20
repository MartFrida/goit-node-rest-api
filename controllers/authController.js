import * as authServises from '../services/authServices.js'
import HttpError from '../helpers/HttpError.js'
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const signup = (req, res) => { };

export default {
  signup: ctrlWrapper(signup)
}