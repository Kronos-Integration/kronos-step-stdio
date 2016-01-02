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
	initialize(manager, scopeReporter, name, stepConfiguration, properties) {
		let currentRequest;

		properties._start = {
			value: function () {
				endpoints.in.receive = request => {
					currentRequest = request;
					currentRequest.stream.pipe(process.stdout);
				};
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
