const tracer = require('dd-trace');

tracer.init({
  analytics: true,
  env: process.env.NODE_ENV,
});

module.exports = tracer;
