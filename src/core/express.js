'use strict';

import samlConfig from '../modules/auth/saml.config';
import jwtConfig from '../modules/auth/jwt.config';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compress = require('compression');
const helmet = require('helmet');
const path = require('path');
const expressWinston = require('express-winston');
const moment = require('moment');
const config = require('../config/config');
const logger = require('./logger').default;

const OPTIONS_RETURN_CODE = 200;

let expressApp;

const expressModule = {
  extractEmail: request => {
    request.winstonMessageData = {};
    const jwtHeader = request.headers.authorization;
    if (!request.headers.authorization) {
      request.winstonMessageData.authInfo = 'No authorization header';
    } else if (jwtHeader.substring(0, 1) === 'B') {
      request.winstonMessageData.authInfo = 'Bearer token';
    } else {
      const encodedJWT = jwtHeader.substring(3, jwtHeader.length - 1);
      const base64User = encodedJWT.split('.')[1];
      const base64UserCleaned = base64User.replace('-', '+').replace('_', '/');
      request.winstonMessageData.authInfo = JSON.parse(Buffer.from(base64UserCleaned, 'base64')).email;
    }
  },
};

export default expressModule;

module.exports.OPTIONS_RETURN_CODE = OPTIONS_RETURN_CODE;

module.exports.initLocalVariables = function (app) {
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords;
  app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
  app.locals.livereload = config.livereload;
  app.locals.logo = config.logo;

  app.use((req, res, next) => {
    res.locals.host = `${req.protocol}://${req.hostname}`;
    res.locals.url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    next();
  });
};

module.exports.initMiddleware = function (app) {
  app.set('showStackError', true);

  app.enable('jsonp callback');

  app.use(cors());

  module.exports.configureApp(app);

  const passport = module.exports.getPassport();
  app.use(passport.initialize());
  samlConfig();
  jwtConfig.useJwtStrategy();
};

module.exports.configureLogging = app => {
  const winstonLogger = expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: '{{req.winstonMessageData.authInfo}} {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    dynamicMeta: expressModule.extractEmail,
    expressFormat: false,
  });
  app.use(winstonLogger);
};

module.exports.configureCaching = app => {
  if (process.env.NODE_ENV === 'development') {
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }
};

module.exports.configureApp = function (app) {
  app.use(compress({
    filter(req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9,
  }));

  module.exports.configureLogging(app);
  module.exports.configureCaching(app);

  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
};

module.exports.initModulesConfiguration = function (app, db) {
  config.files.configs.forEach(configPath => {
    require(path.resolve(configPath))(app, db);
  });
};

module.exports.initHelmetHeaders = function (app) {
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: moment.duration(6, 'months').asMilliseconds(),
    includeSubdomains: true,
    force: true,
  }));
  app.disable('x-powered-by');
};

module.exports.initModulesClientRoutes = function (app) {
  app.use('/', express.static(path.resolve('./src/public')));
};

module.exports.initModulesServerPolicies = function () {};

module.exports.initModulesServerRoutes = function (app) {
  config.files.routes.forEach(routePath => {
    require(path.resolve(routePath))(app);
  });
};

module.exports.initErrorRoutes = function (app) {
  app.use((err, req, res, next) => {
    if (!err) {
      return next();
    }
    logger.error(err);

    res.statusCode = err.statusCode ? err.statusCode : 500;
    if (res.sentry) {
      res.end(`${res.sentry}\n`);
    } else {
      res.end(`${err.message}\n`);
    }
  });
};

module.exports.init = function () {
  const app = this.getExpressApp();

  this.initLocalVariables(app);

  this.initMiddleware(app);

  this.initHelmetHeaders(app);

  this.initModulesClientRoutes(app);

  this.initModulesConfiguration(app);

  this.initModulesServerPolicies(app);

  this.initModulesServerRoutes(app);

  this.initErrorRoutes(app);

  return app;
};

module.exports.getExpressApp = () => {
  if (!expressApp) {
    expressApp = express();
  }
  return expressApp;
};

module.exports.getPassport = () => require('passport');
