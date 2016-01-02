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
	initialize(manager, scopeReporter, name, stepConfiguration, properties) {
		let currentRequest;

		properties._start = {
			value: function () {
				endpoints.in.receive = request => {
					request.stream.pipe(process.stderr);
					currentRequest = request;
				};
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
