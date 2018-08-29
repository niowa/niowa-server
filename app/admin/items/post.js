const { success, reject } = require('../../response');
const { ERRORS } = require('../../constants/errors');
const { SUCCESS } = require('../../constants/success');
const { isValidItem } = require('../../helpers/data-validation/items');
const { formatItemForAdding } = require('../../formatters/items');
const BlockchainService = require('../../services/blockchain');

async function addItem(req, res) {
    try {
        const item = req.body.item;
        const itemValidationInfo = isValidItem(item);

        if (itemValidationInfo) {
            return reject(res, { itemValidationInfo }, ERRORS.ITEM.INVALID_ITEM_DATA);
        }

        const addedItem = BlockchainService.addItem(formatItemForAdding(item));

        return success(res, { itemId: addedItem.toString() }, SUCCESS.ITEM.ADDED);
    } catch (error) {
        return reject(res, { error }, ERRORS.SYSTEM.ERROR);
    }
}

module.exports = {
    addItem,
};
