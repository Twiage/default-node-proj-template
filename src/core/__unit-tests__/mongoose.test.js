describe('mongoose', () => {
  let mockMongooseLibrary;
  const expectedDebugFlagName = 'debug';
  const expectedUri = 'mongodb://ec2-12-345-67-89.compute-1.amazonaws.com:27017/db-name';
  const expectedOptions = { someKey: 'someValue' };
  const expectedDebugValue = false;
  const mockConfig = {
    db: {
      uri: expectedUri,
      options: expectedOptions,
      debug: expectedDebugValue,
    },
  };

  beforeEach(() => {
    jest.mock('mongoose', () => mockMongooseLibrary);
    jest.mock('../../config/config', () => mockConfig);
  });

  test('connect', async () => {
    // Arrange
    const expectedPromise = new Promise(resolve => resolve(mockMongooseLibrary));
    mockMongooseLibrary = {
      connect: jest.fn(() => expectedPromise),
      set: jest.fn(),
    };
    const mongoose = require('../mongoose');

    // Act
    const actualPromise = await mongoose.connect();

    // Assert
    expect(mockMongooseLibrary.connect).toBeCalledWith(expectedUri, expectedOptions);
    expect(mockMongooseLibrary.set).toBeCalledWith(expectedDebugFlagName, expectedDebugValue);
    expect(actualPromise).toBe(mockMongooseLibrary);
  });

  test('connect - failed', async () => {
    // Arrange
    const expectedError = 'error';
    mockMongooseLibrary = {
      connect: jest.fn(() => new Promise((resolve, reject) => reject(expectedError))),
      set: jest.fn(),
    };
    const mongoose = require('../mongoose');

    // Act
    try {
      await mongoose.connect();
      // eslint-disable-next-line no-undef
      fail();
    } catch (e) {
      // Assert
      expect(e).toBe(expectedError);
      expect(mockMongooseLibrary.connect).toBeCalledWith(expectedUri, expectedOptions);
    }
  });

  afterEach(() => {
    jest.resetModules();
  });
});
