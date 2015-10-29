/* jslint node: true, esnext: true */

"use strict";

module.exports = {
	"name": "kronos-stdin",
	"description": "reads from stdin",
	"endpoints": {
		"out": {
			"out": true
		}
	},
	initialize(manager, scopeReporter, name, stepConfiguration, endpoints, properties) {
		let currentRequest;

		properties._start = {
			value: function () {
				const step = this;

				endpoints.out.receive(function* () {
					while (step.isRunning) {
						currentRequest = yield;
						process.stdin.pipe(currentRequest.stream);
					}
				});

				return Promise.resolve(this);
			}
		};

		properties._stop = {
			value: function () {
				if (currentRequest) {
					process.stdin.unpipe(currentRequest.stream);
					currentRequest = undefined;
				}
				return Promise.resolve(this);
			}
		};

		return this;
	}
};
