import passport from 'passport';
import idpList from './idp.list';
import passportCallback from './passport.callback';
import authNWithJwtStrategy from './authn.jwt.strategy';
import { API_SIGNIN_PATH_BEARER } from '../../core/urlPaths';

export const JWT_STRATEGY_NAME = 'jwt';
export const NON_SAML_STRATEGIES = [JWT_STRATEGY_NAME];
export const AUTH_OPTIONS = {
  session: false,
};

export const tokenAndSamlAuth = (req, res, next) => {
  authNWithJwtStrategy(req, res, next);
};

export const generateAuthNAndAuthZCallback = callback => (request, response, next, id) => {
  if (request.url.substring(0, API_SIGNIN_PATH_BEARER.length) === API_SIGNIN_PATH_BEARER) {
    callback(request, response, next, id);
  } else {
    authNWithJwtStrategy(request, response, next, passportCallback(request, response, next, id, callback));
  }
};

export const samlRedirectToIdP = (req, res, next) => {
  const parsedUrl = req.url.split('/');
  const strategyName = parsedUrl[parsedUrl.length - 1];
  passport.authenticate(strategyName, AUTH_OPTIONS)(req, res, next);
};

export const consumeSaml = async (req, res, next) => {
  const samlStrategyName = await idpList.getSamlStrategyNameFromRequest(req);
  passport.authenticate(samlStrategyName, AUTH_OPTIONS)(req, res, next);
};
