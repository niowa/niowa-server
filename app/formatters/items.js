const { ITEMS_FIELDS } = require('../constants/items');

function formatItemForResponse([description, amount]) {
    return {
        [ITEMS_FIELDS.DESCRIPTION]: description,
        [ITEMS_FIELDS.AMOUNT]: amount.toString(),
    };
}

function formatItemForAdding(item) {
    return [ item[ITEMS_FIELDS.DESCRIPTION], item[ITEMS_FIELDS.AMOUNT] ];
}

module.exports = {
    formatItemForResponse,
    formatItemForAdding,
};
