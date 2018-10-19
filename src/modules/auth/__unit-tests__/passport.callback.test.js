describe('passportCallback', () => {
  const generatePassport = require('../passport.callback');
  const expectedUser = {};
  const expectedInfo = {};
  const mockNext = jest.fn();
  const mockCallback = jest.fn();
  const expectedId = {};
  const expectedRequest = {};
  const expectedResponse = {};

  it('passportCallback', () => {
    // Arrange
    const expectedError = null;
    const actualPassportCallback = generatePassport(expectedRequest, expectedResponse, mockNext, expectedId, mockCallback);

    // Act
    actualPassportCallback(expectedError, expectedUser, expectedInfo);

    // Assert
    expect(mockCallback).toBeCalledWith(expectedRequest, expectedResponse, mockNext, expectedId);
  });

  it('passportCallback - error', () => {
    // Arrange
    const expectedError = 'Error: Matt!!!';
    const actualPassportCallback = generatePassport(expectedRequest, expectedResponse, mockNext, expectedId, mockCallback);

    // Act
    actualPassportCallback(expectedError, expectedUser, expectedInfo);

    // Assert
    expect(mockCallback).toBeCalledWith(expectedRequest, expectedResponse, mockNext, expectedId);
    expect(mockNext).toBeCalledWith(expectedError);
  });
});
