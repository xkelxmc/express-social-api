import { expect } from 'chai';
import request from 'supertest';

import app from '../index';

describe('Api setup and error handling', () => {
    it('should return 200', (done) => {
        request(app)
            .get('/ping')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('should throw 404 error if route undefined', (done) => {
        request(app)
            .get('/testundefindroute')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            });
    });
});
