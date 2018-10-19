import chai from 'chai';

describe('logger', () => {
  const expectedLogger = {};
  const mockWinston = {
    createLogger: jest.fn(() => expectedLogger),
    format: {
      timestamp: jest.fn(),
      combine: jest.fn(),
      json: jest.fn(),
    },
    transports: {
      Console: class Console {},
    },
  };

  beforeEach(() => {
    jest.mock('winston', () => mockWinston);
  });

  afterEach(() => {
    jest.resetModules();
    mockWinston.createLogger.mockClear();
  });

  test('setup', () => {
    // Arrange
    const logger = require('../logger');

    // Act
    const actualLogger = logger.setup();

    // Assert
    expect(mockWinston.createLogger).toHaveBeenCalled();
    expect(mockWinston.format.timestamp).toHaveBeenCalled();
    expect(mockWinston.format.json).toHaveBeenCalled();
    expect(mockWinston.format.combine).toHaveBeenCalled();
    chai.expect(actualLogger).to.equal(expectedLogger);
  });

  test('default - first time', () => {
    // Arrange

    // Act
    const logger = require('../logger');

    // Assert
    chai.expect(logger.default).to.equal(expectedLogger);
    expect(mockWinston.createLogger).toBeCalled();
  });

  test('default - second time', () => {
    // Arrange
    let logger = require('../logger');

    // Act
    logger = require('../logger');

    // Assert
    chai.expect(logger.default).to.equal(expectedLogger);
    expect(mockWinston.createLogger).toHaveBeenCalledTimes(1);
  });
});
