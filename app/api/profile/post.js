const { success, reject } = require('../../response');
const TokenService = require('../../services/token');
const UsersService = require('../../services/users');
const CryptService = require('../../services/crypt');
const TABLES = require('../../constants/tables');
const { isValidUser } = require('../../helpers/data-validation/users');
const { formatUserForAdding } = require('../../formatters/users');
const { ERRORS } = require('../../constants/errors');
const { SUCCESS } = require('../../constants/success');

async function createProfile(req, res) {
    const colsUsers = TABLES.USERS.COLUMNS;
    try {
        const userValidationInfo = isValidUser(req.body.user);

        if (userValidationInfo) {
            return reject(res, { userValidationInfo }, ERRORS.PROFILE.INVALID_USER_DATA);
        }

        const email = req.body.user[colsUsers.EMAIL];
        const userByEmail = await UsersService.getUserByEmail(email);

        if (userByEmail) {
            return reject(res, { [colsUsers.EMAIL]: req.body.user[colsUsers.EMAIL] }, ERRORS.PROFILE.EMAIL_IS_IN_USE);
        }

        const password = req.body.user[colsUsers.PASSWORD];
        const passwordData = await CryptService.hashPassword(password);

        const data = formatUserForAdding(req.body.user, passwordData);

        const user = await UsersService.addUser(data);
        const token = await TokenService.getJWToken({
            id: user.id,
            [colsUsers.NAME]: user[colsUsers.NAME],
            [colsUsers.EMAIL]: user[colsUsers.EMAIL],
        });

        return success(res, { token }, SUCCESS.PROFILE.CREATED);
    } catch (error) {
        return reject(res, { error }, ERRORS.SYSTEM.ERROR);
    }
}

module.exports = {
    createProfile,
};
