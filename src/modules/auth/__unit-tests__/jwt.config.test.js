import { Strategy } from 'passport-jwt';

describe('jwt.config', () => {
  const mockConfig = { jwt: {} };

  beforeEach(() => {
    jest.mock('../../../config/config', () => mockConfig);
    jest.resetModules();
  });

  test('.useJwtStrategy', () => {
    // Arrange
    const expectedJwtStrategy = {};
    const expectedExtractor = () => {};
    const expectedFinalSecretOrKey = '-----BEGIN PUBLIC KEY-----\\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA5lKjF+dW70hwPTtaShfT\\n/5i99voczAc8Adwqdzyw8tySzW/oEWr/rDGK01sKE/sp0hdKMFRr0P6x1V4iVn67\\nkjBoctZZYd+ul8w3RTl34GBpWOHGVn5MN6vJbH8O+hnPmEDHOLjbN/zqeLa3I9aI\\nR83iHGv/CjvvkZkVe59wUKXOzMklxDNGjJh0VNjDu4nwPSUhcbmJflQDPOvNcUHZ\\nfvIn6z2zTIJl1ZuxLE67m26b8iL77GVwgMitFgWMpIAtnSuB1HT9ruRrQ8GSF7ZS\\ndAMJBT9ue6KaaOsL5mkuICEDmdDkF6VjjL1BD0M9oGiIq3NRWiZnKjQ+GvC+oIXH\\nU/eaS/f7OWZ8zxwaEUvll9BajP7rOqcX3qC9tBXMNvX35VV4qzdrg2vnefc2pWzY\\n/CjsF3kNpam5CZI2jood8RI2iXHA4knGydcpQ1+Jr1RpOmY7a2VDk8+N4XPkLgXF\\nL6hadTND4kex5ZwcahI91JlZCgqcCheF5+V/DwEO23PN8Gc3qWrX+I5mfy0PTL5S\\nHTlqZa0Hd+6zxcdSV39CqAUcH7Y+OvM6NDLz9Xnp6zmvVA4/6SoQnYIdfAmP/nxE\\nWH3YBHziaftZN+Fad+eoIWfKefnzXEl/Z8EPzFTOXDKJMSjYWQWXOSWxX28aAVsV\\nPQmMjbO9FP4WSBR6FBg/4HsCAwEAAQ==\\n-----END PUBLIC KEY-----';
    const mockPassportJwt = {
      ExtractJwt: { fromAuthHeaderWithScheme: jest.fn(() => expectedExtractor) },
      Strategy,
    };
    const mockPassport = { use: jest.fn() };
    const mockUserDAO = { getUserByEmail: jest.fn(() => {}) };
    jest.mock('../users.dao', () => mockUserDAO);
    jest.mock('passport-jwt', () => mockPassportJwt);
    jest.mock('passport', () => mockPassport);


    const jwtConfig = require('../jwt.config');
    jwtConfig.getJwtStrategy = jest.fn(() => expectedJwtStrategy);
    jwtConfig.jwtOptions.secretOrKey = expectedFinalSecretOrKey;

    // Act
    jwtConfig.useJwtStrategy();

    // Assert
    expect(mockPassportJwt.ExtractJwt.fromAuthHeaderWithScheme).toHaveBeenCalledWith(jwtConfig.AUTH_HEADER_SCHEME);
    expect(jwtConfig.jwtOptions.jwtFromRequest).toEqual(expectedExtractor);
    expect(jwtConfig.getJwtStrategy).toHaveBeenCalledWith(jwtConfig.jwtOptions, jwtConfig.verifyCallback);
    expect(mockPassport.use).toHaveBeenCalledWith(expectedJwtStrategy);
    expect(jwtConfig.jwtOptions.secretOrKey).toEqual(expectedFinalSecretOrKey);
  });

  test('Verify Callback', async () => {
    // Arrange
    const expectedEmail = 'fass@fsf.com';
    const expectedMongooseUser = { id: 1432, email: expectedEmail, username: 'username' };
    const expectedJwtUser = { email: expectedEmail };
    const mockDone = jest.fn();
    const mockUserDAO = { getUserByEmail: jest.fn(() => expectedMongooseUser) };
    jest.mock('../users.dao', () => mockUserDAO);
    const jwtConfig = require('../jwt.config');

    // Act
    await jwtConfig.verifyCallback(expectedJwtUser, mockDone);

    // Assert
    expect(mockUserDAO.getUserByEmail).toHaveBeenCalledWith(expectedJwtUser.email);
    expect(mockDone).toHaveBeenCalledWith(null, expectedMongooseUser);
  });
});
