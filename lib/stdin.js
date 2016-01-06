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
	initialize(manager, scopeReporter, name, conf, properties) {
		let currentResponse;

		properties._start = {
			value: function () {
				currentResponse = this.interceptedEndpoints.out.send({
					stream: process.stdin
				});
				return Promise.resolve(this);
			}
		};

		properties._stop = {
			value: function () {
				//currentResponse.reject();
				return Promise.resolve(this);
			}
		};

		return this;
	}
});
