const jwt = require('jsonwebtoken');
const JWTsecret = 'f4vb8fJu9hE9XfX6szY5awQU/E2OEZ';
const expirationPeriod = '15d';

function getJWToken(user, expiration = expirationPeriod) {
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
        },
        JWTsecret,
        {
            expiresIn: expiration,
        }
    );
}

function decodeJWToken(token) {
    return jwt.verify(token, JWTsecret);
}

function verifyJWToken(token) {
    return new Promise(async (resolve) => {
        try {
            await jwt.verify(token, JWTsecret);
            return resolve(true);
        } catch(error) {
            return resolve(false);
        }
    });
}

function extractIdFromToken(token) {
    return new Promise(async (resolve, reject) => {
        try {
            const jwtToken = await decodeJWToken(token);
            resolve(jwtToken.id);
        } catch (error) {
            reject(error);
        }
    });
}


module.exports = {
    getJWToken,
    decodeJWToken,
    verifyJWToken,
    extractIdFromToken,
};
