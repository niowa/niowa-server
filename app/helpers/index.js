const _ = require('lodash');

function isValidUUID(uuid) {
    return _.isString(uuid) && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

function extractToken(req) {
    return req.body.token || req.query.token || req.headers['x-access-token'];
}

function isValidEmail(email) {
    return _.isString(email) && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email); //eslint-disable-line
}

function isStrongEnoughtPassword(password) {
    if (!_.isString(password)) {
        return `Password must be a string.`;
    }

    if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
        return null;
    }

    if (!/^.{6,}$/.test(password)) {
        return `Password must be minimum of 6 characters length.`;
    }

    if (!/[0-9]/.test(password)) {
        return `Password must contain at least 1 digit.`;
    }

    if (!/[A-Za-z]/.test(password)) {
        return `Password must contain at least 1 letter.`;
    }
}

function getValidUpdate(update = {}, fields) {
    return _.reduce(fields, (result, field) => {
        if (update.hasOwnProperty(field)) {
            result[field] = update[field];
        }

        return result;
    }, {});
}

function isNaturalNumber(value) {
    return Number.isInteger(+value) && value > 0;
}

function isNonNegativeInteger(value) {
    return Number.isInteger(+value) && value >= 0;
}

module.exports = {
    isValidUUID,
    extractToken,
    isValidEmail,
    isStrongEnoughtPassword,
    getValidUpdate,
    isNaturalNumber,
    isNonNegativeInteger,
};
