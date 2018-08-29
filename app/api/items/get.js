const { success, reject } = require('../../response');
const { isNonNegativeInteger } = require('../../helpers');
const { ERRORS } = require('../../constants/errors');
const { SUCCESS } = require('../../constants/success');
const { formatItemForResponse } = require('../../formatters/items');
const BlockchainService = require('../../services/blockchain');

async function getItem(req, res) {
    try {
        const itemId = parseInt(req.params.itemId);
        if (!isNonNegativeInteger(itemId)) {
            return reject(res, {}, ERRORS.ITEM.INVALID_ID);
        }

        const item = await BlockchainService.getItem(itemId);

        if (!item[0]) {
            return reject(res, {}, ERRORS.ITEM.NOT_EXISTS);
        }

        return success(res, { item: formatItemForResponse(item) }, SUCCESS.ITEM.SENT);
    } catch (error) {
        return reject(res, { error }, ERRORS.SYSTEM.ERROR);
    }
}

module.exports = {
    getItem,
};
