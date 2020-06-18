import Boom from '@hapi/boom';

import User from '../../models/User';

import asyncHandler from '../../middlewares/asyncHandler';

const signUp = asyncHandler(async (req, res, next) => {
    const {email, password, name, lastName} = req.body;
    try {
        const newUser = new User({email, password, name, lastName});
        await newUser.save();
        const token = await newUser.generateAuthToken();
        return res.json({newUser, token});
    } catch (err) {
        return next(Boom.badRequest(err.message));
    }
});

const login = asyncHandler(async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return next(Boom.badData('missing email or password2'));
        }
        try {
            const user = await User.findByCredentials(email, password);
            if (!user) {
                return next(Boom.unauthorized('Login failed! Check authentication credentials'));
            }
            const token = await user.generateAuthToken();
            return res.json({user, token});
        } catch (e) {
            return next(Boom.unauthorized(e));
        }
    } catch (error) {
        return next(Boom.badRequest(error));
    }
});

const logout = asyncHandler(async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        return res.status(200).end();
    } catch (error) {
        return next(Boom.internal(error));
    }
});

const logoutAll = asyncHandler(async (req, res, next) => {
    try {
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();
        return res.status(200).end();
    } catch (error) {
        return next(Boom.internal(error));
    }
});

export default {
    login,
    logout,
    logoutAll,
    signUp,
};
