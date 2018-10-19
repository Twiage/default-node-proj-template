export const setRelayState = req => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const relayState = `${protocol}://${req.get('host')}${req.url}`;
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
    req.body.RelayState = relayState;
  } else if (req.method === 'GET') {
    req.query.RelayState = relayState;
  }
};

export const getRelayState = req => {
  if (req.method === 'GET') {
    return req.params.RelayState;
  }
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
    return req.body.RelayState;
  }
  return null;
};
