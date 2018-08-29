const squel = require('squel');

const squelPostgres = squel.useFlavour('postgres');

function getInsertInstancesQuery(table, values) {
    return squelPostgres.insert()
        .into(table)
        .setFieldsRows(values)
        .returning('*')
        .toString();
}

function getDeleteInstancesQuery(table, ids) {
    return squelPostgres.delete()
        .from(table)
        .where(`id in (${ids.map(id => `'${id}'`)})`)
        .returning('*')
        .toString();
}

module.exports = {
    getInsertInstancesQuery,
    getDeleteInstancesQuery,
};
