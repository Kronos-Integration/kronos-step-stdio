exports.registerWithManager = function (manager) {
  try {
    manager.registerEndpointScheme("file", require('./lib/endpoints/file'));
    manager.registerEndpointScheme("http", require('./lib/endpoints/http'));

    const stdio = require('./lib/endpoints/stdio');
    manager.registerEndpointScheme("stdin", stdio.stdin);
    manager.registerEndpointScheme("stdout", stdio.stdout);
    manager.registerEndpointScheme("stderr", stdio.stderr);

    manager.registerStepImplementation('kronos-copy', require('./lib/steps/copy'));
    manager.registerStepImplementation('kronos-flow-control', require('./lib/steps/flow_control'));
    manager.registerStepImplementation('kronos-group', require('./lib/steps/group'));
  } catch (e) {
    console.log(e);
  }
};
