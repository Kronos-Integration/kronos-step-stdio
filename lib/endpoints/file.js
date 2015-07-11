/* jslint node: true, esnext: true */

"use strict";

const fs = require('fs');
const uti = require('uti');

exports.endpointImplementations = {
	"file": {
		"direction": "inout(active,passive)",
		"contentInfo": {
			"name": {
				"description": "file name"
			},
			"uti": {
				"description": "UTI of the file"
			}
		},
		implementation(manager, generator) {
			const uri = this.target;
			const m = uri.match(/^file:(.*)/);
			const fileName = m[1];

			if (this.isIn) {
				if (generator) {
					const go = generator();

					go.next();

					fs.stat(fileName, function (err, stat) {
						//console.log(`stat: ${fileName} ${JSON.stringify(stat)}`);

						stat.name = fileName;
						stat.uti = uti.getUTIsForFileName(fileName);
						//console.log(`uti: ${fileName} ${uti.getUTIsForFileName(fileName)}`);

						if (err) {
							go.error(err);
						} else {
							go.next({
								info: stat,
								stream: fs.createReadStream(fileName)
							});
						}
					});

					return go;
				}

				const myGen = function* () {
					//console.log(`file endpoint "in" ${fileName}`);

					let stream = fs.createReadStream(fileName);

					//console.log(`UTIS: ${fileName} -> ${uti}`);
					yield {
						info: {
							uti: uti.getUTIsForFileName(fileName),
							name: fileName
						},
						stream: stream
					};

					//console.log(`end file endpoint in ${fileName}`);
				};
				return myGen();
			} else {
				if (this.isOut) {
					/*
					const endpoint = this;
					const errorHandler = function (error) {
						console.log(`stream error:${error}`);
					};
					const finishHandler = function () {
						console.log(`stream finished:`);
					};
					const endHandler = function () {
						console.log(`stream end: ${JSON.stringify(endpoint)}`);
					};

					const dataHandler = function (data) {
						console.log(`stream data:${data}`);
					};
					const drainHandler = function () {
						console.log(`stream drain:`);
					};
*/

					if (generator) {
						for (let request of generator()) {
							//console.log(`Request ${JSON.stringify(request.info)}`);

							const stream = fs.createWriteStream(fileName);

							/*
														stream.on('error', errorHandler);
														stream.on('finish', finishHandler);
														stream.on('drain', drainHandler);
														request.stream.on('error', errorHandler);
														request.stream.on('end', endHandler);
							*/

							request.stream.pipe(stream);

							/*
														for (let i = 0; i < 100; i++) {
															let r = stream.write('hallo', 'utf-8', function (error) {
																console.log(`${error}`);
															});
														}
							*/

							/*
														setTimeout(function () {
															console.log('stop writing to file.txt');
															request.stream.unpipe(stream);
															console.log('manually close the file stream');
															stream.write('hallo');
															stream.end();
														}, 1000);
														*/
							//request.stream.resume();
						}

						return undefined;
					}

					const myGen = function* () {
						//console.log(`file endpoint out ${fileName} ${generator}`);

						do {
							const request = yield;
							const stream = fs.createWriteStream(fileName);

							stream.on('error', errorHandler);
							stream.on('finish', finishHandler);

							request.stream.pipe(stream);
						}
						while (true);
					};

					const go = myGen();
					go.next();
					return go;
				}
			}

			//console.log(`unknown direction: ${this.direction}`);
		}
	}
};
