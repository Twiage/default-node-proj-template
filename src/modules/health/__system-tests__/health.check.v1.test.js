import test from 'ava';
import { expect } from 'chai';
import testutils from '../../../core/testing/test.utils';
import { MEDIA_SERVICE_PATH_V1_HEALTH, MEDIA_SERVICE_PATH_V1_STATUS } from '../../../core/urlPaths';
import { HEALTHY_RESPONSE_BODY, STATUS_RESPONSE_BODY } from '../controllers/HealthController';

test.serial('Health Check', async () => {
  // Arrange
  const expectedRoute = MEDIA_SERVICE_PATH_V1_HEALTH;
  const expectedJwtToken = '';
  const expectedResponse = HEALTHY_RESPONSE_BODY;

  const expectedExpress = testutils.setupExpress();
  testutils.setupRoute('../../modules/health/routes/health.routes', expectedExpress);

  // Act
  const actualResponse = await testutils.makeGETRequest(expectedExpress, expectedRoute, expectedJwtToken);

  // Assert
  expect(actualResponse.body).to.deep.equal(expectedResponse);
});

test.serial('Secure Health Check (status) - global admin', async () => {
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
  const expectedResponse = STATUS_RESPONSE_BODY;

  const expectedRoute = MEDIA_SERVICE_PATH_V1_STATUS;
  const expectedExpress = testutils.setupExpress();
  testutils.setupJWTWithUser(expectedUser);
  testutils.setupRoute('../../modules/health/routes/health.routes', expectedExpress);
  const expectedJwt = testutils.expectedJwtToken;

  // Act
  const actualResponse = await testutils.makeGETRequest(expectedExpress, expectedRoute, expectedJwt);

  // Assert
  expect(actualResponse.body).to.deep.equal(expectedResponse);
});


const expectedRoute = MEDIA_SERVICE_PATH_V1_STATUS;
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
    const expectedExpress = testutils.setupExpress();
    testutils.setupJWTWithUser(run.user);
    testutils.setupRoute('../../modules/health/routes/health.routes', expectedExpress);
    const expectedJwt = testutils.expectedJwtToken;

    // Act
    const actualResponse = await testutils.makeGETRequest(expectedExpress, expectedRoute, expectedJwt);

    // Assert
    t.deepEqual(actualResponse.statusCode, run.expectedResponse.code);
  });
});
