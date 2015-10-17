/* global describe, it */
/* jslint node: true, esnext: true */

"use strict";

const fs = require('fs'),
  path = require('path'),
  events = require('events'),
  scopeReporter = require('scope-reporter'),
  chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const kronosStep = require('kronos-step');

const sr = scopeReporter.createReporter(kronosStep.ScopeDefinitions);

const manager = Object.create(new events.EventEmitter(), {
  steps: {
    value: {
      "kronos-stdin": require('../lib/steps/stdin')
    }
  }
});

describe('stdin', function () {
  const stdin = kronosStep.createStep(manager, sr, {
    name: "myStep",
    type: "kronos-stdin",
    endpoints: {
      "out": kronosStep.createEndpoint('test', {})
    }
  });

  const testEndpoint = kronosStep.createEndpoint('test', {
    direction: "in(active,passive)"
  });

  testEndpoint.receive(function* () {
    console.log(`receive...`);
    while (true) {
      const request = yield;
      //console.log(`got request`);
    };
  });

  stdin.endpoints.out.connect(testEndpoint);

  describe('start', function () {
    it("should produce a request", function (done) {
      stdin.start().then(function (step) {
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
