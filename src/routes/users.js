import express from 'express';
import requireLogin from '../middlewares/requireLogin';
import usersControllers from '../controllers/users';

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.get('/me', requireLogin, usersControllers.getCurrentUser);
usersRouter.get('/:userId', requireLogin, usersControllers.findOne);
usersRouter.get('/', requireLogin, usersControllers.findAll);

export default usersRouter;
