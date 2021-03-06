import mongoose from 'mongoose';
import { expect } from 'chai';
import request from 'supertest';

import app from '../index';

const dummyUser = {
    email: 'johndoe@gmail.com',
    password: '1234',
    name: 'Test',
    lastName: 'LastName',
};

const dummyPost = {
    title: 'Hello, World!',
    body: 'Hello fellow Node.js developer!',
};

const userAgent = request.agent(app);

const createUser = (user) => request(app).post('/auth/signup').send(user);

const loginUser = (user) => userAgent.post('/auth/login').send(user);

describe('Get and create posts', () => {
    before((done) => {
        mongoose.connect(process.env.MONGO_TEST_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        mongoose.connection.once('open', () => done());
    });

    // before((done) => {
    // mongoose.connection.db.dropDatabase(() => done());
    // });

    beforeEach((done) => {
        mongoose.connection.collections.users.drop(() => done());
    });

    beforeEach((done) => {
        mongoose.connection.collections.posts.drop(() => done());
    });

    beforeEach((done) => {
        mongoose.connection.collections.users.createIndex(
            { email: 1 },
            { unique: true }
        );
        done();
    });

    afterEach((done) => {
        mongoose.connection.collections.users.drop(() => done());
    });

    afterEach((done) => {
        mongoose.connection.collections.posts.drop(() => done());
    });

    afterEach((done) => {
        mongoose.connection.collections.users.createIndex(
            { email: 1 },
            { unique: true }
        );
        done();
    });

    it('should not access protected ressources if not logged in', (done) => {
        request(app)
            .get('/posts')
            .end((err, res) => {
                expect(res.status).to.equal(401);
                done();
            });
    });

    it('should get all posts', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                userAgent.get('/posts').end((err3, res3) => {
                    expect(res3.status).to.equal(200);
                    done();
                });
            });
        });
    });

    it('should create a post', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                userAgent
                    .post('/posts')
                    .send(dummyPost)
                    .end((err3, res3) => {
                        expect(res3.status).to.equal(201);
                        done();
                    });
            });
        });
    });

    it('should not create post if missing field', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                userAgent
                    .post('/posts')
                    .send({ body: dummyPost.body })
                    .end((err3, res3) => {
                        expect(res3.status).to.equal(422);
                        done();
                    });
            });
        });
    });

    it('should get created post by id', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                userAgent
                    .post('/posts')
                    .send(dummyPost)
                    .end((err3, res3) => {
                        expect(res3.status).to.equal(201);
                        const postId = res3.body._id;
                        userAgent.get(`/posts/${postId}`).end((err4, res4) => {
                            expect(res4.status).to.equal(200);
                            done();
                        });
                    });
            });
        });
    });

    it('should up vote created post by id', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                userAgent
                    .post('/posts')
                    .send(dummyPost)
                    .end((err3, res3) => {
                        expect(res3.status).to.equal(201);
                        const postId = res3.body._id;
                        userAgent
                            .post(`/posts/${postId}/up`)
                            .end((err4, res4) => {
                                expect(res4.status).to.equal(200);
                                done();
                            });
                    });
            });
        });
    });

    it('should down vote created post by id', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                userAgent
                    .post('/posts')
                    .send(dummyPost)
                    .end((err3, res3) => {
                        expect(res3.status).to.equal(201);
                        const postId = res3.body._id;
                        userAgent
                            .post(`/posts/${postId}/down`)
                            .end((err4, res4) => {
                                expect(res4.status).to.equal(200);
                                done();
                            });
                    });
            });
        });
    });

    it('should not up vote twice created post by id', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                userAgent
                    .post('/posts')
                    .send(dummyPost)
                    .end((err3, res3) => {
                        expect(res3.status).to.equal(201);
                        const postId = res3.body._id;
                        userAgent
                            .post(`/posts/${postId}/up`)
                            .end((err4, res4) => {
                                expect(res4.status).to.equal(200);
                                userAgent
                                    .post(`/posts/${postId}/up`)
                                    .end((err4, res4) => {
                                        expect(res4.status).to.equal(400);
                                        done();
                                    });
                            });
                    });
            });
        });
    });

    it('should not down vote twice created post by id', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                userAgent
                    .post('/posts')
                    .send(dummyPost)
                    .end((err3, res3) => {
                        expect(res3.status).to.equal(201);
                        const postId = res3.body._id;
                        userAgent
                            .post(`/posts/${postId}/down`)
                            .end((err4, res4) => {
                                expect(res4.status).to.equal(200);
                                userAgent
                                    .post(`/posts/${postId}/down`)
                                    .end((err4, res4) => {
                                        expect(res4.status).to.equal(400);
                                        done();
                                    });
                            });
                    });
            });
        });
    });

    it('should not find non-existent post', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                userAgent.get('/posts/1234').end((err3, res3) => {
                    expect(res3.status).to.equal(404);
                    done();
                });
            });
        });
    });
});
