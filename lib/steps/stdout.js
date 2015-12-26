/* jslint node: true, esnext: true */

"use strict";

module.exports = Object.assign({}, require('kronos-step').Step, {
	"name": "kronos-stdout",
	"description": "writes to stdout",
	"endpoints": {
		"in": {
			"in": true
		}
	},
	initialize(manager, scopeReporter, name, stepConfiguration, endpoints, properties) {
		let currentRequest;

		properties._start = {
			value: function () {
				const step = this;

				let generatorInitialized = false;
				endpoints.in.receive(function* () {
					while (step.isRunning || generatorInitialized === false) {
						generatorInitialized = true;
						currentRequest = yield;
						currentRequest.stream.pipe(process.stdout);
					}
					currentRequest = undefined;
				});
				return Promise.resolve(step);
			}
		};

		properties._stop = {
			value: function () {
				if (currentRequest) {
					currentRequest.stream.unpipe(process.stdout);
					currentRequest = undefined;
				}
				return Promise.resolve(this);
			}
		};

		return this;
	}
});
