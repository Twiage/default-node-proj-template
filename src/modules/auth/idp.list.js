import xml2js from 'xml2js';
import config from '../../config/config';

const OKTA_STRATEGY_NAME = 'okta';
const OKTA_ISSUER = 'twiage';
const OKTA_EMAIL_DOMAIN = 'okta.com';
const OKTA_ORIGIN = 'https://dev-259877.oktapreview.com';

const ADVENTIST_STRATEGY_NAME = 'adventist';
const ADVENTIST_ISSUER = 'https://login.ahss.org/SecureAuth/';
const ADVENTIST_EMAIL_DOMAIN = 'ahss.org';
const ADVENTIST_ORIGIN = 'https://login.ahss.org';

const idpList = [{
  strategyName: ADVENTIST_STRATEGY_NAME,
  cert: config.sso.adventist.cert,
  entryPoint: config.sso.adventist.entryPoint,
  issuer: ADVENTIST_ISSUER,
  emailDomain: ADVENTIST_EMAIL_DOMAIN,
  origin: ADVENTIST_ORIGIN,
}, {
  strategyName: OKTA_STRATEGY_NAME,
  cert: config.sso.okta.cert,
  entryPoint: config.sso.okta.entryPoint,
  issuer: OKTA_ISSUER,
  emailDomain: OKTA_EMAIL_DOMAIN,
  origin: OKTA_ORIGIN,
}];

exports.ADVENTIST_ISSUER = ADVENTIST_ISSUER;
exports.OKTA_ISSUER = OKTA_ISSUER;
exports.idpList = idpList;

exports.getStrategyNameFromEmail = email => {
  const domain = email.split('@')[1];
  const idp = idpList.find(idpInList => domain === idpInList.emailDomain);
  return idp.strategyName;
};

exports.getSamlStrategyNames = () => exports.idpList.map(idp => idp.strategyName);

exports.getSamlStrategyNameFromRequest = async request => {
  const issuers = await exports.getIssuers(request.body.SAMLResponse);
  if (issuers && issuers[0]) {
    const idp = idpList.find(element => element.issuer.includes(issuers[0]));
    return idp.strategyName;
  }
  return null;
};

exports.getIssuers = async SAMLResponse => {
  const decodedSaml = Buffer.from(SAMLResponse, 'base64');
  const parsedSaml = await new Promise((resolve, reject) => {
    exports.getXmlParser().parseString(decodedSaml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  if (parsedSaml['samlp:Response']) {
    return parsedSaml['samlp:Response']['saml:Assertion'][0]['saml:Issuer'];
  }
  return parsedSaml['saml2p:Response']['saml2:Assertion'][0]['saml2:Issuer'];
};

exports.getXmlParser = () => new xml2js.Parser({ ignoreAttrs: true });
