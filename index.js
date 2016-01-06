/* jslint node: true, esnext: true */


"use strict";

exports.registerWithManager = function (manager) {
  manager.registerStep(require('./lib/stdin'));
  manager.registerStep(require('./lib/stdout'));
  manager.registerStep(require('./lib/stderr'));
};
