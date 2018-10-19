module.exports = {
  allJS: ['server.js', 'src/config/**/*.js', 'src/modules/*/**/*.js'],
  models: ['src/**/models/**/*.js'],
  routes: ['src/modules/!(core)/routes/**/*.js', 'src/core/routes/**/*.js'],
  config: ['src/modules/*/config/*.js'],
  policies: ['src/modules/*/policies/*.js'],
};
