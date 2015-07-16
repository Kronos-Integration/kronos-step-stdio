/* global describe, it */
/* jslint node: true, esnext: true */

"use strict";

const fs = require('fs');
const path = require('path');
const uti = require('uti');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const streamEqual = require('stream-equal');
const tmp = require('tmp');
const kronosStep = require('kronos-step');

const inFileName = path.join(__dirname, 'fixtures', 'file1.txt');

const manager = {
	uti: {
		getUTIsForFileName(file) {
			return ['public.plain-text'];
		}
	}
};

function makeEqualizer(done) {
	return function equalizer(err, equal) {
		assert(equal, "stream is equal to file content");
		done();
	};
}

describe('file endpoint', function () {
	uti.initialize();

	const file = kronosStep.createEndpoint('file', require('../lib/endpoints/file'));

	describe('in', function () {
		describe('active', function () {
			const endpoint = kronosStep.createEndpoint('e1', {
				target: "file:" + inFileName,
				direction: 'in(active)'
			}, file);

			it("should have an implementation", function () {
				assert(endpoint.implementation === file.implementation, "file endpoint implementation");
			});

			it("should have a request", function (done) {
				let number = 0;

				for (let request of endpoint.initialize(manager)) {
					number++;
					assert(request.info.name === inFileName, "file name is " + inFileName);

					//console.log(`*** UTI ${request.info.uti}`);
					//	assert(request.info.uti.toString() === 'public.plain-text');

					streamEqual(request.stream, fs.createReadStream(inFileName), makeEqualizer(done));
				}
				assert(number === 1, "exactly one request");
			});
		});

		describe('passive', function () {
			const endpoint = kronosStep.createEndpoint('e1', {
				target: "file:" + inFileName,
				direction: 'in(passive)'
			}, file);

			it("should have a request", function (done) {
				let ep = endpoint.initialize(manager, function* () {
					const request = yield;
					assert(request.info.name === inFileName, "file name is " + inFileName);
					streamEqual(request.stream, fs.createReadStream(inFileName), makeEqualizer(done));
				});
			});
		});
	});

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
});
