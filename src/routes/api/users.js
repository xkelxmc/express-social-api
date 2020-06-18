import express from 'express';
import userControllers from '../../controllers/user';
import usersControllers from '../../controllers/users';

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.get('/user/', userControllers.getCurrentUser);
usersRouter.get('/user/:userId', userControllers.findOne);
usersRouter.get('/users/', usersControllers.findAll);

export default usersRouter;
