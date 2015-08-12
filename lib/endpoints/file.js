/* jslint node: true, esnext: true */

"use strict";

const fs = require('fs');
const uti = require('uti');

module.exports = {
	"direction": "inout(active,passive)",
	"uti": "org.kronos.file",
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
					stat.name = fileName;
					stat.uti = uti.getUTIsForFileName(fileName);

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
				let stream = fs.createReadStream(fileName);

				yield {
					info: {
						uti: uti.getUTIsForFileName(fileName),
						name: fileName
					},
					stream: stream
				};
			};
			return myGen();
		} else {
			if (this.isOut) {
				if (generator) {
					for (let request of generator()) {
						const stream = fs.createWriteStream(fileName);

						request.stream.pipe(stream);
					}

					return undefined;
				}

				const myGen = function* () {
					do {
						const request = yield;
						const stream = fs.createWriteStream(fileName);
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
};
