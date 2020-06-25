import express from 'express';

import authControllers from '../controllers/auth';

// eslint-disable-next-line new-cap
const authRouter = express.Router();

authRouter.post('/auth/login', authControllers.login);
authRouter.get('/auth/logout', authControllers.logout);
authRouter.post(
    '/auth/signup',
    authControllers.validateSignUp,
    authControllers.signUp
);

export default authRouter;
