/* jslint node: true, esnext: true */

"use strict";

module.exports = {
	"name": "kronos-stdout",
	"description": "writes to stdout",
	"endpoints": {
		"in": {
			"direction": "in(active)"
		}
	},
	initialize(manager, step) {
		for (let request of endpoints.in.initialize(manager)) {
			request.stream.pipe(process.stdout);
		}
	}
};
