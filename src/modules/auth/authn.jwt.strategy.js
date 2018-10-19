import passport from 'passport';
import logger from '../../core/logger';
import { AUTH_OPTIONS, NON_SAML_STRATEGIES } from './auth.strategy';

export default (request, response, next, callback) => {
  logger.info(`Authenticating JWT, ${JSON.stringify(request.headers)}`);
  passport.authenticate(NON_SAML_STRATEGIES, AUTH_OPTIONS, callback)(request, response, next);
};
