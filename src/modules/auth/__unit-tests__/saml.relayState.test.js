import { createRequest } from 'node-mocks-http';

describe('saml relayState', () => {
  let relayState;

  beforeEach(() => {
    relayState = require('../saml.relayState');
  });

  it('adds relay state to saml strategy with X-Forwarded-Proto - PUT', () => {
    // Arrange
    const expectedProtocol = 'http';
    const expectedHost = 'api-stage.twiagemed.com';
    const expectedUrl = '/v4/auth/saml/example';
    const expectedMethod = 'PUT';
    const expectedRelayState = 'https://api-stage.twiagemed.com/v4/auth/saml/example';
    const expectedHeaders = {
      'X-Forwarded-Proto': 'https',
    };
    const expectedRequest = createRequest({
      url: expectedUrl,
      protocol: expectedProtocol,
      method: expectedMethod,
      headers: expectedHeaders,
    });
    expectedRequest.get = jest.fn(param => (param === 'host' ? expectedHost : null));
    // Act
    relayState.setRelayState(expectedRequest);

    // Assert
    expect(expectedRequest.body.RelayState).toEqual(expectedRelayState);
  });

  it('adds relay state to saml strategy with X-Forwarded-Proto - PATCH', () => {
    // Arrange
    const expectedProtocol = 'http';
    const expectedHost = 'api-stage.twiagemed.com';
    const expectedUrl = '/v4/auth/saml/example';
    const expectedMethod = 'PATCH';
    const expectedRelayState = 'https://api-stage.twiagemed.com/v4/auth/saml/example';
    const expectedHeaders = {
      'X-Forwarded-Proto': 'https',
    };
    const expectedRequest = createRequest({
      url: expectedUrl,
      protocol: expectedProtocol,
      method: expectedMethod,
      headers: expectedHeaders,
    });
    expectedRequest.get = jest.fn(param => (param === 'host' ? expectedHost : null));
    // Act
    relayState.setRelayState(expectedRequest);

    // Assert
    expect(expectedRequest.body.RelayState).toEqual(expectedRelayState);
  });

  it('adds relay state to saml strategy with X-Forwarded-Proto - DELETE', () => {
    // Arrange
    const expectedProtocol = 'http';
    const expectedHost = 'api-stage.twiagemed.com';
    const expectedUrl = '/v4/auth/saml/example';
    const expectedMethod = 'DELETE';
    const expectedRelayState = 'https://api-stage.twiagemed.com/v4/auth/saml/example';
    const expectedHeaders = {
      'X-Forwarded-Proto': 'https',
    };
    const expectedRequest = createRequest({
      url: expectedUrl,
      protocol: expectedProtocol,
      method: expectedMethod,
      headers: expectedHeaders,
    });
    expectedRequest.get = jest.fn(param => (param === 'host' ? expectedHost : null));

    // Act
    relayState.setRelayState(expectedRequest);

    // Assert
    expect(expectedRequest.body.RelayState).toEqual(expectedRelayState);
  });

  it('adds relay state to saml strategy without X-Forwarded-Proto - POST', () => {
    // Arrange
    const expectedProtocol = 'http';
    const expectedHost = 'api-stage.twiagemed.com';
    const expectedUrl = '/v4/auth/saml/example';
    const expectedRelayState = 'http://api-stage.twiagemed.com/v4/auth/saml/example';

    const expectedRequest = createRequest({
      url: expectedUrl,
      protocol: expectedProtocol,
      method: 'POST',
    });
    expectedRequest.get = jest.fn(param => (param === 'host' ? expectedHost : null));
    // Act
    relayState.setRelayState(expectedRequest);

    // Assert
    expect(expectedRequest.body.RelayState).toEqual(expectedRelayState);
  });

  it('adds relay state to saml strategy without X-Forwarded-Proto - PUT', () => {
    // Arrange
    const expectedProtocol = 'http';
    const expectedHost = 'api-stage.twiagemed.com';
    const expectedUrl = '/v4/auth/saml/example';
    const expectedRelayState = 'http://api-stage.twiagemed.com/v4/auth/saml/example';

    const expectedRequest = createRequest({
      url: expectedUrl,
      protocol: expectedProtocol,
      method: 'PUT',
    });
    expectedRequest.get = jest.fn(param => (param === 'host' ? expectedHost : null));
    // Act
    relayState.setRelayState(expectedRequest);

    // Assert
    expect(expectedRequest.body.RelayState).toEqual(expectedRelayState);
  });

  it('adds relay state to saml strategy - GET', () => {
    // Arrange
    const expectedProtocol = 'http';
    const expectedHost = 'api-stage.twiagemed.com';
    const expectedUrl = '/v4/auth/saml/example';
    const expectedRelayState = 'https://api-stage.twiagemed.com/v4/auth/saml/example';

    const expectedRequest = createRequest({
      url: expectedUrl,
      protocol: expectedProtocol,
      method: 'GET',
      headers: {
        'X-Forwarded-Proto': 'https',
      },
    });
    expectedRequest.get = jest.fn(param => (param === 'host' ? expectedHost : null));

    // Act
    relayState.setRelayState(expectedRequest);

    // Assert
    expect(expectedRequest.query.RelayState).toEqual(expectedRelayState);
  });

  it('get relay state - GET', () => {
    // Arrange
    const expectedRelayState = 'https://api-stage.twiagemed.com/v4/auth/saml/example';
    const expectedRequest = createRequest({
      method: 'GET',
      params: {
        RelayState: expectedRelayState,
      },
    });
    // Act
    const actualRelayState = relayState.getRelayState(expectedRequest);
    // Assert
    expect(actualRelayState).toEqual(expectedRelayState);
  });

  it('get relay state - POST', () => {
    // Arrange
    const expectedRelayState = 'https://api-stage.twiagemed.com/v4/auth/saml/example';
    const expectedRequest = createRequest({
      method: 'POST',
      body: {
        RelayState: expectedRelayState,
      },
    });
    // Act
    const actualRelayState = relayState.getRelayState(expectedRequest);
    // Assert
    expect(actualRelayState).toEqual(expectedRelayState);
  });

  it('get relay state - PUT', () => {
    // Arrange
    const expectedRelayState = 'https://api-stage.twiagemed.com/v4/users/59e65eb46bc689001bccaf2e';
    const expectedRequest = createRequest({
      method: 'PUT',
      body: {
        RelayState: expectedRelayState,
      },
    });
    // Act
    const actualRelayState = relayState.getRelayState(expectedRequest);
    // Assert
    expect(actualRelayState).toEqual(expectedRelayState);
  });

  it('get relay state - PATCH', () => {
    // Arrange
    const expectedRelayState = 'https://api-stage.twiagemed.com/v4/users/59e65eb46bc689001bccaf2e';
    const expectedRequest = createRequest({
      method: 'PATCH',
      body: {
        RelayState: expectedRelayState,
      },
    });

    // Act
    const actualRelayState = relayState.getRelayState(expectedRequest);

    // Assert
    expect(actualRelayState).toEqual(expectedRelayState);
  });

  it('get relay state - DELETE', () => {
    // Arrange
    const expectedRelayState = 'https://api-stage.twiagemed.com/v4/users/59e65eb46bc689001bccaf2e';
    const expectedRequest = createRequest({
      method: 'DELETE',
      body: {
        RelayState: expectedRelayState,
      },
    });

    // Act
    const actualRelayState = relayState.getRelayState(expectedRequest);

    // Assert
    expect(actualRelayState).toEqual(expectedRelayState);
  });
});
