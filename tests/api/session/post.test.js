const app = require('../../../app/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const TABLES = require('../../../app/constants/tables');
const { ROUTES, API_PREFIX } = require('../../../app/constants/routes');
const { ERRORS } = require('../../../app/constants/errors');
const { createRoute } = require('../../../app/helpers/tests/route');
const {
    fillDataBaseWithMockData,
    removeMockDataFromDataBase,
} = require('../../../mock-data');

chai.use(chaiHttp);
const should = chai.should(); // eslint-disable-line
const assert = chai.assert;

const testName = 'Session POST API';

describe(testName, () => {
    let data;

    const table = TABLES.USERS;
    const cols = table.COLUMNS;

    before(async function() {
        this.timeout(1000);
        console.log('Session POST before');
        data = await fillDataBaseWithMockData();
    });

    after(async () => {
        await removeMockDataFromDataBase(data);
    });

    describe('POST /session/', () => {
        it(`should create session`, async function() {
            const { users } = data;

            const createdUsers = users.map((user, i) => ({
                [cols.EMAIL]: user[cols.EMAIL],
                [cols.PASSWORD]: `password${i}`,
            }));

            let responses;
            try {
                responses = await Promise.all(createdUsers.map(user => chai.request(app)
                    .post(createRoute(API_PREFIX + ROUTES.SESSION.BASE, ROUTES.SESSION.POST))
                    .send({ user })));
            } catch (error) {
                console.dir(error);
                assert.fail('Request should not be failed.');
            }

            responses.forEach(response => {
                response.status.should.equal(200);
                response.body.should.have.property('data');
                response.body.data.should.have.property('token');
                response.body.data.token.should.be.a('string');
            });
        });

        //bad data tests
        it(`should return bad request status if user's passed non-existing email`, async() => {
            const user = {
                [cols.EMAIL]: 'random@gmail.com',
                [cols.PASSWORD]: `password0`,
            };

            try {
                await chai.request(app)
                    .post(createRoute(API_PREFIX + ROUTES.SESSION.BASE, ROUTES.SESSION.POST))
                    .send({ user });
                assert.fail('Request should be failed.');
            } catch (error) {
                const response = error.response;

                response.status.should.equal(400);
                response.body.should.have.property('error');
                response.body.error.should.have.property('type');
                response.body.error.type.should.equal(ERRORS.SESSION.WRONG_EMAIL_OR_PASSWORD);
            }
        });

        it(`should return bad request status if user's passed wrong password`, async() => {
            const { users } = data;

            const user = {
                [cols.EMAIL]: users[0][cols.EMAIL],
                [cols.PASSWORD]: `invalid${0}`,
            };

            try {
                await chai.request(app)
                    .post(createRoute(API_PREFIX + ROUTES.SESSION.BASE, ROUTES.SESSION.POST))
                    .send({ user });
                assert.fail('Request should be failed.');
            } catch (error) {
                const response = error.response;

                response.status.should.equal(400);
                response.body.should.have.property('error');
                response.body.error.should.have.property('type');
                response.body.error.type.should.equal(ERRORS.SESSION.WRONG_EMAIL_OR_PASSWORD);
            }
        });
    });
});
