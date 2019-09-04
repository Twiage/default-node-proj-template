import mockPassport from 'passport';

import authNWithJwtStrategy, { AUTH_OPTIONS } from '../authn.jwt.strategy';

jest.mock('passport');

describe('authn.jwt.strategy', () => {
  it('authNWithJwtStrategy', () => {
    // Arrange
    const expectedRequest = {};
    const expectedResponse = {};
    const expectedNext = () => {};
    const expectedCallback = () => {};
    const expectedAuthStrategies = ['jwt'];

    const mockPassportMiddleware = jest.fn();

    mockPassport.authenticate.mockImplementation(() => mockPassportMiddleware);

    // Act
    authNWithJwtStrategy(expectedRequest, expectedResponse, expectedNext, expectedCallback);

    // Assert
    expect(mockPassport.authenticate).toHaveBeenCalledWith(expectedAuthStrategies, AUTH_OPTIONS, expectedCallback);
    expect(mockPassportMiddleware).toHaveBeenCalledWith(expectedRequest, expectedResponse, expectedNext);
  });
});
