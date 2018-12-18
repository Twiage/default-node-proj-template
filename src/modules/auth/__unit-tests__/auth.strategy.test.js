describe('saml auth', () => {
  const expectedSamlStrategyName = 'expectedSamlStrategyNames';

  const mockIdpList = {
    getSamlStrategyNameFromRequest: jest.fn(() => expectedSamlStrategyName),
  };

  jest.mock('../idp.list', () => mockIdpList);

  afterEach(() => {
    jest.resetModules();
  });

  it('jwtAuth, non Saml Auth - JWT and SAML strategies', () => {
    // Arrange
    const expectedRequest = {};
    const expectedResponse = {};
    const expectedNext = () => {};

    const mockAuthNWithJwtStrategy = jest.fn();
    jest.mock('../authn.jwt.strategy', () => mockAuthNWithJwtStrategy);

    const samlAuth = require('../auth.strategy');

    // Act
    samlAuth.jwtAuth(expectedRequest, expectedResponse, expectedNext);

    // Assert
    expect(mockAuthNWithJwtStrategy).toHaveBeenCalledWith(expectedRequest, expectedResponse, expectedNext);
  });

  it('samlRedirectToIdP', () => {
    // Arrange
    const expectedStrategyName = 'adventist';
    const expectedRequestURL = `https://api.twiagemed.net/v4/saml/${expectedStrategyName}`;
    const expectedRequest = {
      url: expectedRequestURL,
    };

    const expectedResponse = {};
    const expectedNext = () => {};

    const mockPassportMiddleware = jest.fn();
    const mockPassport = {
      authenticate: jest.fn(() => mockPassportMiddleware),
    };

    jest.mock('passport', () => mockPassport);
    const samlAuth = require('../auth.strategy');
    const expectedOptions = samlAuth.AUTH_OPTIONS;

    // Act
    samlAuth.samlRedirectToIdP(expectedRequest, expectedResponse, expectedNext);

    // Assert
    expect(mockPassport.authenticate).toBeCalledWith(expectedStrategyName, expectedOptions);
    expect(mockPassportMiddleware).toBeCalledWith(expectedRequest, expectedResponse, expectedNext);
  });

  it('consumeSaml', async () => {
    // Arrange
    const expectedRequest = {};
    const expectedResponse = {};
    const expectedNext = () => {};

    const mockPassportMiddleware = jest.fn();
    const mockPassport = {
      authenticate: jest.fn(() => mockPassportMiddleware),
    };

    jest.mock('passport', () => mockPassport);

    const samlAuth = require('../auth.strategy');
    const expectedOptions = samlAuth.AUTH_OPTIONS;

    // Act
    await samlAuth.consumeSaml(expectedRequest, expectedResponse, expectedNext);

    // Assert
    expect(mockIdpList.getSamlStrategyNameFromRequest).toHaveBeenCalledWith(expectedRequest);
    expect(mockPassport.authenticate).toBeCalledWith(expectedSamlStrategyName, expectedOptions);
    expect(mockPassportMiddleware).toBeCalledWith(expectedRequest, expectedResponse, expectedNext);
  });

  it('AuthNAndAuthZCallback - if v4', () => {
    // Arrange
    const expectedUrl = '/v4/controllingAgencies';
    const expectedRequest = {
      url: expectedUrl,
    };
    const expectedResponse = { name: 'expectedResponse' };
    const expectedNext = () => 'expectedNext';
    const expectedGetByIdCallback = jest.fn();
    const expectedId = 'expectedId';

    const mockPassportMiddleware = jest.fn();
    const mockPassport = {
      authenticate: jest.fn(() => mockPassportMiddleware),
    };
    const mockRelayState = {
      setRelayState: jest.fn(),
    };
    const expectedPassportCallback = () => {};
    const mockPassportCallback = jest.fn(() => expectedPassportCallback);
    const mockAuthNWithJwtStrategy = jest.fn();

    jest.mock('../saml.relayState', () => mockRelayState);
    jest.mock('passport', () => mockPassport);
    jest.mock('../passport.callback', () => mockPassportCallback);
    jest.mock('../authn.jwt.strategy', () => mockAuthNWithJwtStrategy);
    const samlAuth = require('../auth.strategy');
    const expectedAuthNAndAuthZCallback = samlAuth.generateAuthNAndAuthZCallback(expectedGetByIdCallback);

    // Act
    expectedAuthNAndAuthZCallback(expectedRequest, expectedResponse, expectedNext, expectedId);

    // Assert
    expect(mockAuthNWithJwtStrategy).toHaveBeenCalledWith(expectedRequest, expectedResponse, expectedNext, expectedPassportCallback);
    expect(mockPassportCallback).toBeCalledWith(expectedRequest, expectedResponse, expectedNext, expectedId, expectedGetByIdCallback);
  });

  it('AuthNAndAuthZCallback - if v1', () => {
    // Arrange
    const expectedUrl = '/v1/status';
    const expectedRequest = {
      url: expectedUrl,
    };
    const expectedResponse = { name: 'expectedResponse' };
    const expectedNext = () => 'expectedNext';
    const expectedGetByIdCallback = jest.fn();
    const expectedId = 'expectedId';

    const mockPassportMiddleware = jest.fn();
    const mockPassport = {
      authenticate: jest.fn(() => mockPassportMiddleware),
    };
    const mockRelayState = {
      setRelayState: jest.fn(),
    };
    const expectedPassportCallback = () => {};
    const mockPassportCallback = jest.fn(() => expectedPassportCallback);
    const mockAuthNWithJwtStrategy = jest.fn();

    jest.mock('../saml.relayState', () => mockRelayState);
    jest.mock('passport', () => mockPassport);
    jest.mock('../passport.callback', () => mockPassportCallback);
    jest.mock('../authn.jwt.strategy', () => mockAuthNWithJwtStrategy);
    const samlAuth = require('../auth.strategy');
    const expectedAuthNAndAuthZCallback = samlAuth.generateAuthNAndAuthZCallback(expectedGetByIdCallback);

    // Act
    expectedAuthNAndAuthZCallback(expectedRequest, expectedResponse, expectedNext, expectedId);

    // Assert
    expect(mockAuthNWithJwtStrategy).toHaveBeenCalledWith(expectedRequest, expectedResponse, expectedNext, expectedPassportCallback);
    expect(mockPassportCallback).toBeCalledWith(expectedRequest, expectedResponse, expectedNext, expectedId, expectedGetByIdCallback);
  });

  it('AuthNAndAuthZCallback - if v3', () => {
    // Arrange
    const expectedUrl = '/v3/controllingAgencies';
    const expectedRequest = {
      url: expectedUrl,
    };
    const expectedResponse = { name: 'expectedResponse' };
    const expectedNext = () => 'expectedNext';
    const mockGetByIdCallback = jest.fn();
    const expectedId = 'expectedId';

    const mockPassportMiddleware = jest.fn();
    const mockPassport = {
      authenticate: jest.fn(() => mockPassportMiddleware),
    };
    const mockRelayState = {
      setRelayState: jest.fn(),
    };
    const mockPassportCallback = jest.fn();

    jest.mock('../saml.relayState', () => mockRelayState);
    jest.mock('passport', () => mockPassport);
    jest.mock('../passport.callback', () => mockPassportCallback);
    const samlAuth = require('../auth.strategy');

    const expectedAuthNAndAuthZCallback = samlAuth.generateAuthNAndAuthZCallback(mockGetByIdCallback);

    // Act
    expectedAuthNAndAuthZCallback(expectedRequest, expectedResponse, expectedNext, expectedId);

    // Assert
    expect(mockGetByIdCallback).toBeCalledWith(expectedRequest, expectedResponse, expectedNext, expectedId);
  });
});
