import { API_AUDIT_ACCESS_LOGS } from '../urlPaths';

describe('audit', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('log', () => {
    const expectedBaseUrl = 'https://api-stage.twiagemed.net';
    const expectedAuthorizationToken = 'your_token';
    const mockConfig = { baseUrl: expectedBaseUrl, access_logs: { authorization_token: expectedAuthorizationToken } };

    it('log - ip in header', () => {
      // Arrange
      const expectedUserId = 'user-id';
      const expectedTwiageCaseId = 'case-id';
      const expectedUser = { id: expectedUserId };
      const expectedAdditionalData = {};
      const mockLogger = { default: () => {} };

      const mockRequestLibrary = { post: jest.fn(() => mockRequestLibrary), on: () => {} };

      jest.mock('request', () => mockRequestLibrary);
      jest.mock('../logger', () => mockLogger);
      jest.mock('../../config/config', () => mockConfig);

      const audit = require('../audit');
      const expectedOperation = audit.operations.CASE_UPLOAD_CREATE_SUCCESS;
      const expectedAccessLogOperation = audit.accessLogOperations.UPDATE;
      const expectedIpAddress = 'ipAddressOfClient';
      const expectedHeaders = { Authorization: expectedAuthorizationToken, 'x-forwarded-for': expectedIpAddress };

      const expectedRequest = { headers: { 'x-forwarded-for': expectedIpAddress } };

      const expectedUrl = `${expectedBaseUrl}${API_AUDIT_ACCESS_LOGS}`;
      const expectedBody = {
        accessLogOperation: expectedAccessLogOperation,
        auditOperation: expectedOperation,
        userId: expectedUserId,
        twiageCaseId: expectedTwiageCaseId,
        additionalData: expectedAdditionalData,
      };
      const expectedOptions = {
        url: expectedUrl, json: true, body: expectedBody, headers: expectedHeaders,
      };

      // Act
      audit.log(expectedOperation, expectedRequest, expectedUser, expectedAdditionalData, expectedTwiageCaseId, expectedAccessLogOperation);

      // Assert
      expect(mockRequestLibrary.post).toHaveBeenCalledWith(expectedOptions);
    });

    it('log - ip in req.connection.remoteAddress', () => {
      // Arrange
      const expectedUserId = 'user-id';
      const expectedTwiageCaseId = 'case-id';
      const expectedUser = { id: expectedUserId };
      const expectedAccessLogOperation = 'create';
      const expectedAdditionalData = { };
      const mockLogger = { default: () => {} };

      const mockRequestLibrary = { post: jest.fn(() => mockRequestLibrary), on: () => {} };

      jest.mock('request', () => mockRequestLibrary);
      jest.mock('../logger', () => mockLogger);
      jest.mock('../../config/config', () => mockConfig);

      const audit = require('../audit');
      const expectedOperation = audit.operations.CASE_UPLOAD_CREATE_SUCCESS;

      const expectedIpAddress = 'ipAddressOfClient';
      const expectedRequest = {
        headers: {},
        connection: {
          remoteAddress: expectedIpAddress,
        },
      };
      const expectedUrl = `${expectedBaseUrl}${API_AUDIT_ACCESS_LOGS}`;
      const expectedBody = {
        accessLogOperation: expectedAccessLogOperation,
        auditOperation: expectedOperation,
        userId: expectedUserId,
        twiageCaseId: expectedTwiageCaseId,
        additionalData: expectedAdditionalData,
      };
      const expectedHeaders = { Authorization: expectedAuthorizationToken, 'x-forwarded-for': expectedIpAddress };
      const expectedOptions = {
        url: expectedUrl, json: true, body: expectedBody, headers: expectedHeaders,
      };

      // Act
      audit.log(expectedOperation, expectedRequest, expectedUser, expectedAdditionalData, expectedTwiageCaseId, expectedAccessLogOperation);

      // Assert
      expect(mockRequestLibrary.post).toHaveBeenCalledWith(expectedOptions);
    });

    it('log - no ip address', () => {
      // Arrange
      const expectedUserId = 'user-id';
      const expectedTwiageCaseId = 'case-id';
      const expectedUser = { id: expectedUserId };
      const expectedAccessLogOperation = 'create';
      const expectedAdditionalData = { };
      const mockLogger = { default: () => {} };

      const mockRequestLibrary = { post: jest.fn(() => mockRequestLibrary), on: () => {} };

      jest.mock('request', () => mockRequestLibrary);
      jest.mock('../logger', () => mockLogger);
      jest.mock('../../config/config', () => mockConfig);

      const audit = require('../audit');
      const expectedOperation = audit.operations.CASE_UPLOAD_CREATE_SUCCESS;
      const expectedIpAddress = 'none';
      const expectedHeaders = { Authorization: expectedAuthorizationToken, 'x-forwarded-for': expectedIpAddress };

      const expectedRequest = null;

      const expectedUrl = `${expectedBaseUrl}${API_AUDIT_ACCESS_LOGS}`;
      const expectedBody = {
        accessLogOperation: expectedAccessLogOperation,
        auditOperation: expectedOperation,
        userId: expectedUserId,
        twiageCaseId: expectedTwiageCaseId,
        additionalData: expectedAdditionalData,
      };
      const expectedOptions = {
        url: expectedUrl, json: true, body: expectedBody, headers: expectedHeaders,
      };

      // Act
      audit.log(expectedOperation, expectedRequest, expectedUser, expectedAdditionalData, expectedTwiageCaseId, expectedAccessLogOperation);

      // Assert
      expect(mockRequestLibrary.post).toHaveBeenCalledWith(expectedOptions);
    });

    it('log - no user', () => {
      // Arrange
      const expectedUserId = 'none';
      const expectedTwiageCaseId = 'case-id';
      const expectedUser = null;
      const expectedAccessLogOperation = 'create';
      const expectedAdditionalData = { };
      const mockLogger = { default: () => {} };

      const mockRequestLibrary = { post: jest.fn(() => mockRequestLibrary), on: () => {} };

      jest.mock('request', () => mockRequestLibrary);
      jest.mock('../logger', () => mockLogger);
      jest.mock('../../config/config', () => mockConfig);

      const audit = require('../audit');
      const expectedOperation = audit.operations.CASE_UPLOAD_CREATE_SUCCESS;

      const expectedRequest = null;
      const expectedIpAddress = 'none';
      const expectedHeaders = { Authorization: expectedAuthorizationToken, 'x-forwarded-for': expectedIpAddress };

      const expectedUrl = `${expectedBaseUrl}${API_AUDIT_ACCESS_LOGS}`;
      const expectedBody = {
        accessLogOperation: expectedAccessLogOperation,
        auditOperation: expectedOperation,
        userId: expectedUserId,
        twiageCaseId: expectedTwiageCaseId,
        additionalData: expectedAdditionalData,
      };
      const expectedOptions = {
        url: expectedUrl, json: true, body: expectedBody, headers: expectedHeaders,
      };

      // Act
      audit.log(expectedOperation, expectedRequest, expectedUser, expectedAdditionalData, expectedTwiageCaseId, expectedAccessLogOperation);

      // Assert
      expect(mockRequestLibrary.post).toHaveBeenCalledWith(expectedOptions);
    });

    it('log - no twiageCaseId', () => {
      // Arrange
      const expectedUserId = 'none';
      const expectedTwiageCaseId = null;
      const expectedUser = null;
      const expectedAccessLogOperation = 'create';
      const expectedAdditionalData = { };
      const mockLogger = { default: () => {} };

      const mockRequestLibrary = { post: jest.fn(() => mockRequestLibrary), on: () => {} };

      jest.mock('request', () => mockRequestLibrary);
      jest.mock('../logger', () => mockLogger);
      jest.mock('../../config/config', () => mockConfig);

      const audit = require('../audit');
      const expectedOperation = audit.operations.CASE_UPLOAD_CREATE_SUCCESS;
      const expectedIpAddress = 'none';
      const expectedHeaders = { Authorization: expectedAuthorizationToken, 'x-forwarded-for': expectedIpAddress };

      const expectedRequest = null;

      const expectedUrl = `${expectedBaseUrl}${API_AUDIT_ACCESS_LOGS}`;
      const expectedBody = {
        accessLogOperation: expectedAccessLogOperation,
        auditOperation: expectedOperation,
        userId: expectedUserId,
        additionalData: expectedAdditionalData,
      };
      const expectedOptions = {
        url: expectedUrl, json: true, body: expectedBody, headers: expectedHeaders,
      };

      // Act
      audit.log(expectedOperation, expectedRequest, expectedUser, expectedAdditionalData, expectedTwiageCaseId, expectedAccessLogOperation);

      // Assert
      expect(mockRequestLibrary.post).toHaveBeenCalledWith(expectedOptions);
    });

    it('log - no Access log operation', () => {
      // Arrange
      const expectedUserId = 'none';
      const expectedTwiageCaseId = null;
      const expectedUser = null;
      const expectedAccessLogOperation = null;
      const expectedAdditionalData = { };
      const mockLogger = { default: () => {} };

      const mockRequestLibrary = { post: jest.fn(() => mockRequestLibrary), on: () => {} };

      jest.mock('request', () => mockRequestLibrary);
      jest.mock('../logger', () => mockLogger);
      jest.mock('../../config/config', () => mockConfig);

      const audit = require('../audit');
      const expectedOperation = audit.operations.CASE_UPLOAD_CREATE_SUCCESS;
      const expectedIpAddress = 'none';
      const expectedHeaders = { Authorization: expectedAuthorizationToken, 'x-forwarded-for': expectedIpAddress };

      const expectedRequest = null;

      const expectedUrl = `${expectedBaseUrl}${API_AUDIT_ACCESS_LOGS}`;
      const expectedBody = {
        auditOperation: expectedOperation,
        userId: expectedUserId,
        additionalData: expectedAdditionalData,
      };
      const expectedOptions = {
        url: expectedUrl, json: true, body: expectedBody, headers: expectedHeaders,
      };

      // Act
      audit.log(expectedOperation, expectedRequest, expectedUser, expectedAdditionalData, expectedTwiageCaseId, expectedAccessLogOperation);

      // Assert
      expect(mockRequestLibrary.post).toHaveBeenCalledWith(expectedOptions);
    });
  });

  test('logCaseOperation', () => {
    // Arrange
    const expectedTwiageCaseId = 'some twiage case hash';
    const expectedRequest = { body: 'some body' };
    const expectedUser = { id: 'some user id' };
    const expectedTwiageCase = { id: expectedTwiageCaseId };
    const expectedAdditionalData = { uploadUrl: 'some url' };

    const audit = require('../audit');
    const expectedOperation = audit.operations.CASE_UPLOAD_CREATE_SUCCESS;
    const expectedAccessLogOperation = audit.accessLogOperations.UPDATE;

    audit.log = jest.fn();

    // Act
    audit.logCaseOperation(expectedOperation, expectedRequest, expectedUser, expectedTwiageCase, expectedAdditionalData, expectedAccessLogOperation);

    // Assert
    expect(audit.log).toHaveBeenCalledWith(expectedOperation, expectedRequest, expectedUser, expectedAdditionalData, expectedTwiageCaseId, expectedAccessLogOperation);
  });
});
