const TABLES = require('../app/constants/tables');
const { USER_ROLES } = require('../app/constants/users');

const DEFAULT_USERS_AMOUNT = 5;
const DEFAULT_ADMINS_AMOUNT = 1;
const TEST_PREFIX = 'test';

const colsUsers = TABLES.USERS.COLUMNS;

function generateUsers(N = DEFAULT_USERS_AMOUNT, prefix = TEST_PREFIX) {
    return new Array(N).fill(1).map((item, index) => {
        return {
            [colsUsers.EMAIL]: `${+new Date()}${prefix.toLowerCase()}user${index}@gmail.com`,
            [colsUsers.NAME]: `name${index}`,
            [colsUsers.PASSWORD]: `password${index}`,
        };
    });
}

function generateAdmins(N = DEFAULT_ADMINS_AMOUNT) {
    return generateUsers(N).map((admin, i) => {
        admin[colsUsers.EMAIL] = `admin${i}@gmail.com`;
        admin[colsUsers.ROLE] = USER_ROLES.ADMIN;
        return admin;
    });

}

module.exports = {
    generateUsers,
    generateAdmins,
};
