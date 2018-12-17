import express from 'express';
import helmet from 'helmet';
import moment from 'moment';
import expressWinston from 'express-winston';
import bodyParser from 'body-parser';

import configureHealthRoutes from '../modules/health/routes/health.routes';
import logger from './logger';

let expressApp;

export const PORT = 3000;

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

const getExpressApp = () => {
  if (!expressApp) {
    expressApp = express();
  }
  return expressApp;
};

export const initializers = {
  initHelmet, initLogging, extractEmail, initBodyParser, getExpressApp,
};

export default () => {
  const app = initializers.getExpressApp();
  initializers.initHelmet(app);
  initializers.initLogging(app);
  initializers.initBodyParser(app);
  configureHealthRoutes(app);
  app.listen(PORT, () => {
    logger.info(`Server started at port ${PORT}`);
  });
};
