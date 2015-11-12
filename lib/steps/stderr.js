/* jslint node: true, esnext: true */

"use strict";

module.exports = Object.assign({}, require('kronos-step').Step, {
	"name": "kronos-stderr",
	"description": "writes to stderr",
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

				endpoints.in.receive(function* () {
					while (step.isRunning) {
						currentRequest = yield;
						currentRequest.stream.pipe(process.stderr);
					}
				});
				return Promise.resolve(step);
			}
		};

		properties._stop = {
			value: function () {
				if (currentRequest) {
					currentRequest.stream.unpipe(process.stderr);
					currentRequest = undefined;
				}
				return Promise.resolve(this);
			}
		};

		return this;
	}
});
