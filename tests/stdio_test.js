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
  stdinStep = require('../lib/steps/stdin');

const manager = testStep.managerMock;

require('../index').registerWithManager(manager);

describe('stdin', function () {
  const stdin = stdinStep.createInstance(manager, undefined, {
    name: "myStep",
    type: "kronos-stdin"
  });

  const testEndpoint = new endpoint.ReceiveEndpoint('test');

  testEndpoint.receive = request => {
    console.log(`receive...`);
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
          //console.log(`STEP ${JSON.stringify(step)}`);
          assert.equal(step.state, 'running');

          setTimeout(() => done(), 30);
        } catch (e) {
          done(e);
        }
      }, done);
    });
  });
});

describe('stdout', function () {
  const stdout = stdinStep.createInstance(manager, undefined, {
    name: "myStep",
    type: "kronos-stdout"
  });

  const testEndpoint = new endpoint.SendEndpoint('test', {get name() {
      return "Test"
    },
    toString() {
      return this.name;
    }
  });

  testEndpoint.connected = stdout.endpoints.in;

  describe('static', function () {
    testStep.checkStepStatic(manager, stdout);
  });

  describe('live-cycle', function () {
    testStep.checkStepLivecycle(manager, stdout, function (step, state, livecycle, done) {
      /*if (state === 'running') {
        const fileName = path.join(__dirname, 'fixtures', 'file1.txt');
        testEndpoint.send({
          stream: fs.createReadStream(fileName)
        });
      }*/
      done();
    });
  });
});

describe('stderr', function () {
  const stderr = stdinStep.createInstance(manager, undefined, {
    name: "myStep",
    type: "kronos-stderr"
  });

  const testEndpoint = new endpoint.SendEndpoint('test', {get name() {
      return "Test"
    },
    toString() {
      return this.name;
    }
  });

  testEndpoint.connected = stderr.endpoints.in;

  describe('static', function () {
    testStep.checkStepStatic(manager, stderr);
  });

  describe('live-cycle', function () {
    testStep.checkStepLivecycle(manager, stderr, function (step, state, livecycle, done) {
      /*    if (state === 'running') {
            const fileName = path.join(__dirname, 'fixtures', 'file1.txt');
            testEndpoint.send({
              stream: fs.createReadStream(fileName)
            });
          }*/
      done();
    });
  });
});
