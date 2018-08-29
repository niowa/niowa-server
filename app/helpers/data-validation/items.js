const { isObject, isString } = require('lodash');
const { isNaturalNumber } = require('../');
const { ITEMS_FIELDS } = require('../../constants/items');

function isValidItem(item) {
    const result = {};

    if (!isObject(item)) {
        return {
            error: 'Item is not an object',
        };
    }

    if (item[ITEMS_FIELDS.DESCRIPTION] && !isString(item[ITEMS_FIELDS.DESCRIPTION])) {
        result[ITEMS_FIELDS.DESCRIPTION] = `${ITEMS_FIELDS.DESCRIPTION} should be a string`;
    } else if (item[ITEMS_FIELDS.DESCRIPTION] === '') {
        result[ITEMS_FIELDS.DESCRIPTION] = `${ITEMS_FIELDS.DESCRIPTION} cannot be empty`;
    }

    if (!item[ITEMS_FIELDS.AMOUNT]) {
        result[ITEMS_FIELDS.AMOUNT] = `${ITEMS_FIELDS.AMOUNT} cannot be empty`;
    } else if (!isNaturalNumber(item[ITEMS_FIELDS.AMOUNT])) {
        result[ITEMS_FIELDS.AMOUNT] = `${ITEMS_FIELDS.AMOUNT} should be a natural number`;
    }

    return Object.keys(result).length > 0 ? result : null;
}

module.exports = {
    isValidItem,
};
