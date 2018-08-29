function success(res, data, type) {
    const result = {
        data,
        type,
    };

    res.status(200).send(result);
}

function reject(res, data, errorType, errorMessage) {
    const result = {
        error: {
            type: errorType,
            message: errorMessage || '',
            data: data,
        },
    };

    res.status(400).send(result);
}

module.exports = {
    success,
    reject,
};
