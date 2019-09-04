import passport from 'passport';
import logger from '../../core/logger';

export const JWT_STRATEGY = ['jwt'];
export const AUTH_OPTIONS = {
  session: false,
};

export default (request, response, next, callback) => {
  logger.info(`Authenticating JWT, ${JSON.stringify(request.headers)}`);
  passport.authenticate(JWT_STRATEGY, AUTH_OPTIONS, callback)(request, response, next);
};
