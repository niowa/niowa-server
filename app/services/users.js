const {
    one,
    oneOrNone,
} = require('../db');
const {
    getSelectUserByIdQuery,
    getSelectUserByEmailQuery,
    getInsertUserQuery,
    getUpdateUserByIdQuery,
} = require('../sql-helpers/users');
const TABLES = require('../constants/tables');
const { USER_ROLES } = require('../constants/users');
const { getValidUpdate } = require('../helpers');

const cols = TABLES.USERS.COLUMNS;

function getUser(id) {
    return oneOrNone(getSelectUserByIdQuery(id));
}

function getUserByEmail(email) {
    return oneOrNone(getSelectUserByEmailQuery(email));
}

function addUser(data) {
    return one(getInsertUserQuery(data));
}

function updateUser(id, update) {
    return one(getUpdateUserByIdQuery(id, update));
}

function createAdmin(id) {
    const userUpdate = getValidUpdate({ [cols.ROLE]: USER_ROLES.ADMIN }, [
        cols.ROLE,
    ]);

    return updateUser(id, userUpdate);

}

module.exports = {
    getUser,
    getUserByEmail,
    addUser,
    createAdmin,
};
