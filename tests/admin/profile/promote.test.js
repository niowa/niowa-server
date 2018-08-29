const app = require('../../../app/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const TABLES = require('../../../app/constants/tables');
const { ROUTES, ADMIN_PREFIX } = require('../../../app/constants/routes');
const { ERRORS } = require('../../../app/constants/errors');
const { USER_ROLES } = require('../../../app/constants/users');
const { createRoute } = require('../../../app/helpers/tests/route');
const {
    fillDataBaseWithMockData,
    removeMockDataFromDataBase,
} = require('../../../mock-data');
const UsersService = require('../../../app/services/users');

chai.use(chaiHttp);
const should = chai.should(); // eslint-disable-line
const assert = chai.assert;

const testName = 'Profile POST ADMIN';

describe(testName, () => {
    let data;

    const table = TABLES.USERS;
    const cols = table.COLUMNS;

    before(async function() {
        this.timeout(1000);
        console.log('Profile POST before');
        data = await fillDataBaseWithMockData();
    });

    after(async () => {
        await removeMockDataFromDataBase(data);
    });

    describe('POST /profile/promote', () => {
        it(`should create admin`, async function() {
            const { users, admins } = data;
            const user = users[0];

            user[cols.ROLE].should.equal(USER_ROLES.USER);

            let response;
            try {
                response = await chai.request(app)
                    .post(createRoute(ADMIN_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.PROMOTE.BASE))
                    .set({ 'x-access-token': admins[0].token })
                    .send({ email: user[cols.EMAIL] });
            } catch (error) {
                console.dir(error);
                assert.fail('Request should not be failed.');
            }

            response.status.should.equal(200);

            const updatedUser = await UsersService.getUserByEmail(user[cols.EMAIL]);

            updatedUser[cols.ROLE].should.equal(USER_ROLES.ADMIN);
        });

        //bad data tests
        it(`should return bad request status if request sends no admin`, async function() {
            const { users } = data;
            const user = users[1];

            try {
                await chai.request(app)
                    .post(createRoute(ADMIN_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.PROMOTE.BASE))
                    .set({ 'x-access-token': user.token })
                    .send({ email: user[cols.EMAIL] });
                assert.fail('Request should be failed.');
            } catch (error) {
                const response = error.response;

                response.status.should.equal(400);
                response.body.should.have.property('error');
                response.body.error.should.have.property('type');
                response.body.error.type.should.equal(ERRORS.AUTH.NOT_PERMITTED);
            }
        });

        it(`should return bad request status if passed bad email`, async function() {
            const { admins } = data;
            const email = 'bademail';

            try {
                await chai.request(app)
                    .post(createRoute(ADMIN_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.PROMOTE.BASE))
                    .set({ 'x-access-token': admins[0].token })
                    .send({ email });
                assert.fail('Request should be failed.');
            } catch (error) {
                const response = error.response;

                response.status.should.equal(400);
                response.body.should.have.property('error');
                response.body.error.should.have.property('type');
                response.body.error.type.should.equal(ERRORS.ADMIN.INVALID_EMAIL);
            }
        });

        it(`should return bad request status if user doesn't exist`, async function() {
            const { admins } = data;
            const email = 'email@gmail.com';

            try {
                await chai.request(app)
                    .post(createRoute(ADMIN_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.PROMOTE.BASE))
                    .set({ 'x-access-token': admins[0].token })
                    .send({ email });
                assert.fail('Request should be failed.');
            } catch (error) {
                const response = error.response;

                response.status.should.equal(400);
                response.body.should.have.property('error');
                response.body.error.should.have.property('type');
                response.body.error.type.should.equal(ERRORS.ADMIN.NOT_EXISTS);
            }
        });

        it(`should return bad request status if user already has become admin`, async function() {
            const { admins } = data;

            try {
                await chai.request(app)
                    .post(createRoute(ADMIN_PREFIX + ROUTES.PROFILE.BASE, ROUTES.PROFILE.PROMOTE.BASE))
                    .set({ 'x-access-token': admins[0].token })
                    .send({ email: admins[0][cols.EMAIL] });
                assert.fail('Request should be failed.');
            } catch (error) {
                const response = error.response;

                response.status.should.equal(400);
                response.body.should.have.property('error');
                response.body.error.should.have.property('type');
                response.body.error.type.should.equal(ERRORS.ADMIN.IS_ADMIN);
            }
        });
    });
});
