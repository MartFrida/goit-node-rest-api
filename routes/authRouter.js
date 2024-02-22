import express from 'express'
import validateBody from '../helpers/validateBody.js';
import { signupSchema, signinSchema } from '../schemas/usersSchemas.js';
import authController from '../controllers/authController.js';

const authRouter = express.Router()
authRouter.post('/signup', validateBody(signupSchema), authController.signup)
authRouter.post('/signin', validateBody(signinSchema), authController.signin)

export default authRouter;