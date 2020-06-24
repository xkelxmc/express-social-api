import express from 'express';

import postsControllers from '../../controllers/posts';
import requireLogin from '../../middlewares/requireLogin';

// eslint-disable-next-line new-cap
const postsRouter = express.Router();

postsRouter.route('/')
    .get(postsControllers.findAll)
    .post(postsControllers.createOne('api'));

postsRouter.get('/user/:userId', postsControllers.findByUser);

postsRouter.get('/:postId', postsControllers.findOne);

export default postsRouter;
