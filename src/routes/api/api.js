import express from 'express';
import authMiddleWares from '../../middlewares/auth';
import usersRouter from './users';

// eslint-disable-next-line new-cap
const apiRouter = express.Router();
apiRouter.use(authMiddleWares);
apiRouter.use(usersRouter);

export default apiRouter;
