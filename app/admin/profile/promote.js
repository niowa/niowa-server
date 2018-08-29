const { get } = require('lodash');
const UsersService = require('../../services/users');
const { success, reject } = require('../../response');
const { ERRORS } = require('../../constants/errors');
const { SUCCESS } = require('../../constants/success');
const { USER_ROLES} = require('../../constants/users');
const TABLES = require('../../constants/tables');
const { isValidEmail } = require('../../helpers');

async function addAdmin(req, res) {
    const colsUsers = TABLES.USERS.COLUMNS;
    try {
        const email = get(req.body, 'email');

        if (!isValidEmail(email)) {
            return reject(res, {}, ERRORS.ADMIN.INVALID_EMAIL);
        }

        const user = await UsersService.getUserByEmail(email);

        if (!user) {
            return reject(res, {}, ERRORS.ADMIN.NOT_EXISTS);
        }

        if (user[colsUsers.ROLE] === USER_ROLES.ADMIN) {
            return reject(res, {}, ERRORS.ADMIN.IS_ADMIN);
        }

        const updatedUser = await UsersService.createAdmin(user.id);

        return success(res, { email: updatedUser[colsUsers.EMAIL] }, SUCCESS.ADMIN.CREATED);
    } catch (error) {
        return reject(res, { error }, ERRORS.SYSTEM.ERROR);
    }
}

module.exports = {
    addAdmin,
};
