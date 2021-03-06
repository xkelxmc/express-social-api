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

const userAgent = request.agent(app);

const createUser = (user) => request(app).post('/auth/signup').send(user);

const loginUser = (user) => userAgent.post('/auth/login').send(user);

describe('Create user and login/logout', () => {
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
            .get('/users')
            .end((err, res) => {
                expect(res.status).to.equal(401);
                done();
            });
    });

    it('should create a user', (done) => {
        createUser(dummyUser).end((err, res) => {
            expect(res.status).to.equal(200);
            done();
        });
    });

    it('should not create duplicate user', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            createUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(409);
                done();
            });
        });
    });

    it('should not create user if missing name', (done) => {
        createUser({
            email: dummyUser.email,
            lastName: dummyUser.lastName,
            password: dummyUser.password,
        }).end((err, res) => {
            expect(res.status).to.equal(422);
            done();
        });
    });

    it('should not create user if missing lastName', (done) => {
        createUser({
            email: dummyUser.email,
            name: dummyUser.name,
            password: dummyUser.password,
        }).end((err, res) => {
            expect(res.status).to.equal(422);
            done();
        });
    });

    it('should not create user if missing email', (done) => {
        createUser({
            lastName: dummyUser.lastName,
            name: dummyUser.name,
            password: dummyUser.password,
        }).end((err, res) => {
            expect(res.status).to.equal(422);
            done();
        });
    });

    it('should not create user if missing field', (done) => {
        createUser({ email: dummyUser.email }).end((err, res) => {
            expect(res.status).to.equal(422);
            done();
        });
    });

    it('should login created user', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                done();
            });
        });
    });

    it('should not login if missing field', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser({ email: dummyUser.email }).end((err2, res2) => {
                expect(res2.status).to.equal(422);
                done();
            });
        });
    });

    it("should not login if user doesn't exist", (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser({
                email: 'not.the.good.email@gmail.com',
                password: dummyUser.password,
            }).end((err2, res2) => {
                expect(res2.status).to.equal(401);
                done();
            });
        });
    });

    it('should not login if wrong password', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser({
                email: dummyUser.email,
                password: 'wrong password',
            }).end((err2, res2) => {
                expect(res2.status).to.equal(401);
                done();
            });
        });
    });

    it('should access current_user if logged in', (done) => {
        createUser(dummyUser).end((err1, res1) => {
            expect(res1.status).to.equal(200);
            loginUser(dummyUser).end((err2, res2) => {
                expect(res2.status).to.equal(200);
                userAgent.get('/users/').end((err3, res3) => {
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
                const id = res2.body?._id;
                userAgent.get(`/users/${id}`).end((err3, res3) => {
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
                userAgent.get('/users').end((err3, res3) => {
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
                userAgent.get('/auth/logout').end((err3, res3) => {
                    expect(res3.status).to.equal(200);
                    userAgent.get('/users').end((err4, res4) => {
                        expect(res4.status).to.equal(401);
                        done();
                    });
                });
            });
        });
    });

    it('should not send error if already logged out', (done) => {
        userAgent.get('/auth/logout').end((err, res) => {
            expect(res.status).to.equal(200);
            done();
        });
    });
});
