describe('saml.config', () => {
  test('samlConfig', () => {
    // Arrange
    const expectedSamlStrategy = {};

    const mockPassport = {
      use: jest.fn(),
    };
    jest.mock('passport', () => mockPassport);
    const expectedOktaIdp = {
      strategyName: 'okta',
      cert: '',
      entryPoint: '',
      issuer: 'twiage',
    };
    const expectedImprivataIdp = {
      strategyName: 'imprivata',
      cert: '',
      entryPoint: '',
      issuer: 'twiage',
    };
    const expectedIdpsList = [expectedOktaIdp, expectedImprivataIdp];
    const mockIdp = {
      idpList: expectedIdpsList,
    };

    const expectedBaseUrl = 'https://localhost:3000';
    const mockConfig = { baseUrl: expectedBaseUrl };

    jest.mock('../../../config/config', () => mockConfig);
    jest.mock('../idp.list', () => mockIdp);
    const mockSamlConfig = require('../saml.config');

    mockSamlConfig.getSamlStrategy = jest.fn(() => expectedSamlStrategy);

    // Act
    mockSamlConfig.default();

    // Assert
    expect(mockSamlConfig.getSamlStrategy.mock.calls[0][0]).toBe(expectedOktaIdp);
    expect(mockSamlConfig.getSamlStrategy.mock.calls[1][0]).toBe(expectedImprivataIdp);
    expect(mockPassport.use.mock.calls[0][0]).toBe(expectedOktaIdp.strategyName);
    expect(mockPassport.use.mock.calls[1][0]).toBe(expectedImprivataIdp.strategyName);
    expect(mockPassport.use.mock.calls.length).toBe(2);
  });
});
