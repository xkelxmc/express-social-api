import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import commentMongo from 'connect-mongo';

import authRoutes from './src/routes/auth';
import usersRouter from './src/routes/users';
import postsRouter from './src/routes/posts';

import notFound from './src/middlewares/notFound';
import errorHandler from './src/middlewares/errorHandler';

const app = express();
const MongoStore = commentMongo(session);

app.use(session({
    secret: process.env.SESSION_SECRET,
    name: 'sessionId',
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({url: process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST_URI : process.env.MONGO_URI}),
    cookie: {maxAge: 30 * 24 * 60 * 60 * 1000},
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(authRoutes);
app.use(usersRouter);
app.use(postsRouter);

app.get('/ping', (req, res, next) => {
    return res.json('pong');
});

app.use(notFound);
app.use(errorHandler);

export default app;
