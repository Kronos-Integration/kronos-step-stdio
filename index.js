/* jslint node: true, esnext: true */


"use strict";

exports.registerWithManager = function (manager) {
  manager.registerStepImplementation(require('./lib/steps/system'));
  manager.registerStepImplementation(require('./lib/steps/file'));
  manager.registerStepImplementation(require('./lib/steps/copy'));
  manager.registerStepImplementation(require('./lib/steps/stdin'));
  manager.registerStepImplementation(require('./lib/steps/stdout'));
  manager.registerStepImplementation(require('./lib/steps/stderr'));
};
