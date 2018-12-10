import request from 'request';
import config from '../config/config';
import { API_AUDIT_ACCESS_LOGS } from './urlPaths';
import logger from './logger';

const _ = require('lodash');

const operations = {
  CHECK_ALLOWED: 'check allowed',
  ACCESS_DENIED: 'access denied',
  CASE_UPLOAD_VIEW_SUCCESS: 'case upload view success',
  CASE_UPLOAD_LIST_VIEW_SUCCESS: 'case upload list view success',
  CASE_UPLOAD_VIEW_FAILURE: 'case upload view failure',
  CASE_UPLOAD_CREATE_SUCCESS: 'case upload create success',
  CASE_UPLOAD_CREATE_FAILURE: 'case upload create failure',
};

const accessLogOperations = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  UPLOAD_MEDIA: 'upload_media',
  READ_MEDIA: 'read_media',
  DELETE: 'delete',
  LIST: 'list',
};

const log = (auditOperation, req, user, additionalData, twiageCaseId, accessLogOperation) => {
  const ipAddress = req ? req.headers['x-forwarded-for'] || req.connection.remoteAddress : 'none';
  const userId = _.get(user, 'id', 'none');

  const body = { auditOperation, userId, additionalData };

  if (twiageCaseId) body.twiageCaseId = twiageCaseId;
  if (accessLogOperation) body.accessLogOperation = accessLogOperation;

  const requestOptions = {
    url: `${config.baseUrl}${API_AUDIT_ACCESS_LOGS}`,
    body,
    json: true,
    headers: {
      Authorization: config.access_logs.authorization_token,
      'x-forwarded-for': ipAddress,
    },
  };
  request.post(requestOptions).on('error', error => logger.error('Error sending request to audit endpoint', error));
};

const logCaseOperation = (operation, req, user, twiageCase, additionalData, accessLogOperation) => {
  module.exports.log(operation, req, user, additionalData, twiageCase.id, accessLogOperation);
};

module.exports = {
  operations, accessLogOperations, log, logCaseOperation,
};
