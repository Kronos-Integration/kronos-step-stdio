/* global describe, it */
/* jslint node: true, esnext: true */

"use strict";

const fs = require('fs'),
  path = require('path'),
  chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const kronosStep = require('kronos-step');

const manager = Object.create(new events.EventEmitter(), {
  stepImplementations: {
    value: {
      "kronos-stdin": require('../lib/step/stdin')
    }
  }
});

describe('stdin step', function () {

const aStep = steps.createStep(manager, sr, {
    name: "myStep",
    type: "kronos-stdin",
    endpoints: {
      "out": "s2/in"
    }
  }
});

let in1 = endpoint.initialize(manager);

it("should produce a request", function () {
let gen = in1.next();
let request = gen.value;
assert(request.info.name === 'stdin');
assert(request.stream !== undefined);
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
