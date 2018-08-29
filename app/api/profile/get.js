const { success, reject } = require('../../response');
const { formatUserForResponse } = require('../../formatters/users');
const { ERRORS } = require('../../constants/errors');
const { SUCCESS } = require('../../constants/success');

async function getProfile(req, res) {
    try {
        return success(res, { user: formatUserForResponse(res.locals.user) }, SUCCESS.PROFILE.SENT);
    } catch (error) {
        return reject(res, { error }, ERRORS.SYSTEM.ERROR);
    }
}

module.exports = {
    getProfile,
};
