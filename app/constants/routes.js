const API_PREFIX = '/api';
const ADMIN_PREFIX = '/admin';

const BASES = {
    PROFILE: '/profile',
    SESSION: '/session',
    PROMOTE: '/promote',
    ITEMS: '/items',
};

const IDS = {
    ITEMS: '/:itemId',
};

const ROUTES = {
    PROFILE: {
        BASE: BASES.PROFILE,
        CREATE: '',
        GET: '',
        PROMOTE: {
            BASE: BASES.PROMOTE,
            POST: '',
        },
    },
    SESSION: {
        BASE: BASES.SESSION,
        CREATE: '',
    },
    ITEMS: {
        BASE: BASES.ITEMS,
        GET: IDS.ITEMS,
        CREATE: '',
    },
};

const ALLOWED_ROUTES = {
    POST: [
        API_PREFIX + ROUTES.PROFILE.BASE + ROUTES.PROFILE.CREATE,
        API_PREFIX + ROUTES.SESSION.BASE + ROUTES.SESSION.CREATE,
        ADMIN_PREFIX + ROUTES.SESSION.BASE + ROUTES.SESSION.CREATE,
    ],
};

module.exports = {
    API_PREFIX,
    ADMIN_PREFIX,
    ROUTES,
    ALLOWED_ROUTES,
};
