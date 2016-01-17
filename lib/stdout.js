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
	initialize(manager, scopeReporter, name, conf, properties) {
		let currentRequest;

		properties._start = {
			value: function () {
				this.endpoints.in.receive = request => {
					currentRequest = request;
					currentRequest.payload.pipe(process.stdout);
					return Promise.resolve();
				};
				return Promise.resolve();
			}
		};

		properties._stop = {
			value: function () {
				if (currentRequest) {
					currentRequest.payload.unpipe(process.stdout);
					currentRequest = undefined;
				}
				return Promise.resolve();
			}
		};

		return this;
	}
});
