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
const { generateUsers } = require('../../../mock-data/generator');
const { removeUsers } = require('../../../mock-data/cleaner');
const UsersService = require('../../../app/services/users');

chai.use(chaiHttp);
const should = chai.should(); // eslint-disable-line
const assert = chai.assert;

const testName = 'Profile POST API';

describe(testName, () => {
    let data;

    const table = TABLES.USERS;
    const cols = table.COLUMNS;

    before(async function() {
        this.timeout(1000);
        console.log('Users POST before');
        data = await fillDataBaseWithMockData();
    });

    after(async () => {
        await removeMockDataFromDataBase(data);
    });

    describe('POST /profile/', () => {
        it(`should create profile`, async function() {
            const users = generateUsers();

            let responses;
            try {
                responses = await Promise.all(users.map(user => chai.request(app)
                    .post(createRoute(API_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.POST))
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
            const usersFromDb = await Promise.all(users.map(user => UsersService.getUserByEmail(user[cols.EMAIL])));

            await removeUsers(usersFromDb);
        });

        //bad data tests
        it(`should return bad request status if user's name is not a string`, async() => {
            const user = generateUsers(1);
            user[cols.NAME] = 25;

            try {
                await chai.request(app)
                    .post(createRoute(API_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.POST))
                    .send({ user });
                assert.fail('Request should be failed.');
            } catch (error) {
                const response = error.response;

                response.status.should.equal(400);
                response.body.should.have.property('error');
                response.body.error.should.have.property('type');
                response.body.error.type.should.equal(ERRORS.PROFILE.INVALID_USER_DATA);
            }
        });

        it(`should return bad request status if user's email has invalid format`, async() => {
            const user = generateUsers(1);
            user[cols.EMAIL] = 'zxc';

            try {
                await chai.request(app)
                    .post(createRoute(API_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.POST))
                    .send({ user });
                assert.fail('Request should be failed.');
            } catch (error) {
                const response = error.response;

                response.status.should.equal(400);
                response.body.should.have.property('error');
                response.body.error.should.have.property('type');
                response.body.error.type.should.equal(ERRORS.PROFILE.INVALID_USER_DATA);
            }
        });
        it(`should return bad request status if user's password is incorrect`, async() => {
            const user = generateUsers(1);
            user[cols.PASSWORD] = 'qwerty';

            try {
                await chai.request(app)
                    .post(createRoute(API_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.POST))
                    .send({ user });
                assert.fail('Request should be failed.');
            } catch (error) {
                const response = error.response;

                response.status.should.equal(400);
                response.body.should.have.property('error');
                response.body.error.should.have.property('type');
                response.body.error.type.should.equal(ERRORS.PROFILE.INVALID_USER_DATA);
            }
        });
        it(`should return bad request status if user with that email has been created`, async() => {
            const { users } = data;

            try {
                await chai.request(app)
                    .post(createRoute(API_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.POST))
                    .send({ user: users[0] });
                assert.fail('Request should be failed.');
            } catch (error) {
                const response = error.response;

                response.status.should.equal(400);
                response.body.should.have.property('error');
                response.body.error.should.have.property('type');
                response.body.error.type.should.equal(ERRORS.PROFILE.EMAIL_IS_IN_USE);
            }
        });
    });
});
