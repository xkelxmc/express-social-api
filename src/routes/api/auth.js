import express from 'express';

import apiAuthControllers from '../../controllers/api/auth';
import authControllers from '../../controllers/auth';
import authMiddleWares from '../../middlewares/auth';

// eslint-disable-next-line new-cap
const apiAuthRouter = express.Router();

apiAuthRouter.post('/login', apiAuthControllers.login);
apiAuthRouter.get('/logout', authMiddleWares, apiAuthControllers.logout);
apiAuthRouter.get('/logoutall', authMiddleWares, apiAuthControllers.logoutAll);
apiAuthRouter.post(
    '/signup',
    authControllers.validateSignUp,
    apiAuthControllers.signUp
);

export default apiAuthRouter;
