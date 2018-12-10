import test from 'ava';
import { expect } from 'chai';
import sinon from 'sinon';
import mockRequest from 'request';
import testutils from '../../../core/testing/test.utils';
import {
  API_AUDIT_ACCESS_LOGS, PATH_HEALTH, PATH_STATUS,
} from '../../../core/urlPaths';
import {
  HEALTHY_RESPONSE_BODY,
  STATUS_RESPONSE_BODY,
} from '../controllers/HealthController';
import config from '../../../config/config';

test.serial('Health Check', async () => {
  // Arrange
  const expectedRoute = PATH_HEALTH;
  const expectedJwtToken = '';
  const expectedResponse = HEALTHY_RESPONSE_BODY;

  const expectedExpress = await testutils.setupAppV2({}, {});

  // Act
  const actualResponse = await testutils.makeGETRequest(expectedExpress, expectedRoute, expectedJwtToken);

  // Assert
  expect(actualResponse.body).to.deep.equal(expectedResponse);
});

test.serial('Secure Status Check - with bucket location - global admin', async t => {
  // Arrange
  const expectedId = 'idididid';
  const expectedEmail = 'dnom.albert.ilya.matt.leyla@example.com';
  const expectedUser = {
    _id: expectedId,
    id: expectedId,
    username: expectedEmail,
    email: expectedEmail,
    roles: ['admin'],
  };
  const expectedResponseCode = 200;

  const expectedResponse = {
    ...STATUS_RESPONSE_BODY,
  };

  const expectedRoute = PATH_STATUS;

  mockRequest.post = sinon.stub().returns({ on: () => {} });

  const expectedExpress = await testutils.setupAppV2(expectedUser, {});

  const expectedJwt = testutils.expectedJwtToken;

  const audit = require('../../../core/audit');
  const expectedUrl = `${config.baseUrl}${API_AUDIT_ACCESS_LOGS}`;
  const expectedIpAddress = '::ffff:127.0.0.1';
  const expectedCheckAllowedPostBody = {
    auditOperation: audit.operations.CHECK_ALLOWED,
    userId: 'none',
    additionalData: { path: PATH_STATUS },
  };

  const expectedCheckAllowedPostRequestOptions = {
    url: expectedUrl,
    json: true,
    body: expectedCheckAllowedPostBody,
    headers: {
      Authorization: config.access_logs.authorization_token,
      'x-forwarded-for': expectedIpAddress,
    },
  };

  // Act
  const actualResponse = await testutils.makeGETRequest(expectedExpress, expectedRoute, expectedJwt);

  // Assert
  t.deepEqual(actualResponse.statusCode, expectedResponseCode);
  expect(actualResponse.body).to.deep.equal(expectedResponse);
  t.deepEqual(mockRequest.post.getCall(0).args[0], expectedCheckAllowedPostRequestOptions);
});


const expectedRoute = PATH_STATUS;
const expectedMethod = 'GET';
const { testCaseList } = testutils;

testutils.USER_NO_CREDENTIALS.expectedResponse = testutils.expectedForbidden401;
testutils.USER_NO_AFFILIATIONS.expectedResponse = testutils.expectedForbidden403;
testutils.USER_EMS_MEMBER_CASE_CREATOR.expectedResponse = testutils.expectedForbidden403;
testutils.USER_EMS_MEMBER_SAME_EMS_WITH_CASE_CREATOR.expectedResponse = testutils.expectedForbidden403;
testutils.USER_EMS_MEMBER.expectedResponse = testutils.expectedForbidden403;
testutils.USER_MEMBER_DESTINATION_HOSPITAL.expectedResponse = testutils.expectedForbidden403;
testutils.USER_MEMBER_NOT_DESTINATION_HOSPITAL.expectedResponse = testutils.expectedForbidden403;
testutils.USER_MEMBER_CA_EMS_CREATED_CASE.expectedResponse = testutils.expectedForbidden403;
testutils.USER_MEMBER_CA_DESTINATION_HOSPITAL.expectedResponse = testutils.expectedForbidden403;
testutils.USER_MEMBER_CA.expectedResponse = testutils.expectedForbidden403;
testutils.USER_ADMIN_DESTINATION_HOSPITAL.expectedResponse = testutils.expectedForbidden403;
testutils.USER_ADMIN_NOT_DESTINATION_HOSPITAL.expectedResponse = testutils.expectedForbidden403;
testutils.USER_ADMIN_EMS_CREATED_CASE.expectedResponse = testutils.expectedForbidden403;
testutils.USER_ADMIN_EMS.expectedResponse = testutils.expectedForbidden403;
testutils.USER_ADMIN_CA_DESTINATION_HOSPITAL.expectedResponse = testutils.expectedForbidden403;
testutils.USER_ADMIN_CA_EMS_CREATED_CASE.expectedResponse = testutils.expectedForbidden403;
testutils.USER_ADMIN_CA.expectedResponse = testutils.expectedForbidden403;
testutils.USER_GLOBAL_ADMIN.expectedResponse = testutils.expectedSuccess200;
testutils.USER_BIGBOARD.expectedResponse = testutils.expectedForbidden403;

testCaseList.forEach(run => {
  test.serial(`${expectedMethod} ${expectedRoute} ${run.desc}`, async t => {
    // Arrange
    mockRequest.post = sinon.stub().returns({ on: () => {} });

    const expectedExpress = await testutils.setupAppV2(run.user, run.twiageCase);
    const expectedJwt = testutils.expectedJwtToken;

    // Act
    const actualResponse = await testutils.makeGETRequest(expectedExpress, expectedRoute, expectedJwt);

    // Assert
    t.deepEqual(actualResponse.statusCode, run.expectedResponse.code);
  });
});
