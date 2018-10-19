import { Strategy as SamlStrategy } from 'passport-saml';
import passport from 'passport';
import config from '../../config/config';
import { PATH_ACS_V1 } from '../../core/urlPaths';
import idpList from './idp.list';

export default () => {
  idpList.idpList.forEach(idp => {
    passport.use(idp.strategyName, exports.getSamlStrategy(idp));
  });
};

exports.getSamlStrategy = idp => new SamlStrategy({
  callbackUrl: `${config.baseUrl}${PATH_ACS_V1}`,
  entryPoint: idp.entryPoint,
  issuer: idp.issuer,
  cert: idp.cert,
}, (profile, done) => done(null, profile));
