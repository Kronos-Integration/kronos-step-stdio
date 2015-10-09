/* jslint node: true, esnext: true */

"use strict";

const fs = require('fs');
const uti = require('uti');

module.exports = {
	name: "kronos-file",
	endpoints: {
		"inout": {
			direction: "inout",
			uti: "org.kronos.file",
			contentInfo: {
				name: {
					description: "file name"
				},
				uti: {
					description: "UTI of the file"
				}
			}
		}
	},
	initialize(manager, sr, stepDefinition, endpoints, properties) {
		const fileName = stepDefinition.fileName;

		let currentRequest, currentStream;

		properties._start = {
			value: function () {
				const step = this;
				return new Promise(function (resolve, reject) {
					if (endpoints.inout.isOut) {
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

								resolve(step);
							}
						});
					}
					if (endpoints.inout.isIn) {
						endpoints.inout.receive(function* () {
							while (step.isRunning) {
								currentRequest = yield;
								currentStream = fs.createWriteStream(fileName);
								currentRequest.stream.pipe(currentStream);
							}
						});
						resolve(step);
					}
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
};
