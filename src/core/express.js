import express from 'express';
import helmet from 'helmet';
import moment from 'moment';
import expressWinston from 'express-winston';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';

import configureHealthRoutes from '../modules/health/routes/health.routes';
import samlConfig from '../modules/auth/saml.config';
import jwtConfig from '../modules/auth/jwt.config';
import logger from './logger';

let expressApp;

export const PORT = 3000;

export default () => {
  const app = initializers.getExpressApp();
  app.set('showStackError', true);
  initializers.initHelmet(app);
  initializers.initLogging(app);
  initializers.initBodyParser(app);
  initializers.initCors(app);
  initializers.initPassport(app);
  configureHealthRoutes(app);
  app.listen(PORT, () => {
    logger.info(`Server started at port ${PORT}`);
  });
};

const initHelmet = app => {
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

const initLogging = app => {
  const winstonLogger = expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: '{{req.winstonMessageData.authInfo}} {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    dynamicMeta: initializers.extractEmail,
    expressFormat: false,
  });
  app.use(winstonLogger);
};

const initBodyParser = app => {
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
};

const initPassport = app => {
  app.use(passport.initialize());
  samlConfig();
  jwtConfig.useJwtStrategy();
};

const initCors = app => {
  app.enable('jsonp callback');
  app.use(cors());
};

const extractEmail = request => {
  request.winstonMessageData = {};
  const jwtHeader = request.headers.authorization;
  if (!request.headers.authorization) {
    request.winstonMessageData.authInfo = 'No authorization header';
  } else if (jwtHeader.includes('Bearer')) {
    request.winstonMessageData.authInfo = 'Bearer token';
  } else {
    const encodedJWT = jwtHeader.substring(3, jwtHeader.length - 1);
    const base64User = encodedJWT.split('.')[1];
    const base64UserCleaned = base64User.replace('-', '+').replace('_', '/');
    request.winstonMessageData.authInfo = JSON.parse(Buffer.from(base64UserCleaned, 'base64')).email;
  }
};

const getExpressApp = () => {
  if (!expressApp) {
    expressApp = express();
  }
  return expressApp;
};

export const initializers = {
  initHelmet, initLogging, extractEmail, initBodyParser, initPassport, initCors, getExpressApp,
};
