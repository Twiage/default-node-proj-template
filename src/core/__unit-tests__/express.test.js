import { createRequest } from 'node-mocks-http';

describe('express', () => {
  let originalConfigureApp;
  let originalConfigureLogging;
  let originalConfigureAuditLogging;
  let originalConfigureCaching;
  let express;

  const mockConfig = {};

  const expectedCompressMiddleware = () => {};
  const expectedBodyParserUrlEncodedMiddleware = () => {};
  const expectedBodyParserJsonMiddleware = () => {};
  const expectedWinstonMiddleware = () => {};

  const expectedLogger = {};
  const mockLogging = {
    default: expectedLogger,
  };
  const mockCors = jest.fn(() => {});
  const mockExpressWinston = {
    logger: jest.fn(() => expectedWinstonMiddleware),
  };
  const mockCompression = () => expectedCompressMiddleware;
  const mockBodyParser = {
    urlencoded: () => expectedBodyParserUrlEncodedMiddleware,
    json: () => expectedBodyParserJsonMiddleware,
  };
  const mockJwtConfig = {
    useJwtStrategy: jest.fn(),
  };
  const mockSamlConfig = jest.fn();

  beforeEach(() => {
    jest.mock('compression', () => mockCompression);
    jest.mock('body-parser', () => mockBodyParser);
    jest.mock('cors', () => mockCors);
    jest.mock('express-winston', () => mockExpressWinston);
    jest.mock('../logger', () => mockLogging);
    jest.mock('../../modules/auth/saml.config', () => mockSamlConfig);
    jest.mock('../../modules/auth/jwt.config', () => mockJwtConfig);
    jest.mock('../../config/config', () => mockConfig);
    express = require('../express');
    originalConfigureApp = express.configureApp;
    originalConfigureLogging = express.configureLogging;
    originalConfigureAuditLogging = express.configureAuditLogging;
    originalConfigureCaching = express.configureCaching;
  });

  afterEach(() => {
    express.configureApp = originalConfigureApp;
    express.configureLogging = originalConfigureLogging;
    express.configureCaching = originalConfigureCaching;
    express.configureAuditLogging = originalConfigureAuditLogging;
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

    // Act
    express.default.extractEmail(expectedRequest);

    // Assert
    expect(expectedRequest.winstonMessageData.authInfo).toEqual(expectedAuthInfo);
  });

  test('extract email from request header JWT - non JWT token present', () => {
    // Arrange
    const expectedAuthInfo = 'Bearer token';
    const expectedJWT = 'Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlseWEuZXJlbWluQGZsYXRzdGFjay5jb20iLCJpYXQiOjE1MjI4NTQ3NTQsImV4cCI6MTUyMzExMzk1NCwiaXNzIjoiVHdpYWdlIn0.GFTurO_TOsVOCPlKhB8BeMaa294qziaVBU3G8qsHcZc-8ca6YDzBLRlvNwG8ml6IEIrBIwETRSitD27COZesqFsR6SqG62QMtfBNZwtj6Ezw8l1Fx3UdL6huYF3Hfsvba6n1-KivZlLc4ajoykV3M7NlJDe1Io4ERSxAyoZfDN-qhpsInz0mF5ZDTeqW-N0WZaZ40AMjqylaFdaIlj0su6k7_QjswyDIJ0IJCR2qntonMZ-xwwYEkzsa7E2EZo1SSyuzzyqBx96D4rkHD6v0quD_NyCE6SCBXOr_fVjGEDgVKXadx6qZ_Aa358ZvimVr0TLP3OWlA2uzVDh0sMUlojFl-OkjoMQDVPNw9Ru2BvbuKRsH9w5-AgGtqaJKJjBhtb3tJwK3_6MoG649Lmp4OvxnqP27E86nB5pILpJ6RiJWZVNVRssmH9qma3Bpfb0wcyU_shXDoPGmlQyNtWk0WXb4Z8Ht6A0lCXHFzBT_WDF8va-K804og1YmWauvn5PSrAoKQYQiyLYvKHYnSqQBpktvXviprVjcqE8TYjouHsjzR0a9p_yKq-AWx5tU--hGOU-RIFf71Ft3FI6GXc3pQOS3Tb9LLETpPJLU0wrXc1H0MPLDV1epwXEKQ-9L_7CW98l5q8bUqlATAv3qu5YRLSAO3sXKCuuPD5Lur4ceRcY';
    const expectedHeaders = {
      authorization: expectedJWT,
    };
    const expectedRequest = createRequest({
      headers: expectedHeaders,
    });

    // Act
    express.default.extractEmail(expectedRequest);

    // Assert
    expect(expectedRequest.winstonMessageData.authInfo).toEqual(expectedAuthInfo);
  });

  test('extract email from request header JWT - no authorization header present', () => {
    // Arrange
    const expectedAuthInfo = 'No authorization header';
    const expectedRequest = createRequest({});

    // Act
    express.default.extractEmail(expectedRequest);

    // Assert
    expect(expectedRequest.winstonMessageData.authInfo).toEqual(expectedAuthInfo);
  });

  test('initMiddleware', () => {
    // Arrange
    const expectedStackError = 'showStackError';
    const expectedStackErrorState = true;
    const expectedJsonCallback = 'jsonp callback';

    const mockApp = {
      use: jest.fn(),
      initialize: jest.fn(),
      enable: jest.fn(),
      set: jest.fn(),
      get: jest.fn(),
    };

    const mockPassport = {
      initialize: jest.fn(() => mockPassport),
    };
    express.getPassport = () => mockPassport;
    express.configureApp = jest.fn();

    // Act
    express.initMiddleware(mockApp);

    // Assert
    expect(mockApp.use).toHaveBeenNthCalledWith(1, mockCors());
    expect(mockApp.use).toHaveBeenNthCalledWith(2, mockPassport.initialize());
    expect(express.configureApp).toBeCalledWith(mockApp);
    expect(mockApp.set).toBeCalledWith(expectedStackError, expectedStackErrorState);
    expect(mockApp.enable).toBeCalledWith(expectedJsonCallback);
    expect(mockPassport.initialize).toBeCalledWith();
    expect(mockJwtConfig.useJwtStrategy).toBeCalled();
    expect(mockSamlConfig).toBeCalled();
  });

  test('configureLogging - not test env', () => {
    // Arrange
    const expectedMessageFormat = '{{req.winstonMessageData.authInfo}} {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms';
    const expectedLoggerConfiguration = {
      winstonInstance: expectedLogger,
      meta: true,
      msg: expectedMessageFormat,
      expressFormat: false,
      dynamicMeta: express.default.extractEmail,
    };
    const expectedEnvString = 'production';
    const mockApp = {
      use: jest.fn(),
      get: () => expectedEnvString,
    };

    // Act
    express.configureLogging(mockApp);

    // Assert
    expect(mockExpressWinston.logger).toBeCalledWith(expectedLoggerConfiguration);
    expect(mockApp.use).toBeCalledWith(expectedWinstonMiddleware);
  });

  test('configureApp', () => {
    // Arrange
    const mockApp = {
      use: jest.fn(),
      get: () => {},
    };

    express.configureLogging = jest.fn();
    express.configureCaching = jest.fn();
    express.configureAuditLogging = jest.fn();

    // Act
    express.configureApp(mockApp);

    // Assert
    expect(mockApp.use).toBeCalledWith(expectedCompressMiddleware);
    expect(express.configureLogging).toHaveBeenCalledWith(mockApp);
    expect(express.configureCaching).toHaveBeenCalledWith(mockApp);
    expect(mockApp.use).toBeCalledWith(expectedBodyParserUrlEncodedMiddleware);
    expect(mockApp.use).toBeCalledWith(expectedBodyParserJsonMiddleware);
  });
});
