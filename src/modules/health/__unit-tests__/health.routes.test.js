import sinon from 'sinon';
import { PATH_V1_HEALTH, PATH_V1_STATUS } from '../../../core/urlPaths';

describe('health.routes', () => {
  test('configure routes', () => {
    // Arrange
    const expectedHealthUrl = PATH_V1_HEALTH;
    const expectedStatusUrl = PATH_V1_STATUS;
    const mockHealthRouteV1 = {
      get: jest.fn(() => mockHealthRouteV1),
    };
    const mockStatusRouteV1 = {
      all: jest.fn(() => mockStatusRouteV1),
      get: jest.fn(() => mockStatusRouteV1),
    };

    const dummyApp = {
      route: () => {},
      param: jest.fn(),
    };

    const mockApp = sinon.mock(dummyApp);
    mockApp.expects('route').withArgs(expectedHealthUrl).returns(mockHealthRouteV1);
    mockApp.expects('route').withArgs(expectedStatusUrl).returns(mockStatusRouteV1);

    const mockHealthControllers = {
      status: () => {},
      healthCheck: () => {},
    };

    class MockControllerFactory {
      getNewHealthController() { return mockHealthControllers; }
    }

    const mockAuthStrategy = {
      tokenAndSamlAuth: () => {},
    };

    const mockStatusPolicy = {
      isAllowed: () => {},
    };


    jest.mock('../policies/health.policy.js', () => mockStatusPolicy);
    jest.mock('../../../core/ControllerFactory', () => MockControllerFactory);
    jest.mock('../../auth/auth.strategy', () => mockAuthStrategy);

    const healthRoutes = require('../routes/health.routes');

    // Act
    healthRoutes(dummyApp);

    // Assert
    expect(mockStatusRouteV1.all).toHaveBeenCalledWith(mockAuthStrategy.tokenAndSamlAuth, mockStatusPolicy.isAllowed);
    expect(mockHealthRouteV1.get).toHaveBeenCalledWith(mockHealthControllers.healthCheck);
    expect(mockStatusRouteV1.get).toHaveBeenCalledWith(mockHealthControllers.status);
  });
});
