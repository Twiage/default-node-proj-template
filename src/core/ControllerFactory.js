import HealthController from '../modules/health/controllers/HealthController';

export default class ControllerFactory {
  getNewHealthController() {
    return new HealthController();
  }
}