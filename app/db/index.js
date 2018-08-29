const pgPromise = require('pg-promise');
const dotenv = require('dotenv');

dotenv.config();

const pgp = pgPromise();

const dbUrl = (process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME}`) + '?ssl=require';
const db = pgp(dbUrl);

function many(query) {
    return db.many(query);
}

function one(query) {
    return db.one(query);
}

function none(query) {
    return db.none(query);
}

function oneOrNone(query) {
    return db.oneOrNone(query);
}

function manyOrNone(query) {
    return db.manyOrNone(query);
}

function tx(func) {
    return db.tx(func);
}

module.exports = {
    many,
    one,
    none,
    oneOrNone,
    manyOrNone,
    tx,
};
