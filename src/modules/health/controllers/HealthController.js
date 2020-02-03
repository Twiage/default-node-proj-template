import os from 'os';
import { version } from '../../../../package.json';

export const HEALTHY_RESPONSE_BODY = {
  healthy: true,
  version,
};

export const STATUS_RESPONSE_BODY = { networkInterfaces: os.networkInterfaces() };

export default class HealthController {
  healthCheck(req, res) {
    res.json(HEALTHY_RESPONSE_BODY);
  }

  status(req, res) {
    res.json(STATUS_RESPONSE_BODY);
  }
}
