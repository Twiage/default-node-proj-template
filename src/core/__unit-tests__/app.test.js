describe('app', () => {
  const dummyDb = {};
  const mockConfig = {};
  const mockMongoose = {
    connect: jest.fn(() => new Promise(resolve => resolve(dummyDb))),
    loadModels: () => {},
  };
  const mockSetupExpress = jest.fn();

  beforeEach(() => {
    jest.mock('../express', () => mockSetupExpress);
    jest.mock('../mongoose', () => mockMongoose);
    jest.mock('../../config/config', () => mockConfig);
  });

  test('init', async () => {
    // Arrange
    const app = require('../app');
    const mockCallback = jest.fn();

    // Act
    await app.init(mockCallback);

    // Assert
    expect(mockSetupExpress).toBeCalled();
    expect(mockMongoose.connect).toBeCalled();
    expect(mockCallback).toBeCalled();
  });

  test('init - with no callback', async () => {
    // Arrange
    const app = require('../app');

    // Act
    await app.init();

    // Assert
    expect(mockSetupExpress).toBeCalled();
    expect(mockMongoose.connect).toBeCalled();
  });
});
