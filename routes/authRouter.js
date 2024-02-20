import express from 'express'
import validateBody from '../helpers/validateBody.js';
import { signupSchema, signinSchema } from '../schemas/usersSchemas.js';
import authController from '../controllers/authController.js';

const authRouter = express.Router()
authRouter.post('/signup', validateBody(signupSchema), authController.signup)

export default authRouter;