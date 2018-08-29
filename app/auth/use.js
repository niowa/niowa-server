const get = require('lodash/get');
const includes = require('lodash/includes');
const { reject } = require('../response');
const TokenService = require('../services/token');
const UsersService = require('../services/users');
const {
    extractToken,
    isValidUUID,
} = require('../helpers/index');
const { ERRORS } = require('../constants/errors');
const { USER_ROLES } = require('../constants/users');
const TABLES = require('../constants/tables');
const { ALLOWED_ROUTES } = require('../constants/routes');

function isAllowedRoute(req) {
    return req.method === 'POST' && includes(ALLOWED_ROUTES.POST, req.baseUrl);
}

async function isAuthenticated(req, res) {
    if (isAllowedRoute(req)) {
        return req.next();
    } else {
        try {
            const token = extractToken(req);
            if (!token) {
                return reject(res, {}, ERRORS.AUTH.EMPTY_TOKEN);
            }

            const [ isTokenValid, decodedData ] = await Promise.all([
                TokenService.verifyJWToken(token),
                TokenService.decodeJWToken(token),
            ]);

            const userId = get(decodedData, 'id');

            if (!isValidUUID(userId)) {
                return reject(res, { userId }, ERRORS.AUTH.INVALID_TOKEN);
            }

            let user = await UsersService.getUser(userId);

            if (!user || !user[TABLES.USERS.COLUMNS.EMAIL]) {
                return reject(res, {}, ERRORS.AUTH.INVALID_TOKEN);
            }

            const isTimeValid = decodedData.exp * 1000 > Date.now();

            if (isTokenValid && isTimeValid) {
                res.locals.user = user;
                return req.next();
            } else {
                return reject(res, {}, ERRORS.AUTH.NOT_ALLOWED);
            }
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return reject(res, {}, ERRORS.AUTH.EXPIRED_TOKEN);
            }
            return reject(res, { error }, ERRORS.AUTH.INVALID_TOKEN);
        }
    }
}

async function isAdmin(req, res) {
    if (isAllowedRoute(req)) {
        return req.next();
    } else {
        const colsUsers = TABLES.USERS.COLUMNS;
        try {
            const user = res.locals.user;
            if (user[colsUsers.ROLE] === USER_ROLES.ADMIN) {
                return req.next();
            } else {
                return reject(res, {}, ERRORS.AUTH.NOT_PERMITTED);
            }
        } catch (error) {
            return reject(res, { error }, ERRORS.SYSTEM.ERROR);
        }
    }
}

module.exports = {
    isAuthenticated,
    isAdmin,
};
