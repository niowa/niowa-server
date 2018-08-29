const TABLES = require('../constants/tables');

const cols = TABLES.USERS.COLUMNS;

function formatUserForAdding(user, passwordData) {
    return {
        [cols.EMAIL]: user[cols.EMAIL],
        [cols.NAME]: user[cols.NAME],
        [cols.PASSWORD]: passwordData[cols.PASSWORD],
        [cols.KEY]: passwordData[cols.KEY],
    };
}

function formatUserForResponse(user) {
    return {
        id: user.id,
        [cols.EMAIL]: user[cols.EMAIL],
        [cols.NAME]: user[cols.NAME],
        [cols.ROLE]: user[cols.ROLE],
        [cols.CREATED_AT]: user[cols.CREATED_AT],
    };
}

module.exports = {
    formatUserForAdding,
    formatUserForResponse,
};
