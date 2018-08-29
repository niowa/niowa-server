const api = require('./api').router;
const admin = require('./admin').router;
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const { API_PREFIX, ADMIN_PREFIX } = require('./constants/routes');

const app = express();
const env = app.settings.env;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

if (env === 'development') {
    app.use(morgan('dev'));
}

app.use(API_PREFIX, api);
app.use(ADMIN_PREFIX, admin);

module.exports = app;
