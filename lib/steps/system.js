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
	initialize(manager, sr, stepDefinition, endpoints, properties) {
		properties._start = {
			value: function () {
				const step = this;

				endpoints.in.open(function* () {
					for (let request of input) {
						const command = step.config.command;

						this._child = child_process.spawn(command, {
							stdio: ['pipe', 'pipe', 'pipe']
						});

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
				const step = this;

				if (this._child) {
					this._child.kill();
				}

				return Promise.resolve(step);
			}
		};

	}
};
