'use strict';

const _ = require('lodash');
const nodeAcl = require('acl');
const HttpError = require('http-errors');
const path = require('path');

const acl = new nodeAcl(new nodeAcl.memoryBackend());

const audit = require(path.resolve('./src/core/audit.js'));

class BasePolicy {
  constructor(rules) {
    acl.allow(rules);

    this.resolvers = {};

    _.bindAll(this, 'isAllowed');
  }

  registerResolver(role, resolver) {
    this.resolvers[role] = resolver;
  }

  resolveRoles(req) {
    return _(this.resolvers)
      .pickBy(f => f(req))
      .keys()
      .value();
  }

  isAllowed(req, res, next) {
    audit.log(audit.operations.CHECK_ALLOWED, req, null, { path: req.route.path });
    if (!req.user) {
      audit.log(audit.operations.ACCESS_DENIED, req, null, { path: req.route.path });
      return next(new HttpError.Unauthorized());
    }
    const { user } = req;
    const routePath = req.route.path;
    const method = req.method.toLowerCase();

    // eslint-disable-next-line prefer-spread
    user.roles.push.apply(user.roles, this.resolveRoles(req));

    acl.areAnyRolesAllowed(user.roles, routePath, method, (err, isAllowed) => {
      if (err) {
        return next(new HttpError());
      }

      if (!isAllowed) {
        audit.log(audit.operations.ACCESS_DENIED, req, user, { path });
        return next(new HttpError.Forbidden());
      }
      next();
    });
  }
}

module.exports = BasePolicy;
