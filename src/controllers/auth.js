import Boom from '@hapi/boom';

import User from '../models/User';

import asyncHandler from '../middlewares/asyncHandler';

const validateSignUp = asyncHandler(async (req, res, next) => {
    const {email, password, name, lastName} = req.body;
    if (!name) {
        return next(Boom.badData('missing name'));
    }
    if (!lastName) {
        return next(Boom.badData('missing lastName'));
    }
    if (!email || !password) {
        return next(Boom.badData('missing email or password'));
    }
    const user = await User.findOne({email} );
    if (user) {
        return next(Boom.conflict('email already taken'));
    }
    next();
});

const signUp = asyncHandler(async (req, res, next) => {
    const {email, password, name, lastName} = req.body;
    try {
        const newUser = new User({email, password, name, lastName});
        await newUser.save();
        req.session.userId = newUser._id;
        return res.json(newUser);
    } catch (err) {
        return next(Boom.badRequest(err.message));
    }
});

const login = asyncHandler(async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return next(Boom.badData('missing email or password'));
        }
        try {
            const user = await User.findByCredentials(email, password);
            if (!user) {
                return next(Boom.unauthorized('Login failed! Check authentication credentials'));
            }
            req.session.userId = user._id;
            return res.json(user);
        } catch (e) {
            return next(Boom.unauthorized(e));
        }
    } catch (error) {
        return next(Boom.badRequest(error));
    }
});

const logout = asyncHandler(async (req, res, next) => {
    if (req.session.userId) {
        return req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            return res.json({});
        });
    }
    return res.status(200).end();
});

export default {
    login,
    logout,
    signUp,
    validateSignUp,
};
