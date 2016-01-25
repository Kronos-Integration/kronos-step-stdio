/* global describe, it */
/* jslint node: true, esnext: true */

"use strict";

const fs = require('fs'),
  path = require('path'),
  chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  testStep = require('kronos-test-step'),
  endpoint = require('kronos-step').endpoint,
  stdoutStep = require('../lib/stdout'),
  stderrStep = require('../lib/stderr');

const manager = testStep.managerMock;

require('../index').registerWithManager(manager);

describe('stdout', () => {
  const step = stdoutStep.createInstance(manager, undefined, {
    name: "myStep",
    type: "kronos-stdout"
  });

  test("stdout", step);
});

describe('stderr', () => {
  const step = stderrStep.createInstance(manager, undefined, {
    name: "myStep",
    type: "kronos-stderr"
  });

  test("stderr", step);
});

function test(name, step) {
  const testEndpoint = new endpoint.SendEndpoint('test', {get name() {
      return "Test";
    },
    toString() {
      return this.name;
    }
  });

  testEndpoint.connected = step.endpoints.in;

  describe('static', () =>
    testStep.checkStepStatic(manager, step)
  );

  describe('live-cycle', () =>
    testStep.checkStepLivecycle(manager, step, (step, state, livecycle, done) =>
      done()
    )
  );
}
