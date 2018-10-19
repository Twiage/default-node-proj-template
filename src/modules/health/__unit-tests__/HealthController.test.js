import { createRequest, createResponse } from 'node-mocks-http';
import { OK } from 'http-status-codes';
import HealthController, { HEALTHY_RESPONSE_BODY, STATUS_RESPONSE_BODY } from '../controllers/HealthController';

describe('HealthController', () => {
  let healthController;

  beforeEach(() => {
    healthController = new HealthController();
  });

  test('healthCheck', () => {
    // Arrange
    const expectedStatusCode = OK;
    const expectedResponseBody = JSON.stringify(HEALTHY_RESPONSE_BODY);
    const expectedRequest = createRequest();
    const expectedResponse = createResponse();

    // Act
    healthController.healthCheck(expectedRequest, expectedResponse);

    // Assert
    expect(expectedResponse.statusCode).toEqual(expectedStatusCode);
    expect(expectedResponse._getData()).toEqual(expectedResponseBody);
  });

  test('status', () => {
    // Arrange
    const expectedStatusCode = OK;
    const expectedResponseBody = JSON.stringify(STATUS_RESPONSE_BODY);
    const expectedRequest = createRequest();
    const expectedResponse = createResponse();

    // Act
    healthController.status(expectedRequest, expectedResponse);

    // Assert
    expect(expectedResponse.statusCode).toEqual(expectedStatusCode);
    expect(expectedResponse._getData()).toEqual(expectedResponseBody);
  });
});
