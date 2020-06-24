import express from 'express';
import authMiddleWares from '../../middlewares/auth';
import usersRouter from './users';
import apiAuthRouter from './auth';
import postsRouter from './posts';

// eslint-disable-next-line new-cap
const apiRouter = express.Router();
apiRouter.use('/auth', apiAuthRouter);
apiRouter.use('/users', authMiddleWares, usersRouter);
apiRouter.use('/posts', authMiddleWares, postsRouter);

export default apiRouter;
