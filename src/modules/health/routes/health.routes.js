'use strict';

import policy from '../policies/health.policy';
import { jwtAuth } from '../../auth/auth.strategy';
import { PATH_HEALTH, PATH_STATUS } from '../../../core/urlPaths';
import ControllerFactory from '../../../core/ControllerFactory';

const healthController = new ControllerFactory().getNewHealthController();

module.exports = function (app) {
  app.route(PATH_HEALTH)
    .get(healthController.healthCheck);

  app.route(PATH_STATUS)
    .all(jwtAuth, policy.isAllowed)
    .get(healthController.status);
};
