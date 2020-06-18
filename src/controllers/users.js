import User from '../models/User';

import asyncHandler from '../middlewares/asyncHandler';

const findAll = asyncHandler(async (req, res) => {
    const users = await User.find();
    return res.json(users);
});

export default {
    findAll,
};
