import Boom from '@hapi/boom';
import User from '../models/User';
import asyncHandler from '../middlewares/asyncHandler';

const getCurrentUser = asyncHandler(async (req, res, next) => {
    const {userId} = req.session;
    try {
        const user = await User.findById(userId);
        return res.status(200).json(user);
    } catch (err) {
        return next(Boom.unauthorized('user not found'));
    }
});

const findOne = asyncHandler(async (req, res, next) => {
    const {userId} = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error();
        }
        return res.status(200).json(user);
    } catch (err) {
        return next(Boom.notFound('user not found'));
    }
});

const findAll = asyncHandler(async (req, res) => {
    const users = await User.find();
    return res.json(users);
});

export default {
    getCurrentUser,
    findOne,
    findAll,
};
