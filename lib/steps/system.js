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
		"stdin": {
			"direction": "in(active)",
			"mandatory": false
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
	initialize(manager, sr, stepDefinition, endpoints, properties) {
		properties._start = {
			value: function () {
				const step = this;

				const command = step.command;
				let stdinRequest;
				let child;

				endpoints.action.receive(function* () {
					while (step.isRunning) {
						const request = yield;

						child = child_process.spawn(command, {
							stdio: ['pipe', 'pipe', 'pipe']
						});

						if (endpoints.stdin) {
							endpoints.stdin.receive(function* () {
								stdinRequest = yield;
								stdinRequest.stream.pipe(child.stdin);
							});
						}

						if (endpoints.stdout) {
							endpoints.stdout.send({
								info: {},
								stream: child.stdout
							});
						}

						if (endpoints.stderr) {
							endpoints.stderr.send({
								info: {},
								stream: child.stderr
							});
						}
					}
				});

				return Promise.resolve(step);
			}
		};

		properties._stop = {
			value: function () {
				if (child) {
					if (stdinRequest) {
						stdinRequest.stream.unpipe(child.stdin);
						stdinRequest = undefined;
					}

					child.kill();
					child = undefined;
				}

				return Promise.resolve(this);
			}
		};

		return this;
	}
};
