/* jslint node: true, esnext: true */


"use strict";

exports.registerWithManager = function (manager) {
  manager.registerStep(require('./lib/steps/file'));
  manager.registerStep(require('./lib/steps/copy'));
  manager.registerStep(require('./lib/steps/stdin'));
  manager.registerStep(require('./lib/steps/stdout'));
  manager.registerStep(require('./lib/steps/stderr'));
};
