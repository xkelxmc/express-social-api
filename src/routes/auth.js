import express from 'express';

import authControllers from '../controllers/auth';

// eslint-disable-next-line new-cap
const authRouter = express.Router();

authRouter.post('/auth/login', authControllers.login);
// authRouter.post('/auth/authentication', authControllers.authentication);
authRouter.get('/auth/logout', authControllers.logout);
// authRouter.get('/auth/logoutall', authControllers.logoutAll);
authRouter.post('/auth/signup', authControllers.signUp);

export default authRouter;
