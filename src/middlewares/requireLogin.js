import Boom from '@hapi/boom';

export default (req, res, next) => {
    if (!req.session.userId) return next(Boom.unauthorized('login required'));
    return next();
};
