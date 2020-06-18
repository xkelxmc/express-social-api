import express from 'express';

import requireLogin from '../middlewares/requireLogin';
import postsControllers from '../controllers/posts';

// eslint-disable-next-line new-cap
const postsRouter = express.Router();

postsRouter.route('/posts')
    .get(requireLogin, postsControllers.findAll)
    .post(requireLogin, postsControllers.createOne);

postsRouter.get('/posts/:postId', requireLogin, postsControllers.findOne);

export default postsRouter;
