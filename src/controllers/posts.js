import Boom from '@hapi/boom';

import Post from '../models/Post';
import User from '../models/User';

import asyncHandler from '../middlewares/asyncHandler';

const findAll = asyncHandler(async (req, res) => {
    const posts = await Post.find();
    return res.json(posts);
});

const findOne = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        return res.status(200).json(post);
    } catch (err) {
        return next(Boom.notFound('post not found'));
    }
});

const findByUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    try {
        const posts = await Post.find({ author: userId });
        return res.status(200).json(posts);
    } catch (err) {
        return next(Boom.notFound('post not found'));
    }
});

const createOne = (type = 'default') =>
    asyncHandler(async (req, res, next) => {
        const userId = type === 'api' ? req.user._id : req.session.userId;
        const { title, body } = req.body;
        if (!title || !body) {
            return next(Boom.badData('missing title or body'));
        }

        const newPost = new Post({
            title,
            body,
            author: userId,
        });

        try {
            await User.findByIdAndUpdate(userId, { $push: { posts: newPost } });
        } catch (err) {
            return next(Boom.unauthorized('user not found'));
        }

        await newPost.save();
        return res.status(201).send(newPost);
    });

const upVote = (type = 'default') =>
    asyncHandler(async (req, res, next) => {
        const userId = type === 'api' ? req.user._id : req.session.userId;
        const { postId } = req.params;

        try {
            const post = await Post.findById(postId);
            const isUserDownVote = post
                .toObject()
                .upvoters.find((item) => item.toString() === userId.toString());

            if (isUserDownVote) {
                return next(Boom.badRequest('User already up vote this post'));
            }
            const user = await User.findById(userId);

            post.upvoters.push(userId);
            user.upvoters.push(postId);
            await post.save();
            await user.save();

            return res.status(200).json(post);
        } catch (err) {
            return next(Boom.unauthorized('post not found'));
        }
    });

const downVote = (type = 'default') =>
    asyncHandler(async (req, res, next) => {
        const userId = type === 'api' ? req.user._id : req.session.userId;
        const { postId } = req.params;

        try {
            const post = await Post.findById(postId);
            const isUserDownVote = post
                .toObject()
                .downvoters.find(
                    (item) => item.toString() === userId.toString()
                );

            if (isUserDownVote) {
                return next(
                    Boom.badRequest('User already down vote this post')
                );
            }
            const user = await User.findById(userId);

            post.downvoters.push(userId);
            user.downvoters.push(postId);
            await post.save();
            await user.save();

            return res.status(200).json(post);
        } catch (err) {
            return next(Boom.unauthorized('post not found'));
        }
    });

export default {
    createOne,
    findAll,
    findOne,
    findByUser,
    upVote,
    downVote,
};
