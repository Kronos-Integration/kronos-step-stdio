/* jslint node: true, esnext: true */

"use strict";

const fs = require('fs'),
	uti = require('uti');

module.exports = Object.assign({}, require('kronos-step').Step, {
	name: "kronos-file",
	endpoints: {
		"inout": {
			"in": true,
			"out": true,
			uti: "org.kronos.file"
		}
	},
	initialize(manager, scopeReporter, name, stepConfiguration, endpoints, properties) {
		const fileName = stepConfiguration.fileName;

		let currentRequest, currentStream;

		properties._start = {
			value: function () {
				const step = this;
				const ep = endpoints.inout;

				return new Promise(function (resolve, reject) {
					if (ep.out) {
						fs.stat(fileName, function (err, stat) {
							if (err) {
								reject(err);
							} else {
								stat.name = fileName;
								stat.uti = uti.getUTIsForFileName(fileName);

								endpoints.inout.send({
									info: stat,
									stream: fs.createReadStream(fileName)
								});

								console.log(`*** S5 ${JSON.stringify(stat)}`);
							}
						});
					}
					if (ep.in) {
						ep.receive(function* () {
							while (step.isRunning) {
								currentRequest = yield;
								currentStream = fs.createWriteStream(fileName);
								currentRequest.stream.pipe(currentStream);
							}
						});
					}

					//console.log(`RESOLVE: ${step.state}`);
					resolve(step);
				});
			}
		};

		properties._stop = {
			value: function () {
				if (currentRequest) {
					currentRequest.stream.unpipe(currentStream);
				}
				return Promise.resolve(this);
			}
		};

		return this;
	}
});
