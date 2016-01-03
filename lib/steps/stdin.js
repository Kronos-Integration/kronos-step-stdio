/* jslint node: true, esnext: true */

"use strict";

module.exports = Object.assign({}, require('kronos-step').Step, {
	"name": "kronos-stdin",
	"description": "reads from stdin",
	"endpoints": {
		"out": {
			"out": true
		}
	},
	initialize(manager, scopeReporter, name, stepConfiguration, properties) {
		let currentRequest;

		properties._start = {
			value: function () {
				this.endpoints.out.receive = request => {
					currentRequest = request;
					process.stdin.pipe(currentRequest.stream);
				};

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
});
