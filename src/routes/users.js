import express from 'express';
import requireLogin from '../middlewares/requireLogin';
import userControllers from '../controllers/user';
import usersControllers from '../controllers/users';

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.get('/user/', requireLogin, userControllers.getCurrentUser);
usersRouter.get('/user/:userId', requireLogin, userControllers.findOne);
usersRouter.get('/users/', requireLogin, usersControllers.findAll);

export default usersRouter;
