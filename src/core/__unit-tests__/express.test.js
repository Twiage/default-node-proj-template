import { createRequest } from 'node-mocks-http';

describe('express', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('start', () => {
    // Arrange
    const mockConfigureHealthRoutes = jest.fn();
    const mockExpressApp = {
      get: jest.fn(),
      listen: jest.fn((port, callback) => { callback(); }),
    };
    const mockLogger = { info: jest.fn() };

    jest.mock('../../modules/health/routes/health.routes', () => mockConfigureHealthRoutes);
    jest.mock('../logger', () => mockLogger);

    const expressModule = require('../express');

    const setupExpress = expressModule.default;
    const expectedPort = expressModule.PORT;

    expressModule.initializers.initHelmet = jest.fn();
    expressModule.initializers.initLogging = jest.fn();
    expressModule.initializers.initBodyParser = jest.fn();
    expressModule.initializers.getExpressApp = () => mockExpressApp;

    const expectedInfoString = `Server started at port ${expectedPort}`;

    // Act
    setupExpress();

    // Assert
    expect(mockConfigureHealthRoutes).toHaveBeenCalledWith(mockExpressApp);
    expect(mockExpressApp.listen).toHaveBeenCalledWith(expectedPort, expect.any(Function));
    expect(mockLogger.info).toHaveBeenCalledWith(expectedInfoString);
    expect(expressModule.initializers.initHelmet).toHaveBeenCalledWith(mockExpressApp);
    expect(expressModule.initializers.initLogging).toHaveBeenCalledWith(mockExpressApp);
    expect(expressModule.initializers.initBodyParser).toHaveBeenCalledWith(mockExpressApp);
  });

  test('initHelmet', () => {
    // Arrange
    const expectedDisableString = 'x-powered-by';
    const expectedframeguard = { id: 'some frameguard object' };
    const expectedxssFilter = { id: 'some xssFilter object' };
    const expectednoSniff = { id: 'some noSniff object' };
    const expectedieNoOpen = { id: 'some ieNoOpen object' };
    const expectedhsts = { id: 'some hsts object' };
    const expectedMilliseconds = 123414;
    const expectedDuration = 6;
    const expectedTimeInteval = 'months';
    const expectedHstsOptions = {
      maxAge: expectedMilliseconds,
      includeSubdomains: true,
      force: true,
    };

    const mockHelmet = {
      frameguard: jest.fn(() => expectedframeguard),
      xssFilter: jest.fn(() => expectedxssFilter),
      noSniff: jest.fn(() => expectednoSniff),
      ieNoOpen: jest.fn(() => expectedieNoOpen),
      hsts: jest.fn(() => expectedhsts),
    };
    const mockMoment = {
      duration: jest.fn(() => mockMoment),
      asMilliseconds: jest.fn(() => expectedMilliseconds),
    };

    const mockExpressApp = {
      use: jest.fn(),
      disable: jest.fn(),
    };
    jest.mock('helmet', () => mockHelmet);
    jest.mock('moment', () => mockMoment);
    const expressModule = require('../express');

    // Act
    expressModule.initializers.initHelmet(mockExpressApp);

    // Assert
    expect(mockHelmet.frameguard).toHaveBeenCalled();
    expect(mockHelmet.xssFilter).toHaveBeenCalled();
    expect(mockHelmet.noSniff).toHaveBeenCalled();
    expect(mockHelmet.ieNoOpen).toHaveBeenCalled();
    expect(mockExpressApp.use).toHaveBeenCalledWith(expectedframeguard);
    expect(mockExpressApp.use).toHaveBeenCalledWith(expectedxssFilter);
    expect(mockExpressApp.use).toHaveBeenCalledWith(expectednoSniff);
    expect(mockExpressApp.use).toHaveBeenCalledWith(expectedieNoOpen);
    expect(mockExpressApp.use).toHaveBeenCalledWith(expectedhsts);
    expect(mockExpressApp.disable).toHaveBeenCalledWith(expectedDisableString);
    expect(mockHelmet.hsts).toHaveBeenCalledWith(expectedHstsOptions);
    expect(mockMoment.duration).toHaveBeenCalledWith(expectedDuration, expectedTimeInteval);
  });

  test('initLogging', () => {
    // Arrange
    const mockLogger = {};
    const expectedWinstonMiddleware = () => {};

    const mockExpressWinston = {
      logger: jest.fn(() => expectedWinstonMiddleware),
    };

    jest.mock('express-winston', () => mockExpressWinston);

    jest.mock('../logger', () => mockLogger);
    const expressModule = require('../express');

    const expectedMessageFormat = '{{req.winstonMessageData.authInfo}} {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms';
    const expectedLoggerConfiguration = {
      winstonInstance: mockLogger,
      meta: true,
      msg: expectedMessageFormat,
      expressFormat: false,
      dynamicMeta: expressModule.initializers.extractEmail,
    };
    const expectedEnvString = 'production';
    const mockApp = {
      use: jest.fn(),
      get: () => expectedEnvString,
    };

    // Act
    expressModule.initializers.initLogging(mockApp);

    // Assert
    expect(mockExpressWinston.logger).toBeCalledWith(expectedLoggerConfiguration);
    expect(mockApp.use).toBeCalledWith(expectedWinstonMiddleware);
  });

  test('initBodyParser', () => {
    // Arrange
    const mockApp = {
      use: jest.fn(),
      get: () => {},
    };
    const expectedBodyParserUrlEncodedMiddleware = () => {};

    const expectedBodyParserJsonMiddleware = () => {};

    const mockBodyParser = {
      urlencoded: () => expectedBodyParserUrlEncodedMiddleware,
      json: () => expectedBodyParserJsonMiddleware,
    };

    jest.mock('body-parser', () => mockBodyParser);

    const expressModule = require('../express');

    // Act
    expressModule.initializers.initBodyParser(mockApp);

    // Assert
    expect(mockApp.use).toBeCalledWith(expectedBodyParserUrlEncodedMiddleware);
    expect(mockApp.use).toBeCalledWith(expectedBodyParserJsonMiddleware);
  });

  test('extract email from request header JWT - JWT present', () => {
    // Arrange
    const expectedAuthInfo = 'ilya.eremin@flatstack.com';
    const expectedJWT = 'JWT eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlseWEuZXJlbWluQGZsYXRzdGFjay5jb20iLCJpYXQiOjE1MjI4NTQ3NTQsImV4cCI6MTUyMzExMzk1NCwiaXNzIjoiVHdpYWdlIn0.ePPhL-tMinEIfqBhi19X1eqSMYuTHUvlgSq6mUhL4JuH2oKJEpW6jLms04e0-j32E81y0_cctswuA5ZF7bTVmxCPsjxCBSzul2h7RyvY93KGQQHQ_H7IqVEBHwGjwF__nRZsyoK_3ARn8GuxPzG-7CoOgR2-bPrA3vqz9wQILE0Bxc_Cb2OrNANbbKFsfhcQnxnGKFzTwMGLHNoFoteWfNJ3PAr7O7AKwz5bkGllzc90fGWrvDHT_66fvdZN52KdbAhxQt56FtYQNtWzeGJqJtyjLTO1MvuvhjD1YXQsBNpYI_puyqjhBkTewntz_mql3Dlu8y1kZ9nGAhPnksdw0_O6y8e2Z6NBr6js0FZM-moQrbfZYqjlcVvMw86c-AuRMR25ouf0aTLtOwLzVVctXI-_4GfszASoxwCfDuM_6YKAtadCKc2FcGsnX5ZAsQlvZLYGm-BYnLeAevjqSARMA18d7XwYJvpSl1YlYGCiMT0U4yp0pZnMXrg7QGhnUAXi2MYX92BcCiRrDuhVr3_UUsfYpYFK5O0g9TgKnB38x8r3LKu6-80EGduUJLss5XwehtcDJGyXsMvn9bIdxwdejkovjPm24mKg5_8obCFqgkrp5qatGnaV4ORz-AjVMSSR3xTqBFhm_mq9HqBoD2jP7QZIS_lZJpKjZEpQZxbk8XE';
    const expectedHeaders = {
      authorization: expectedJWT,
    };
    const expectedRequest = createRequest({
      headers: expectedHeaders,
    });
    const express = require('../express');


    // Act
    express.initializers.extractEmail(expectedRequest);

    // Assert
    expect(expectedRequest.winstonMessageData.authInfo).toEqual(expectedAuthInfo);
  });

  test('extract email from request header JWT - Bearer token present', () => {
    // Arrange
    const expectedAuthInfo = 'Bearer token';
    const expectedJWT = 'Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlseWEuZXJlbWluQGZsYXRzdGFjay5jb20iLCJpYXQiOjE1MjI4NTQ3NTQsImV4cCI6MTUyMzExMzk1NCwiaXNzIjoiVHdpYWdlIn0.GFTurO_TOsVOCPlKhB8BeMaa294qziaVBU3G8qsHcZc-8ca6YDzBLRlvNwG8ml6IEIrBIwETRSitD27COZesqFsR6SqG62QMtfBNZwtj6Ezw8l1Fx3UdL6huYF3Hfsvba6n1-KivZlLc4ajoykV3M7NlJDe1Io4ERSxAyoZfDN-qhpsInz0mF5ZDTeqW-N0WZaZ40AMjqylaFdaIlj0su6k7_QjswyDIJ0IJCR2qntonMZ-xwwYEkzsa7E2EZo1SSyuzzyqBx96D4rkHD6v0quD_NyCE6SCBXOr_fVjGEDgVKXadx6qZ_Aa358ZvimVr0TLP3OWlA2uzVDh0sMUlojFl-OkjoMQDVPNw9Ru2BvbuKRsH9w5-AgGtqaJKJjBhtb3tJwK3_6MoG649Lmp4OvxnqP27E86nB5pILpJ6RiJWZVNVRssmH9qma3Bpfb0wcyU_shXDoPGmlQyNtWk0WXb4Z8Ht6A0lCXHFzBT_WDF8va-K804og1YmWauvn5PSrAoKQYQiyLYvKHYnSqQBpktvXviprVjcqE8TYjouHsjzR0a9p_yKq-AWx5tU--hGOU-RIFf71Ft3FI6GXc3pQOS3Tb9LLETpPJLU0wrXc1H0MPLDV1epwXEKQ-9L_7CW98l5q8bUqlATAv3qu5YRLSAO3sXKCuuPD5Lur4ceRcY';
    const expectedHeaders = {
      authorization: expectedJWT,
    };
    const expectedRequest = createRequest({
      headers: expectedHeaders,
    });
    const express = require('../express');


    // Act
    express.initializers.extractEmail(expectedRequest);

    // Assert
    expect(expectedRequest.winstonMessageData.authInfo).toEqual(expectedAuthInfo);
  });

  test('extract email from request header JWT - no authorization header present', () => {
    // Arrange
    const expectedAuthInfo = 'No authorization header';
    const expectedRequest = createRequest({});
    const express = require('../express');


    // Act
    express.initializers.extractEmail(expectedRequest);

    // Assert
    expect(expectedRequest.winstonMessageData.authInfo).toEqual(expectedAuthInfo);
  });
});
