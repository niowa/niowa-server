const TABLES = require('../../constants/tables');
const { isObject, isEmpty, isString } = require('lodash');
const {
    isStrongEnoughtPassword,
    isValidEmail,
} = require('../');

function isValidUser(user) {
    const result = {};
    const cols = TABLES.USERS.COLUMNS;

    if (!isObject(user)) {
        return {
            error: 'User is not an object',
        };
    }

    if (user[cols.NAME] && !isString(user[cols.NAME])) {
        result[cols.NAME] = `${cols.NAME} should be a string`;
    } else if (user[cols.NAME] === '') {
        result[cols.NAME] = `${cols.NAME} cannot be empty`;
    }

    if(!isString(user[cols.EMAIL])) {
        result[cols.EMAIL] = `${cols.EMAIL} should be a string`;
    } else if (isEmpty(user[cols.EMAIL])) {
        result[cols.EMAIL] = `${cols.EMAIL} cannot be empty`;
    } else if (!isValidEmail(user[cols.EMAIL])) {
        result[cols.EMAIL] = `${cols.EMAIL} cannot be empty`;
    }
    const message = isStrongEnoughtPassword(user[cols.PASSWORD]);
    if (!isString(user[cols.PASSWORD])) {
        result[cols.PASSWORD] = `${cols.PASSWORD} should be a string`;
    } else if (isEmpty(user[cols.PASSWORD])) {
        result[cols.PASSWORD] = `${cols.PASSWORD} cannot be empty`;
    } else if (message) {
        result[cols.PASSWORD] = `${message}`;
    }

    return Object.keys(result).length > 0 ? result : null;
}

module.exports = {
    isValidUser,
};
