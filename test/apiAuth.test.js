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

const badToken = 'BadToken';

const userAgent = request.agent(app);

const createUser = (user) => request(app).post('/api/auth/signup').send(user);

const loginUser = (user) => userAgent.post('/api/auth/login').send(user);

describe('API: check users REST', () => {
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
    //     mongoose.connection.db.dropDatabase(() => done());
    // });

    beforeEach((done) => {
        mongoose.connection.collections.users.drop(() => done());
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
        mongoose.connection.collections.users.createIndex(
            { email: 1 },
            { unique: true }
        );
        done();
    });

    it('should not access protected ressources if not logged in', (done) => {
        request(app)
            .get('/api/users')
            .end((err, res) => {
                expect(res.status).to.equal(401);
                done();
            });
    });

    it('should not access protected ressources with bad token', (done) => {
        request(app)
            .get('/api/users')
            .set('Authorization', 'Bearer ' + badToken)
            .end((err, res) => {
                expect(res.status).to.equal(401);
                done();
            });
    });

    it('should access current_user if logged in', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                const token = res2.body.token;
                userAgent
                    .get('/api/users/')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err3, res3) => {
                        expect(res3.status).to.equal(200);
                        done();
                    });
            });
        });
    });

    it('should access get user by id if logged in', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                const id = res2.body?.user?._id;
                const token = res2.body.token;
                userAgent
                    .get(`/api/users/${id}`)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err3, res3) => {
                        expect(res3.status).to.equal(200);
                        done();
                    });
            });
        });
    });

    it('should access protected ressources if logged in', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                const token = res2.body.token;
                userAgent
                    .get('/api/users')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err3, res3) => {
                        expect(res3.status).to.equal(200);
                        done();
                    });
            });
        });
    });

    it('should logout and not access protected ressources', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                const token = res2.body.token;
                userAgent
                    .get('/api/auth/logout')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err3, res3) => {
                        expect(res3.status).to.equal(200);
                        userAgent
                            .get('/api/users')
                            .set('Authorization', 'Bearer ' + token)
                            .end((err4, res4) => {
                                expect(res4.status).to.equal(401);
                                done();
                            });
                    });
            });
        });
    });

    it('should logoutall and not access protected ressources', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                const token = res2.body.token;
                userAgent
                    .get('/api/auth/logoutall')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err3, res3) => {
                        expect(res3.status).to.equal(200);
                        userAgent
                            .get('/api/users')
                            .set('Authorization', 'Bearer ' + token)
                            .end((err4, res4) => {
                                expect(res4.status).to.equal(401);
                                done();
                            });
                    });
            });
        });
    });

    it('should not send error logged out', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                const token = res2.body.token;
                userAgent
                    .get('/api/auth/logout')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        done();
                    });
            });
        });
    });

    it('should not send error logged all', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                const token = res2.body.token;
                userAgent
                    .get('/api/auth/logoutall')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        done();
                    });
            });
        });
    });

    it('should send 401 error if already logged out', (done) => {
        userAgent.get('/api/auth/logout').end((err, res) => {
            expect(res.status).to.equal(401);
            done();
        });
    });

    it('should send 401 error if already logged out', (done) => {
        userAgent.get('/api/auth/logoutall').end((err, res) => {
            expect(res.status).to.equal(401);
            done();
        });
    });
});
