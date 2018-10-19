'use strict';

import policy from '../policies/health.policy';
import { tokenAndSamlAuth } from '../../auth/auth.strategy';
import { PATH_V1_HEALTH, PATH_V1_STATUS } from '../../../core/urlPaths';
import ControllerFactory from '../../../core/ControllerFactory';

const healthController = new ControllerFactory().getNewHealthController();

module.exports = function (app) {
  app.route(PATH_V1_HEALTH)
    .get(healthController.healthCheck);

  app.route(PATH_V1_STATUS)
    .all(tokenAndSamlAuth, policy.isAllowed)
    .get(healthController.status);
};
