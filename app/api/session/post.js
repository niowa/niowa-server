const { get } = require('lodash');
const { success, reject } = require('../../response');
const TokenService = require('../../services/token');
const UsersService = require('../../services/users');
const CryptService = require('../../services/crypt');
const { ERRORS } = require('../../constants/errors');
const { SUCCESS } = require('../../constants/success');
const TABLES = require('../../constants/tables');
const {
    isStrongEnoughtPassword,
    isValidEmail,
} = require('../../helpers');

async function createSession(req, res) {
    try {
        const colsUsers = TABLES.USERS.COLUMNS;

        const password = get(req.body, 'user.password');
        const email = get(req.body, 'user.email');

        if (isStrongEnoughtPassword(password) || !isValidEmail(email)) {
            return reject(res, {}, ERRORS.SESSION.WRONG_EMAIL_OR_PASSWORD);
        }

        const user = await UsersService.getUserByEmail(email);

        if (!user) {
            return reject(res, {}, ERRORS.SESSION.WRONG_EMAIL_OR_PASSWORD);
        }

        const data = await CryptService.hashPassword(password, user[colsUsers.KEY]);

        if (data.password === user[colsUsers.PASSWORD]) {
            const tokenData = {
                id: user.id,
                email: user[colsUsers.EMAIL],
            };

            const token = await TokenService.getJWToken(tokenData);
            return success(res, { token }, SUCCESS.SESSION.CREATED);

        } else {
            return reject(res, {}, ERRORS.SESSION.WRONG_EMAIL_OR_PASSWORD);
        }
    } catch (error) {
        return reject(res, { error }, ERRORS.SESSION.WRONG_EMAIL_OR_PASSWORD);
    }
}

module.exports = {
    createSession,
};
