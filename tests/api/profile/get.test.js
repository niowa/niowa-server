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

const testName = 'Profile GET API';

describe(testName, () => {
    let data;

    const table = TABLES.USERS;
    const cols = table.COLUMNS;

    before(async function() {
        this.timeout(1000);
        console.log('Profile GET before');
        data = await fillDataBaseWithMockData();
    });

    after(async () => {
        await removeMockDataFromDataBase(data);
    });

    describe('GET /profile/', () => {
        it(`should get profile`, async function() {
            this.timeout(500);
            const { users } = data;

            let responses;
            try {
                responses = await Promise.all(users.map(user => chai.request(app)
                    .get(createRoute(API_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.GET))
                    .set({'x-access-token': user.token})));
            } catch (error) {
                console.dir(error);
                assert.fail('Request should not be failed.');
            }

            responses.forEach((response, i) => {
                const user = users[i];
                const userForComparison = {
                    id: user.id,
                    [cols.EMAIL]: user[cols.EMAIL],
                    [cols.NAME]: user[cols.NAME],
                    [cols.ROLE]: user[cols.ROLE],
                    [cols.CREATED_AT]: user[cols.CREATED_AT].toISOString(),

                };

                response.status.should.equal(200);
                response.body.should.have.property('data');
                response.body.data.should.have.property('user');
                response.body.data.user.should.deep.equal(userForComparison);
            });
        });

        //bad data tests
        it(`should return bad request status and bad ${cols.NAME} if user's name is not a string`, async() => {
            const { users } = data;
            try {
                await chai.request(app)
                    .get(createRoute(API_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.GET))
                    .set({'x-access-token': users[0].token.slice(1)});
                assert.fail('Request should be failed.');
            } catch (error) {
                const response = error.response;
                response.status.should.equal(400);
                response.body.should.have.property('error');
                response.body.error.should.have.property('type');
                response.body.error.type.should.equal(ERRORS.AUTH.INVALID_TOKEN);
            }
        });

        it(`should return bad request status and bad ${cols.NAME} if user's name is not a string`, async() => {
            const { users } = data;
            try {
                await chai.request(app)
                    .get(createRoute(API_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.GET))
                    .set({ 'x-access-token': users[0].token.slice(1) });
                assert.fail('Request should be failed.');
            } catch (error) {
                const response = error.response;
                response.status.should.equal(400);
                response.body.should.have.property('error');
                response.body.error.should.have.property('type');
                response.body.error.type.should.equal(ERRORS.AUTH.INVALID_TOKEN);
            }
        });
    });
});
