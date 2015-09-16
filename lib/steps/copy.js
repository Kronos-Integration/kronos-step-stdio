/* jslint node: true, esnext: true */

"use strict";

module.exports = {
	"name": "kronos-copy",
	"description": "Copies incoming (in) requests into output (out)",
	"endpoints": {
		"in": {
			"direction": "in(active,passive)" // not(endpoint(out(passive)))
		},
		"out": {
			"direction": "out(active,passive)"
		}
	},
	initialize(manager, step) {
		const endpoints = step.endpoints;

		if (endpoints.in.canBePassive) {
			if (endpoints.out.canBeActive) {
				const ouput = endpoints.out.initialize(manager);
				endpoints.in.initialize(manager, function* () {
					ouput.next(yield);
				});
			} else {
				throw (new Error(`Unsupported direction combination ${endpoints.in.direction} ${endpoints.out.direction}`));
			}
		}

		const input = endpoints.in.initialize(manager);

		if (endpoints.out.canBePassive) {
			endpoints.out.initialize(manager, function* () {
				yield * input;
			});
		} else {
			const ouput = endpoints.out.initialize(manager);
			for (let request of input) {
				ouput.next(request);
			}
		}
	}
};
