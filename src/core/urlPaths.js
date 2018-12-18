/* eslint-disable import/prefer-default-export */
const PROJECT_NAME = 'default-node-proj-template';
const HEALTH = 'health';
const STATUS = 'status';

const PATH_ACS_AUTH = 'auth/saml/consume';

export const API_SIGNIN_PATH_BEARER = '/v3/';

export const PATH_HEALTH = `/${PROJECT_NAME}/${HEALTH}`;
export const PATH_ACS = `/v4/${PROJECT_NAME}/${PATH_ACS_AUTH}`;
export const PATH_STATUS = `/${PROJECT_NAME}/${STATUS}`;
export const API_AUDIT_ACCESS_LOGS = '/audit/accesslogs';
