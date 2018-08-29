const { fillUsers } = require('./filler');
const { generateUsers, generateAdmins } = require('./generator');
const { removeUsers } = require('./cleaner');

const dataAmounts = {
    users: 5,
    admins: 1,
};

function fillDataBaseWithMockData() {
    return new Promise(async (resolve, reject) => {
        try {
            const [
                users,
                admins,
            ] = await Promise.all([
                fillUsers(generateUsers(dataAmounts.users)),
                fillUsers(generateAdmins(dataAmounts.admins)),
            ]);

            return resolve({ users, admins });
        } catch (error) {
            return reject(error);
        }

    });
}

function removeMockDataFromDataBase(data = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            await Promise.all([
                removeUsers(data.users),
                removeUsers(data.admins),
            ]);

            return resolve();
        } catch (error) {
            console.dir(error);
            return reject(error);
        }
    });
}

// export async function checkDataWasRemoved(data ={}) {
//     try {
//         await Promise.all([
//             DataCheckers.checkUsers(data.users),
//         ]);
//         return true;
//     } catch (error) {
//         console.dir(error);
//         return false;
//     }
// }
//
// export async function getMockData() {
//     global.data = global.data || await fillDataBaseWithMockData();
//
//     return global.data;
// }

module.exports = {
    fillDataBaseWithMockData,
    removeMockDataFromDataBase,
};
