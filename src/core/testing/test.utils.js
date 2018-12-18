import express from 'express';
import passport from 'passport';
import BodyParser from 'body-parser';
import mock from 'mock-require';
import supertest from 'supertest';

const expectedJwtToken = 'JWT eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRub20uYWxiZXJ0LmlseWEubWF0dC5sZXlsYUBleGFtcGxlLmNvbSIsImlhdCI6MTUzOTY4NjQ2OCwiZXhwIjoyNTM5OTQ1NjY4LCJpc3MiOiJUd2lhZ2UifQ.Pb5TuUH1CUxEr5e_ghgPjvjZiC4s7wNl_Bz66VDFlJujJMYt8kcI6Z_Z7TAdWtL8rySJRye9omIzgCYc9s7ll0gv_1hCx6a-Swufx-wb6aeZwTC6rPN4Qp81JTzwz2JcdA4JtTy-e2JHNSQVmz4s2YkDiK7I9irTutkPPujf1nPBhsMDJwvQPwip1-c1pzxJEBET7Bshpwvv-5hebsXAVKZbWzLU9gVwNlVBMbG_mysfGJblvtbcWwsQYKEt5kd50XFjK60Dr5o8FSOOBYkfQf4hfBfDGisymFF8ieKTT_ffhPnoxVmLrDe6VYcFu5y1uQ1w8-OPH3fhaXgGMrpmHVm29gRUNIby2pJgiE-Q2aUK4qfYPpq6fQYThryOPik3tLXEWZ_rvWhGfGwvY4kgr407PZ-f13XKFMcaQ2vzqC_bNXPW0wuX42BPRb1b0J1J0ws3eA2DclV-ciVq4bz0x_uFivV7gV5xWyOwI1Dnk9tHkns29tZ6-IBypt9zPOD0NI62Z0trjwGitPjXsWIW_unhT6jXTuvbU_4Q8nYhcydJSGQIn1iZejKulUN0dD5nORzUIVZdXekQVLKtCOOQiCRLqEDcZ7R7SaxTSDdvVi6q8gpjB0NIHRRjh0etl66OFbVzOPaIAg620kO5J6elm001ifKNlOg3D4wPR8CMsug'; // {"email": "dnom.albert.ilya.matt.leyla@example.com", "iat": 1539686468, "exp": 2539945668, "iss": "Twiage"}
const AUTHORIZATION_HEADER_NAME = 'Authorization';
const crudControllerMethodNames = ['list', 'create', 'read', 'patch', 'update', 'delete'];
exports.AUTHORIZATION_HEADER_NAME = AUTHORIZATION_HEADER_NAME;
exports.expectedJwtToken = expectedJwtToken;
exports.codeForbidden = 403;
exports.codeCreated = 201;

exports.setupAppV2 = (user, twiageCase = {}) => new Promise(resolve => {
  const mockMongoose = require('mongoose');
  const mockExpressModule = require('../../core/express');
  mockExpressModule.initializers.initLogging = () => {};

  const mockExpress = mockExpressModule.initializers.getExpressApp();

  mockMongoose.connect = () => new Promise(connectResolve => connectResolve());
  mockMongoose.set = () => {};
  mockMongoose.Types.ObjectId.isValid = () => true;

  mockExpress.listen = (port, callback) => callback();

  require('../../core/app').start(() => {
    const mockAccessTokenModel = mockMongoose.model('AccessToken');
    const mockToken = {
      isExpired: () => false,
      user,
    };
    const mockQuery = {
      populate: () => mockQuery,
      exec: callback => callback(null, mockToken),
    };
    mockAccessTokenModel.findOne = () => mockQuery;

    const mockUserModel = mockMongoose.model('User');
    mockUserModel.findOne = () => new Promise(findOneResolve => findOneResolve(user));
    mockUserModel.verification = true;

    const mockTwiageCase = mockMongoose.model('TwiageCase');
    mockTwiageCase.findById = () => ({ exec: callback => callback(null, twiageCase) });
    resolve(mockExpress);
  });
});

/**
 * @param controllerPath relative to src/testutils/
 * @param routePath relative to src/testutils
 * @param methodName
 * @param byIdMethodName for example getCatByID
 * @param user
 * @param expectedSuccessResponse expected format: { code: expectedCode, body: expectedBody }
 */
exports.setupAppWithMockCrudController = (controllerPath, routePath, methodName, byIdMethodName, user, expectedSuccessResponse) => {
  const expectedExpress = exports.setupApp(user);

  exports.mockCrudController(controllerPath, methodName, byIdMethodName, expectedSuccessResponse);
  exports.setupRoute(routePath, expectedExpress);
  return expectedExpress;
};

exports.setupAppWithMockCrudControllerWithIdDetails = (
  controllerPath, routePath,
  mockMethodName, mockByIdMethodName, mockFieldName, mockFieldValue,
  user, expectedSuccessResponse, additionalMockMethodNames
) => {
  const expectedExpress = exports.setupApp(user);

  exports.mockCrudControllerWithDetails(
    controllerPath, mockMethodName, mockByIdMethodName, mockFieldName, mockFieldValue,
    expectedSuccessResponse, additionalMockMethodNames
  );

  exports.setupRoute(routePath, expectedExpress);

  return expectedExpress;
};

exports.mockCrudController = (controllerPath, mockMethodName, byIdMethodName, expectedSuccessResponse) => {
  let otherMethodNames = crudControllerMethodNames;
  if (typeof byIdMethodName === 'string') {
    otherMethodNames = otherMethodNames.concat([byIdMethodName]);
  } else if (byIdMethodName instanceof Array) {
    otherMethodNames = otherMethodNames.concat(byIdMethodName);
  }
  mock(controllerPath, exports.getMockController(expectedSuccessResponse, mockMethodName, otherMethodNames));
};

exports.mockCrudControllerWithDetails = (
  controllerPath, mockMethodName, mockByIdMethodName, mockFieldName,
  mockFieldValue, expectedSuccessResponse, additionalMethodNames
) => {
  let otherMethodnames = crudControllerMethodNames;
  if (additionalMethodNames) {
    if (typeof additionalMethodNames === 'string') {
      otherMethodnames.push(additionalMethodNames);
    } else if (additionalMethodNames instanceof Array) {
      otherMethodnames = otherMethodnames.concat(additionalMethodNames);
    }
  }
  const mockCrudController = exports.getMockController(expectedSuccessResponse, mockMethodName, otherMethodnames);
  mockCrudController[mockByIdMethodName] = (req, res, next) => {
    req[mockFieldName] = mockFieldValue;
    next();
  };

  mock(controllerPath, mockCrudController);
};

exports.setupRoute = (routePath, app) => {
  delete require.cache[require.resolve(routePath)];
  // eslint-disable-next-line import/no-dynamic-require
  const expectedRoutes = require(routePath);
  expectedRoutes(app);
};

exports.setupApp = user => {
  require('../../modules/auth/saml.config').default();
  const expectedExpress = exports.setupExpress();
  exports.setupJWTWithUser(user);
  const mockMongoose = { model: () => {} };
  mock('mongoose', mockMongoose);
  return expectedExpress;
};


exports.makeRequest = (method, app, route) => {
  switch (method) {
  case 'GET': return exports.makeGETRequest(app, route, expectedJwtToken);
  case 'PATCH': return exports.makePATCHRequest(app, route, expectedJwtToken);
  case 'DELETE': return exports.makeDELETERequest(app, route, expectedJwtToken);
  case 'POST': return exports.makePOSTRequest(app, route, expectedJwtToken);
  case 'PUT': return exports.makePUTRequest(app, route, expectedJwtToken);
  default: return null;
  }
};

exports.makeGETRequest = async (app, route, jwtToken) => supertest(app)
  .get(route)
  .set(AUTHORIZATION_HEADER_NAME, jwtToken);

exports.makePATCHRequest = async (app, route, jwtToken) => supertest(app)
  .patch(route)
  .set(AUTHORIZATION_HEADER_NAME, jwtToken);

exports.makeDELETERequest = async (app, route, jwtToken) => supertest(app)
  .delete(route)
  .set(AUTHORIZATION_HEADER_NAME, jwtToken);

exports.makePOSTRequest = async (app, route, jwtToken) => supertest(app)
  .post(route)
  .set(AUTHORIZATION_HEADER_NAME, jwtToken);

exports.makePUTRequest = async (app, route, jwtToken) => supertest(app)
  .put(route)
  .set(AUTHORIZATION_HEADER_NAME, jwtToken);


exports.emptyResponseBody = {};

exports.expectedSuccessBody = 'expectedAnswer';

exports.expectedSuccess200 = {
  code: 200,
  body: exports.expectedSuccessBody,
};

exports.expectedSuccess201 = {
  code: 201,
  body: exports.expectedSuccessBody,
};

exports.expectedSuccess204 = {
  code: 204,
  body: exports.emptyResponseBody,
};

exports.expectedForbidden401 = {
  code: 401,
  body: exports.emptyResponseBody,
};

exports.expectedForbidden403 = {
  code: exports.codeForbidden,
  body: exports.emptyResponseBody,
};

exports.expectedRedirect302 = {
  code: 302,
  body: exports.emptyResponseBody,
};

exports.hospitalId = '594a481ea2c651001190ed1c';
exports.emsAgencyId = '594a481ea2c651001190ed1d';
exports.controllingAgencyId = '594a481ea2c651001190ed1e';
exports.truckId = '594a481ea2c651001190e225';
exports.differentHospitalId = '594a481ea2c651001190ed1f';
exports.differentControllingAgencyId = '594a481ea2c651001190ed20';
exports.differentEMSAgencyId = '594a481ea2c651001190ed21';

exports.USER_NO_CREDENTIALS = {
  desc: 'No credentials',
  twiageCase: { _id: 1234, caseNumber: 56789, createdBy: { equals: () => false } },
};
exports.USER_NO_AFFILIATIONS = {
  desc: 'User - no affiliations',
  user: {
    roles: ['user'],
    controllingAgenciesAdministered: [],
    hospitalsAdministered: [],
  },
  twiageCase: { _id: 1234, caseNumber: 56789, createdBy: { equals: () => false } },

};
exports.USER_EMS_MEMBER_CASE_CREATOR = {
  desc: 'Member of EMS - Case Creator ',
  user: { roles: ['user'], emsAgencyMemberships: [exports.emsAgencyId] },
  emsAgency: { members: [{ equals: () => true }] },
  twiageCase: { _id: 1234, caseNumber: 56789, createdBy: { equals: () => true } },
};
exports.USER_EMS_MEMBER_SAME_EMS_WITH_CASE_CREATOR = {
  desc: 'Member of EMS that created case, but not case creator',
  user: { roles: ['user'], emsAgencyMemberships: [exports.emsAgencyId] },
  emsAgency: { members: [{ equals: () => true }] },
  twiageCase: { _id: 1234, caseNumber: 56789, createdBy: { equals: () => false } },
};
exports.USER_EMS_MEMBER = {
  desc: 'Member of EMS',
  user: { roles: ['user'], emsAgencyMemberships: [exports.differentEMSAgencyId] },
  emsAgency: { administrators: [{ equals: () => false }] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    destinationHospital: { members: [{ equals: () => false }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_MEMBER_DESTINATION_HOSPITAL = {
  desc: 'Member of Destination Hospital',
  user: { roles: ['user'], hospitalMemberships: [exports.hospitalId] },
  hospital: { members: [{ equals: () => true }] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    destinationHospital: { members: [{ equals: () => true }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_MEMBER_NOT_DESTINATION_HOSPITAL = {
  desc: 'Member of Not Destination Hospital',
  user: { roles: ['user'], hospitalMemberships: [exports.differentHospitalId] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    destinationHospital: { members: [{ equals: () => false }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_MEMBER_CA_EMS_CREATED_CASE = {
  desc: 'Member of CA controls EMS created case',
  user: { roles: ['user'], controllingAgencyMemberships: [exports.controllingAgencyId] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    emsAgency: { controllingAgencies: [{ equals: () => true }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_MEMBER_CA_DESTINATION_HOSPITAL = {
  desc: 'Member of CA controls Destination Hospital',
  user: { roles: ['user'], controllingAgencyMemberships: [exports.controllingAgencyId] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    destinationHospital: { controllingAgencies: [{ equals: () => true }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_MEMBER_CA = {
  desc: 'Member of CA',
  user: { roles: ['user'], controllingAgencyMemberships: [exports.differentControllingAgencyId] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    destinationHospital: { controllingAgencies: [{ equals: () => false }] },
    emsAgency: { controllingAgencies: [{ equals: () => false }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_ADMIN_DESTINATION_HOSPITAL = {
  desc: 'Admin of Destination Hospital',
  user: { roles: ['user'], hospitalsAdministered: [exports.hospitalId] },
  hospital: { administrators: [{ equals: () => true }] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    destinationHospital: { administrators: [{ equals: () => true }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_ADMIN_NOT_DESTINATION_HOSPITAL = {
  desc: 'Admin of NOT Destination Hospital',
  user: { roles: ['user'], hospitalsAdministered: [exports.differentHospitalId] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    destinationHospital: { administrators: [{ equals: () => false }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_ADMIN_EMS_CREATED_CASE = {
  desc: 'Admin of EMS created case',
  user: { roles: ['user'], emsAgenciesAdministered: [exports.emsAgencyId] },
  emsAgency: { administrators: [{ equals: () => true }] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    createdBy: { equals: () => true },
  },
};
exports.USER_ADMIN_EMS = {
  desc: 'Admin of EMS',
  user: { roles: ['user'], emsAgenciesAdministered: [exports.differentEMSAgencyId] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    emsAgency: { administrators: [{ equals: () => false }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_ADMIN_CA_DESTINATION_HOSPITAL = {
  desc: 'Admin of CA controlling Destination Hospital',
  user: { roles: ['user'], controllingAgenciesAdministered: [exports.controllingAgencyId] },
  controllingAgency: { administrators: [{ equals: () => true }] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    destinationHospital: { controllingAgencies: [{ equals: () => true }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_ADMIN_CA_EMS_CREATED_CASE = {
  desc: 'Admin of CA controlling EMS created case',
  controllingAgency: { administrators: [{ equals: () => true }] },
  user: { roles: ['user'], controllingAgenciesAdministered: [exports.controllingAgencyId] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    emsAgency: { controllingAgencies: [{ equals: () => true }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_ADMIN_CA = {
  desc: 'Admin of CA not associated with the hospital or EMS case creator',
  user: { roles: ['user'], controllingAgenciesAdministered: [exports.differentControllingAgencyId] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    emsAgency: { controllingAgencies: [{ equals: () => false }] },
    destinationHospital: { controllingAgencies: [{ equals: () => false }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_GLOBAL_ADMIN = {
  desc: 'Global Admin',
  user: { roles: ['admin'] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    destinationHospital: { members: [{ equals: () => false }] },
    createdBy: { equals: () => false },
  },
};
exports.USER_BIGBOARD = {
  desc: 'BigBoard',
  user: { roles: ['bigBoard'], hospitalMemberships: [exports.hospitalId] },
  hospital: { members: [{ equals: () => true }] },
  twiageCase: {
    _id: 1234,
    caseNumber: 56789,
    destinationHospital: { members: [{ equals: () => true }] },
    createdBy: { equals: () => false },
  },
};

exports.testCaseList = [
  exports.USER_NO_CREDENTIALS,
  exports.USER_NO_AFFILIATIONS,
  exports.USER_EMS_MEMBER_CASE_CREATOR,
  exports.USER_EMS_MEMBER_SAME_EMS_WITH_CASE_CREATOR,
  exports.USER_EMS_MEMBER,
  exports.USER_MEMBER_DESTINATION_HOSPITAL,
  exports.USER_MEMBER_NOT_DESTINATION_HOSPITAL,
  exports.USER_MEMBER_CA_EMS_CREATED_CASE,
  exports.USER_MEMBER_CA_DESTINATION_HOSPITAL,
  exports.USER_MEMBER_CA,
  exports.USER_ADMIN_DESTINATION_HOSPITAL,
  exports.USER_ADMIN_NOT_DESTINATION_HOSPITAL,
  exports.USER_ADMIN_EMS_CREATED_CASE,
  exports.USER_ADMIN_EMS,
  exports.USER_ADMIN_CA_DESTINATION_HOSPITAL,
  exports.USER_ADMIN_CA_EMS_CREATED_CASE,
  exports.USER_ADMIN_CA,
  exports.USER_GLOBAL_ADMIN,
  exports.USER_BIGBOARD,
];

exports.setupJWTWithUser = () => {
  delete require.cache[require.resolve('../../modules/auth/jwt.config')];
  const jwtConfig = require('../../modules/auth/jwt.config');
  jwtConfig.useJwtStrategy();
};

exports.setupExpress = () => {
  const expectedExpress = express();
  expectedExpress.use(BodyParser.urlencoded({ extended: true, inflate: false }));
  expectedExpress.use(passport.initialize());
  return expectedExpress;
};

exports.getUserRoutesMockController = (expectedSuccessResponse, methodName) => exports.getMockController(expectedSuccessResponse, methodName, ['me', 'update', 'changePassword', 'changeProfilePicture', 'userByID']);

exports.getMockController = (expectedSuccessResponse, mockMethodName, otherMethodNames) => {
  const mockController = {};
  if (otherMethodNames) {
    otherMethodNames.forEach(name => {
      if (typeof name === 'string') {
        mockController[name] = () => {};
      }
    });
  }
  mockController[mockMethodName] = (req, res) => {
    res.status(expectedSuccessResponse.code);
    res.json(expectedSuccessResponse.body);
  };
  return mockController;
};
