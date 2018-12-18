import passport from 'passport';
import logger from '../../core/logger';
import { AUTH_OPTIONS, JWT_STRATEGY } from './auth.strategy';

export default (request, response, next, callback) => {
  logger.info(`Authenticating JWT, ${JSON.stringify(request.headers)}`);
  passport.authenticate(JWT_STRATEGY, AUTH_OPTIONS, callback)(request, response, next);
};
