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
	initialize(manager, scopeReporter, name, conf, properties) {
		let currentRequest;

		properties._start = {
			value: function () {
				this.endpoints.in.receive = request => {
					request.payload.pipe(process.stderr);
					currentRequest = request;
					return Promise.resolve();
				};
				return Promise.resolve();
			}
		};

		properties._stop = {
			value: function () {
				if (currentRequest) {
					currentRequest.payload.unpipe(process.stderr);
					currentRequest = undefined;
				}
				return Promise.resolve();
			}
		};

		return this;
	}
});
