/* jslint node: true, esnext: true */

"use strict";

const child_process = require('child_process');

module.exports = {
	"name": "kronos-system",
	"description": "Starts a child process",
	"config": {
		"command": {
			"description": "command to execute",
			"type": "string"
		}
	},
	"endpoints": {
		"action": {
			"direction": "in(active,passive)"
		},
		"stdout": {
			"direction": "out(active)",
			"mandatory": false
		},
		"stderr": {
			"direction": "out(active)",
			"mandatory": false
		}
	},
	initialize(manager, step) {
		const endpoints = step.endpoints;
		const input = endpoints.in.initialize(manager);
		const stdout = endpoints.stdout.initialize(manager);
		const stderr = endpoints.stderr.initialize(manager);

		for (let request of input) {
			const command = step.config.command;

			const child = child_process.spawn(command, {
				stdio: ['pipe', 'pipe', 'pipe']
			});

			stdout.next({
				info: {},
				stream: child.stdout
			});
			stderr.next({
				info: {},
				stream: child.stderr
			});
		}
	}
};
