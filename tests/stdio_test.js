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

          setTimeout(() => done(), 50);
        } catch (e) {
          done(e);
        }
      }, done);
    });
  });

  /*
  describe('stdout endpoint', function () {
    const endpoint = kronosStep.createEndpoint('e1', {
      target: "stdout"
    }, kronosStep.createEndpoint('stout',require('../lib/endpoints/stdio').stdout));

    describe('with generator arg', function () {
      it("should consume a request", function () {
        let out = endpoint.initialize(manager, function* () {
          const fileName = path.join(__dirname, 'fixtures', 'file1.txt');
          yield {
            info: {
              name: "aName"
            },
            stream: fs.createReadStream(fileName)
          };
        });
      });
    });

    describe('without generator arg', function () {
      let out = endpoint.initialize(manager);

      it("should consume a request", function () {
        const fileName = path.join(__dirname, 'fixtures', 'file1.txt');

        out.next({
          info: {
            name: "aName"
          },
          stream: fs.createReadStream(fileName)
        });
      });
    });
    */
});
