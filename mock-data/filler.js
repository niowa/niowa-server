const TABLES = require('../app/constants/tables');
const { USER_ROLES } = require('../app/constants/users');
const CryptService = require('../app/services/crypt');
const TokenService = require('../app/services/token');
const { many } = require('../app/db');
const { getInsertInstancesQuery } = require('../app/sql-helpers');

function fillUsers(users) {
    return new Promise(async (resolve, reject) => {
        try {
            const table = TABLES.USERS;
            const cols = table.COLUMNS;
            const passwordPairs = await Promise.all(users.map(user => CryptService.hashPassword(user[cols.PASSWORD])));

            const values = users.map((user, i) => ({
                [cols.EMAIL]: user[cols.EMAIL],
                [cols.PASSWORD]: passwordPairs[i].password,
                [cols.NAME]: user[cols.NAME],
                [cols.KEY]: passwordPairs[i].key,
                [cols.ROLE]: user[cols.ROLE] || USER_ROLES.USER,
            }));

            const insertedUsers = await many(getInsertInstancesQuery(table.NAME, values));

            const tokens = await Promise.all(insertedUsers.map(user => TokenService.getJWToken({
                id: user.id,
                email: user[cols.EMAIL],
            })));

            const usersWithTokens = insertedUsers.map((user, i) => {
                user.token = tokens[i];
                return user;
            });

            return resolve(usersWithTokens);
        } catch(error) {
            reject(error);
        }
    });
}

module.exports = {
    fillUsers,
};
