import express from 'express'
import validateBody from '../helpers/validateBody.js';
import { signupSchema, signinSchema } from '../schemas/usersSchemas.js';
import authController from '../controllers/authController.js';
import authenticate from '../middlewares/authenticate.js';
import upload from "../middlewares/upload.js";

const authRouter = express.Router()
authRouter.post('/users/register', validateBody(signupSchema), authController.signup)
authRouter.post('/users/login', validateBody(signinSchema), authController.signin)
authRouter.get('/users/current', authenticate, authController.getCurrent)
authRouter.post('/users/logout', authenticate, authController.signout)
authRouter.patch('/users/avatars', upload.single('avatar'), authenticate, authController.updateAvatar)

export default authRouter;

