/* jslint node: true, esnext: true */

"use strict";

exports.registerWithManager = function (manager) {
  manager.registerEndpointScheme("file", require('./lib/endpoints/file'));
  manager.registerEndpointScheme("http", require('./lib/endpoints/http'));

  const stdio = require('./lib/endpoints/stdio');
  manager.registerEndpointScheme("stdin", stdio.stdin);
  manager.registerEndpointScheme("stdout", stdio.stdout);
  manager.registerEndpointScheme("stderr", stdio.stderr);

  manager.registerStepImplementation('kronos-copy', require('./lib/steps/copy'));
};
