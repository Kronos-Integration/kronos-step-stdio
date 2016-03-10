/* global describe, it, before */
/* jslint node: true, esnext: true */

"use strict";

const fs = require('fs'),
  path = require('path'),
  chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  testStep = require('kronos-test-step'),
  ksm = require('kronos-service-manager'),
  endpoint = require('kronos-endpoint'),
  stdoutStep = require('../lib/stdout'),
  stderrStep = require('../lib/stderr');


let manager;

before(done => {
  ksm.manager({}, [require('../index')]).then(m => {
    manager = m;
    done();
  });
});


it('stdout', () => {
  test("stdout", stdoutStep.createInstance({
    name: "myStep",
    type: "kronos-stdout"
  }, manager));
});

it('stderr', () => {
  test("stderr", stderrStep.createInstance({
    name: "myStep",
    type: "kronos-stderr"
  }, manager));
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
