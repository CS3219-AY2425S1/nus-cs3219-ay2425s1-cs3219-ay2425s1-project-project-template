import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import app from '../../src/index.js';
import { describe } from 'node:test';

const chai = use(chaiHttp);

describe('Basic Endpoint Testing', function () {
    before(async function () {
        const mongod = await MongoMemoryServer.create();
        await mongoose.connect(mongod.getUri());
    });

    after(async function () {
        await mongoose.connection.close();
    });

    describe('GET /', function () {
        it('Should return 200 and print Hello Wolrd', done => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal("Hello World from user-service");                
                    done();
                });
        });
    })
});