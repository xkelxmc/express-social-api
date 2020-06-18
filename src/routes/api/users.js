import express from 'express';
import usersControllers from '../../controllers/users';

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.get('/me', (req, res, next) => {
    return res.status(200).json(req.user);
});
usersRouter.get('/:userId', usersControllers.findOne);
usersRouter.get('/', usersControllers.findAll);

export default usersRouter;
