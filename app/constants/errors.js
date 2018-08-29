const ERRORS = {
    AUTH: {
        INVALID_TOKEN: 'auth.invalid_token',
        EXPIRED_TOKEN: 'auth.expired_token',
        EMPTY_TOKEN: 'auth.empty_token',
        NOT_ALLOWED: 'auth.not_allowed',
        NOT_PERMITTED: 'auth.not_permitted',
    },
    SESSION: {
        WRONG_EMAIL_OR_PASSWORD: 'session.wrong_email_or_password',
    },
    SYSTEM: {
        ERROR: 'system.error',
    },
    PROFILE: {
        EMAIL_IS_IN_USE: 'profile.email_is_in_use',
        INVALID_USER_DATA: 'profile.invalid_user_data',
    },
    ADMIN: {
        IS_ADMIN: 'admin.is_admin',
        NOT_EXISTS: 'admin.not_exists',
        INVALID_EMAIL: 'admin.invalid_email',
    },
    ITEM: {
        INVALID_ID: 'item.invalid_id',
        NOT_EXISTS: 'item.not_exists',
        INVALID_ITEM_DATA: 'item.invalid_item_data',
    },
};

module.exports = {
    ERRORS,
};
