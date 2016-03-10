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
  stdinStep = require('../lib/stdin');


let manager;
let stdin;

before(done => {
  ksm.manager({}, [require('../index')]).then(m => {
    stdin = stdinStep.createInstance({
      name: "myStep",
      type: "kronos-stdin"
    }, m);

    const testEndpoint = new endpoint.ReceiveEndpoint('test');

    testEndpoint.receive = request => {
      //console.log(`receive...`);
      return Promise.resolve();
    };

    stdin.endpoints.out.connected = testEndpoint;

    manager = m;
    done();
  });
});

it('stdin', () => {
  describe('static', () =>
    testStep.checkStepStatic(manager, stdin)
  );

  describe('live-cycle', () =>
    testStep.checkStepLivecycle(manager, stdin, (step, state, livecycle, done) =>
      done()
    )
  );

  describe('start', () => {
    it("should produce a request", done => {
      stdin.start().then(step => {
        try {
          assert.equal(step.state, 'running');
          setTimeout(done, 30);
        } catch (e) {
          done(e);
        }
      }, done);
    });
  });
});
