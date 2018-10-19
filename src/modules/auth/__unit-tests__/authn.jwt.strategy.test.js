describe('authn.jwt.strategy', () => {
  it('authNWithJwtStrategy', () => {
    // Arrange
    const expectedRequest = {};
    const expectedResponse = {};
    const expectedNext = () => {};
    const expectedCallback = () => {};
    const expectedAuthStrategies = ['jwt'];

    const mockPassportMiddleware = jest.fn();
    const mockPassport = {
      authenticate: jest.fn(() => mockPassportMiddleware),
    };
    const mockConfig = { jwt: {}, sso: { okta: {}, adventist: {} } };

    jest.mock('../../../config/config', () => mockConfig);
    jest.mock('passport', () => mockPassport);

    const authNWithJwtStrategy = require('../authn.jwt.strategy');
    const expectedAuthOptions = require('../auth.strategy').AUTH_OPTIONS;

    // Act
    authNWithJwtStrategy.default(expectedRequest, expectedResponse, expectedNext, expectedCallback);

    // Assert
    expect(mockPassport.authenticate).toHaveBeenCalledWith(expectedAuthStrategies, expectedAuthOptions, expectedCallback);
    expect(mockPassportMiddleware).toHaveBeenCalledWith(expectedRequest, expectedResponse, expectedNext);
  });
});
