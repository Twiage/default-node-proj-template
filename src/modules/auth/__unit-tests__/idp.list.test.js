describe('idp.list', () => {
  let idpList;
  let originalGetIssuers;
  const mockConfig = { sso: { okta: {}, adventist: {} } };

  beforeEach(() => {
    jest.mock('../../../config/config', () => mockConfig);
    jest.mock('xml2js');
    idpList = require('../idp.list');
    originalGetIssuers = idpList.getIssuers;
  });

  afterEach(() => {
    idpList.getIssuers = originalGetIssuers;
  });

  test('getStrategyNameFromEmail', () => {
    // Arrange
    const expectedUsername = 'username@okta.com';
    const expectedStrategyName = 'okta';
    // Act
    const actualStrategyName = idpList.getStrategyNameFromEmail(expectedUsername);
    // Assert
    expect(actualStrategyName).toEqual(expectedStrategyName);
  });

  test('getSamlStrategyNames', () => {
    const expectedStrategyTest = 'test';
    const expectedStrategyIdp = 'idp';
    const expectedStrategyNames = [expectedStrategyTest, expectedStrategyIdp];
    idpList.idpList = [{ strategyName: expectedStrategyTest }, { strategyName: expectedStrategyIdp }];
    // Act
    const actualStrategyNames = idpList.getSamlStrategyNames();
    // Assert
    expect(actualStrategyNames).toEqual(expectedStrategyNames);
  });

  test('getSamlStrategyNameFromRequest, with issuers', async () => {
    const expectedStrategyName = 'adventist';
    const expectedIssuer = 'https://login.ahss.org/SecureAuth/';
    const expectedRequest = { body: {} };
    const expectedIssuers = [expectedIssuer];
    idpList.getIssuers = () => new Promise(resolve => resolve(expectedIssuers));

    // Act
    const actualStrategyName = await idpList.getSamlStrategyNameFromRequest(expectedRequest);

    // Assert
    expect(actualStrategyName).toEqual(expectedStrategyName);
  });

  test('getSamlStrategyNameFromRequest - with no issuers', async () => {
    const expectedStrategyName = null;
    const expectedRequest = { body: {} };
    const expectedIssuers = [];
    idpList.getIssuers = () => new Promise(resolve => resolve(expectedIssuers));

    // Act
    const actualStrategyName = await idpList.getSamlStrategyNameFromRequest(expectedRequest);

    // Assert
    expect(actualStrategyName).toEqual(expectedStrategyName);
  });

  test('getIssuers - saml', async () => {
    // Arrange
    const expectedIssuer = 'https://login.ahss.org/SecureAuth/';
    const expectedSamlResponse = 'expectedSamlResponse';

    const expectedIssuers = [expectedIssuer];
    const expectedXmlObject = {
      'samlp:Response': {
        'saml:Assertion': [{
          'saml:Issuer': expectedIssuers,
        }],
      },
    };
    const expectedXmlParser = {
      parseString: (xmlString, callback) => callback(null, expectedXmlObject),
    };
    idpList.getXmlParser = () => expectedXmlParser;

    // Act
    const actualIssuers = await idpList.getIssuers(expectedSamlResponse);

    // Assert
    expect(actualIssuers).toBe(expectedIssuers);
  });

  test('getIssuers - saml2', async () => {
    const expectedIssuer = 'https://login.ahss.org/SecureAuth/';
    const expectedSamlResponse = 'expectedSamlResponse';

    const expectedIssuers = [expectedIssuer];
    const expectedXmlObject = {
      'saml2p:Response': {
        'saml2:Assertion': [{
          'saml2:Issuer': expectedIssuers,
        }],
      },
    };
    const expectedXmlParser = {
      parseString: (xmlString, callback) => callback(null, expectedXmlObject),
    };
    idpList.getXmlParser = () => expectedXmlParser;

    // Act
    const actualIssuers = await idpList.getIssuers(expectedSamlResponse);

    // Assert
    expect(actualIssuers).toBe(expectedIssuers);
  });
});
