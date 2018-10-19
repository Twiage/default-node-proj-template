describe('app', () => {
  const dummyDb = {};
  const dummyApp = {};
  const mockConfig = {};
  const mockExpress = {
    init: jest.fn(() => dummyApp),
  };
  const mockMongoose = {
    connect: jest.fn(() => new Promise(resolve => resolve(dummyDb))),
    loadModels: () => {},
  };

  beforeEach(() => {
    jest.mock('../mongoose', () => mockMongoose);
    jest.mock('../express', () => mockExpress);
    jest.mock('../../config/config', () => mockConfig);
  });

  test('init', async () => {
    // Arrange
    const expectedCallback = jest.fn();
    const app = require('../app');

    // Act
    await app.init(expectedCallback);

    // Assert
    expect(mockMongoose.connect).toBeCalled();
    expect(mockExpress.init).toBeCalledWith(dummyDb);
    expect(expectedCallback).toBeCalledWith(dummyApp, dummyDb, mockConfig);
  });

  test('init - with no callback', async () => {
    // Arrange
    const app = require('../app');

    // Act
    await app.init();

    // Assert
    expect(mockMongoose.connect).toBeCalled();
    expect(mockExpress.init).toBeCalledWith(dummyDb);
  });
});
