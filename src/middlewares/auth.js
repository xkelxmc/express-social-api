import jwt from 'jsonwebtoken';
import Boom from '@hapi/boom';

import User from '../models/User';
import asyncHandler from './asyncHandler';

const auth = asyncHandler(async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({'_id': data._id, 'tokens.token': token});
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        return next(Boom.unauthorized('Not authorized to access this resource'));
    }
});

export default auth;
