/* jslint node: true, esnext: true */

"use strict";

module.exports = {
	"name": "kronos-stderr",
	"description": "writes to stderr",
	"endpoints": {
		"in": {
			"direction": "in(passive)"
		}
	},
	initialize(manager, sr, stepDefinition, endpoints, properties) {
		let currentRequest;

		properties._start = {
			value: function () {
				const step = this;

				endpoints.in.receive(function* () {
					do {
						currentRequest = yield;
						currentRequest.stream.pipe(process.stderr);
					} while (step.state === 'running' || step.state === 'starting');
					currentRequest = undefined;
				});
				return Promise.resolve(step);
			}
		};

		properties._stop = {
			value: function () {
				if (currentRequest) {
					currentRequest.stream.unpipe(process.stderr);
				}
				return Promise.resolve(this);
			}
		};

		return this;
	}
};
