const squel = require('squel');
const TABLES = require('../constants/tables');

const squelPostgres = squel.useFlavour('postgres');

const table = TABLES.USERS;
const cols = table.COLUMNS;

function getSelectUserByIdQuery(id) {
    return squel.select()
        .from(table.NAME)
        .where(`id = '${id}'`)
        .toString();
}

function getSelectUserByEmailQuery(email) {
    return squel.select()
        .from(table.NAME)
        .where(`${cols.EMAIL} = '${email}'`)
        .toString();
}

function getInsertUserQuery(values) {
    return squelPostgres.insert()
        .into(table.NAME)
        .setFields(values)
        .returning('*')
        .toString();
}

function getUpdateUserByIdQuery(id, values) {
    return squelPostgres.update()
        .table(table.NAME)
        .setFields(values)
        .where(`id = '${id}'`)
        .returning('*')
        .toString();
}

module.exports = {
    getSelectUserByIdQuery,
    getSelectUserByEmailQuery,
    getInsertUserQuery,
    getUpdateUserByIdQuery,
};
