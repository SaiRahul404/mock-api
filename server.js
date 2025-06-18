const { startEnvironment } = require('@mockoon/cli');

startEnvironment({
  data: require('./mockoon-environment.json'),
  port: process.env.PORT || 3001
});
