/* global describe, it */
/* jslint node: true, esnext: true */

"use strict";

const fs = require('fs'),
	path = require('path'),
	events = require('events'),
	scopeReporter = require('scope-reporter'),
	uti = require('uti'),
	chai = require('chai'),
	assert = chai.assert,
	expect = chai.expect,
	should = chai.should(),
	streamEqual = require('stream-equal'),
	tmp = require('tmp'),
	kronosStep = require('kronos-step');

const inFileName = path.join(__dirname, 'fixtures', 'file1.txt');

const sr = scopeReporter.createReporter(kronosStep.ScopeDefinitions);

const manager = Object.create(new events.EventEmitter(), {
	stepImplementations: {
		value: {
			"kronos-file": kronosStep.prepareStepForRegistration(require('../lib/steps/file'))
		}
	},
	uti: {
		getUTIsForFileName(file) {
			return ['public.plain-text'];
		}
	}
});

function makeEqualizer(done) {
	return function equalizer(err, equal) {
		assert(equal, "stream is equal to file content");
		done();
	};
}

describe('file', function () {
	uti.initialize();

	const fileStep = kronosStep.createStep(manager, sr, {
		name: "myStep",
		type: "kronos-file",
		fileName: inFileName,
		endpoints: {
			"inout": kronosStep.createEndpoint('test', {
				direction: "out"
			})
		}
	});

	const testEndpoint = kronosStep.createEndpoint('test', {
		direction: "in"
	});

	describe('start', function () {
		it("should produce a request", function (done) {

			let request;
			testEndpoint.receive(function* () {
				while (true) {
					request = yield;
				};
			});
			fileStep.endpoints.inout.setTarget(testEndpoint);

			fileStep.start().then(function (step) {
				try {
					assert.equal(fileStep.state, 'running');
					assert.equal(request.info.name, inFileName);
					streamEqual(request.stream, fs.createReadStream(inFileName), makeEqualizer(done));
				} catch (e) {
					done(e);
				}
			}, done);
		});
	});

	/*
		describe('out', function () {
			describe('active', function () {
				tmp.file(function (err, outFileName) {
					const endpoint = kronosStep.createEndpoint('e1', {
						target: "file:" + outFileName,
						direction: 'out(passive)'
					}, file);

					let out = endpoint.initialize(manager);

					const myStream = fs.createReadStream(inFileName);
					out.next({
						info: {
							name: "aName"
						},
						stream: myStream
					});

					myStream.on('end', function () {
						streamEqual(fs.createReadStream(outFileName), fs.createReadStream(inFileName), makeEqualizer(done));
					});
				});
			});

			describe('passive', function () {
				it("should consume a request", function (done) {

					tmp.file(function (err, outFileName) {
						const endpoint = kronosStep.createEndpoint('e1', {
							target: "file:" + outFileName,
							direction: 'out(passive)'
						}, file);

						let myStream;
						let out = endpoint.initialize(manager, function* () {
							myStream = fs.createReadStream(inFileName);
							yield {
								info: {
									name: "aName"
								},
								stream: myStream
							};
						});

						myStream.on('end', function () {
							streamEqual(fs.createReadStream(outFileName), fs.createReadStream(inFileName), makeEqualizer(done));
						});
					});
				});
			});
		});
		*/
});
