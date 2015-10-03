/* jslint node: true, esnext: true */

"use strict";

module.exports = {
	"name": "kronos-copy",
	"description": "Copies incoming (in) requests into output (out)",
	"endpoints": {
		"in": {
			"direction": "in(active)"
		},
		"out": {
			"direction": "out(passive)"
		}
	},
	initialize(manager, sr, stepDefinition, endpoints, properties) {
		properties._start = {
			value: function () {
				const step = this;

				endpoints.in.pull(function* () {
					do {
						const request = yield;
						//process.stdin.pipe(request.stream);
					} while (step.state === 'running');
				});
				return Promise.resolve(step);
			}
		};
	}
};
