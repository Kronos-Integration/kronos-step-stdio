/* jslint node: true, esnext: true */

"use strict";

module.exports = Object.assign({}, require('kronos-step').Step, {
	"name": "kronos-copy",
	"description": "Copies incoming (in) requests into output (out)",
	"endpoints": {
		"in": {
			"in": true
		},
		"out": {
			"out": true
		}
	},
	initialize(manager, scopeReporter, name, stepConfiguration, endpoints, properties) {
		properties._start = {
			value: function () {
				const step = this;
				let generatorInitialized = false;

				endpoints.in.receive(function* () {
					while (step.isRunning || generatorInitialized === false) {
						generatorInitialized = true;
						const request = yield;
						endpoints.out.push(request);
					}
				});
				return Promise.resolve(step);
			}
		};

		return this;
	}
});
