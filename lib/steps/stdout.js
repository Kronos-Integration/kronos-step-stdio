/* jslint node: true, esnext: true */

"use strict";

module.exports = {
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
