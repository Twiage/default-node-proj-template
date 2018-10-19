const _ = require('lodash');
const logger = require('./logger').default;

const operations = {
  CHECK_ALLOWED: 'check allowed',
  LOGIN_SUCCESS: 'login success',
  LOGIN_FAILURE: 'login failure',
  LOGIN_FAILURE_DISABLED_ACCOUNT: 'login failure for disabled account',
  ACCESS_DENIED: 'access denied',
  CASE_LIST_VIEW_SUCCESS: 'case list view success',
  CASE_LIST_VIEW_FAILURE: 'case list view failure',
  CASE_CREATE_SUCCESS: 'case create success',
  CASE_CREATE_FAILURE: 'case create failure',
  CASE_DELETE_SUCCESS: 'case delete success',
  CASE_DELETE_FAILURE: 'case delete failure',
  CASE_UPDATE_SUCCESS: 'case update success',
  CASE_UPDATE_FAILURE: 'case update failure',
  CASE_DETAILS_VIEW_SUCCESS: 'case details view success',
  CASE_DETAILS_VIEW_FAILURE: 'case details view failure',
  CASE_PDF_VIEW_SUCCESS: 'case pdf view success',
  CASE_PDF_VIEW_FAILURE: 'case pdf view failure',
  CASE_UPLOAD_VIEW_SUCCESS: 'case upload view success',
  CASE_UPLOAD_VIEW_FAILURE: 'case upload view failure',
  CASE_UPLOAD_CREATE_SUCCESS: 'case upload create success',
  CASE_UPLOAD_CREATE_FAILURE: 'case upload create failure',
  CASE_TAG_ADD_SUCCESS: 'case tag add success',
  CASE_TAG_ADD_FAILURE: 'case tag add failure',
  CASE_TAG_REMOVE_SUCCESS: 'case tag remove success',
  CASE_TAG_REMOVE_FAILURE: 'case tag remove failure',
  CASE_LOCATION_UPDATE_SUCCESS: 'case tag add success',
  CASE_LOCATION_UPDATE_FAILURE: 'case tag remove failure',
};

const log = (operation, req, user, additionalData) => {
  const ipAddress = req ? req.headers['x-forwarded-for'] || req.connection.remoteAddress : 'none';
  const userId = _.get(user, 'id', 'none');
  const username = _.get(user, 'username', 'none');
  const email = _.get(user, 'email', 'none');

  const auditInfo = Object.assign({
    operation,
    ipAddress,
    userId,
    username,
    email,
  }, additionalData);

  logger.info('audit', auditInfo);
};

const logCaseOperation = (operation, req, user, twiageCase, additionalData) => {
  log(operation, req, user, Object.assign({
    twiageCaseId: twiageCase.id,
    twiageCaseNumber: twiageCase.caseNumber,
  }, additionalData));
};

module.exports = { operations, log, logCaseOperation };
