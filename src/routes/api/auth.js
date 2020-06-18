import express from 'express';

import apiAuthControllers from '../../controllers/api/auth';
import authMiddleWares from '../../middlewares/auth';

// eslint-disable-next-line new-cap
const apiAuthRouter = express.Router();

apiAuthRouter.post('/login', apiAuthControllers.login);
apiAuthRouter.get('/logout', authMiddleWares, apiAuthControllers.logout);
apiAuthRouter.get('/logoutall', authMiddleWares, apiAuthControllers.logoutAll);
apiAuthRouter.post('/signup', apiAuthControllers.signUp);

export default apiAuthRouter;
