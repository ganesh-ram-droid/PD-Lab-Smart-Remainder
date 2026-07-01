const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const appConfig = require('./config/appConfig');
require('./config/firebase');

const routes = require('./routes');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(cors(appConfig.cors));
app.use(express.json({ limit: appConfig.requestLimit }));
app.use(express.urlencoded({ extended: true, limit: appConfig.requestLimit }));
app.use(morgan(appConfig.logFormat));

app.use('/', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
