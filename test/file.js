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
	steps: {
		value: {
			"kronos-file": require('../lib/steps/file')
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

	describe('in', function () {
		describe('single file', function () {

			const fileStep = kronosStep.createStep(manager, sr, {
				name: "myStep",
				type: "kronos-file",
				fileName: inFileName,
				endpoints: {
					"inout": kronosStep.createEndpoint('test', {
						direction: "out(active,passive)"
					})
				}
			});

			const testEndpoint = kronosStep.createEndpoint('test', {
				direction: "in(active,passive)"
			});

			describe('start', function () {
				it("should produce a request", function (done) {

					let request;
					testEndpoint.receive(function* () {
						while (true) {
							request = yield;
						};
					});
					fileStep.endpoints.inout.connect(testEndpoint);

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
		});

		describe('out', function (done) {
			tmp.file(function (err, outFileName) {
				//outFileName = "/tmp/out";
				const fileStep = kronosStep.createStep(manager, sr, {
					name: "myStep",
					type: "kronos-file",
					fileName: outFileName,
					endpoints: {
						"inout": kronosStep.createEndpoint('test', {
							direction: "in"
						})
					}
				});
				const testEndpoint = kronosStep.createEndpoint('test', {
					direction: "out(active,passive)"
				});

				testEndpoint.connect(fileStep.endpoints.inout);

				describe('start', function () {
					it(`should create a file ${outFileName}`, function () {
						fileStep.start().then(function (step) {
							try {
								const myStream = fs.createReadStream(inFileName)
								testEndpoint.send({
									info: {
										name: inFileName
									},
									stream: myStream
								});

								assert.equal(fileStep.state, 'running');

								myStream.on('end', function () {
									setTimeout(() =>
										streamEqual(fs.createReadStream(outFileName), fs.createReadStream(inFileName), makeEqualizer(
											() => { /*done();*/ }), 5000));
								});
							} catch (e) {
								done(e);
							}
						}, done);
					});
				});
			});
		});
	});
});
