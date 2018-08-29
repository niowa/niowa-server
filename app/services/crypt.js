const bcrypt = require('bcrypt');

function hashPassword(password, readySalt) {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = readySalt || await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            resolve({ password: hashedPassword, key: salt });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    hashPassword,
};
