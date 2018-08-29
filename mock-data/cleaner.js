const TABLES = require('../app/constants/tables');

const { many } = require('../app/db');
const { getDeleteInstancesQuery } = require('../app/sql-helpers');

function removeUsers(users) {
    return new Promise(async (resolve, reject) => {
        try {
            const table = TABLES.USERS;

            await many(getDeleteInstancesQuery(table.NAME, users.map(user => user.id)));

            return resolve();
        } catch(error) {
            reject(error);
        }
    });
}

module.exports = {
    removeUsers,
};
