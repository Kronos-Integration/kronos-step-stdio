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
			"in": true
		},
		"stdin": {
			"in": true,
			"mandatory": false
		},
		"stdout": {
			"out": true,
			"mandatory": false
		},
		"stderr": {
			"out": true,
			"mandatory": false
		}
	},
	_initialize(manager, scopeReporter, name, stepConfiguration, endpoints, properties) {

		properties._start = {
			value: function () {
				const step = this;

				let command = stepConfiguration.command;
				let args = [];
				let stdinRequest;
				let child;
				let options = {};

				if (stepConfiguration.env) {
					options.env = stepDefinition.env;
				}

				if (stepConfiguration.arguments) {
					args = stepDefinition.arguments;
				}

				endpoints.action.receive(function* () {
					while (step.isRunning) {
						const request = yield;

						options.stdio = [endpoints.stdin ? 'pipe' : 'ignore',
							endpoints.stdout ? 'pipe' : 'ignore',
							endpoints.stderr ? 'pipe' : 'ignore'
						];

						child = child_process.spawn(command, args, options);

						if (endpoints.stdin) {
							endpoints.stdin.receive(function* () {
								stdinRequest = yield;
								stdinRequest.stream.pipe(child.stdin);
							});
						}

						if (endpoints.stdout) {
							endpoints.stdout.send({
								info: {
									command: command
								},
								stream: child.stdout
							});
						}

						if (endpoints.stderr) {
							endpoints.stderr.send({
								info: {
									command: command
								},
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
