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

	_start() {
		this.endpoints.out.receive({
			payload: process.stdin
		});
		return Promise.resolve(this);
	}
});
