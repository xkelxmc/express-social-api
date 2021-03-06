import express from 'express';

import requireLogin from '../middlewares/requireLogin';
import postsControllers from '../controllers/posts';

// eslint-disable-next-line new-cap
const postsRouter = express.Router();

postsRouter
    .route('/posts')
    .get(requireLogin, postsControllers.findAll)
    .post(requireLogin, postsControllers.createOne());

postsRouter.get(
    '/posts/user/:userId',
    requireLogin,
    postsControllers.findByUser
);
postsRouter.get('/posts/:postId', requireLogin, postsControllers.findOne);

postsRouter.post('/posts/:postId/up', postsControllers.upVote());
postsRouter.post('/posts/:postId/down', postsControllers.downVote());

export default postsRouter;
