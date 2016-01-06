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
  stdinStep = require('../lib/stdin');

const manager = testStep.managerMock;

require('../index').registerWithManager(manager);

describe('stdin', function () {
  const stdin = stdinStep.createInstance(manager, undefined, {
    name: "myStep",
    type: "kronos-stdin"
  });

  const testEndpoint = new endpoint.ReceiveEndpoint('test');

  testEndpoint.receive = request => {
    //console.log(`receive...`);
    return Promise.resolve();
  };

  stdin.endpoints.out.connected = testEndpoint;

  describe('static', function () {
    testStep.checkStepStatic(manager, stdin);
  });

  describe('live-cycle', function () {
    testStep.checkStepLivecycle(manager, stdin, function (step, state, livecycle, done) {
      done();
    });
  });

  describe('start', function () {
    it("should produce a request", done => {
      stdin.start().then(step => {
        try {
          assert.equal(step.state, 'running');

          setTimeout(() => done(), 30);
        } catch (e) {
          done(e);
        }
      }, done);
    });
  });
});
