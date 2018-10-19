'use strict';

const path = require('path');
const acl = require('./health.acl.json');

const Policy = require(path.resolve('./src/core/policies/core.policies'));
const policy = new Policy(acl);

module.exports = policy;
