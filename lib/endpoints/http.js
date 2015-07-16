/* jslint node: true, esnext: true */

"use strict";

const request = require('request');
const http = require('http');
const url = require('url');

module.exports = {
	"direction": "in(active),out(passive)",
	implementation(manager, generator) {

		if (this.isIn) {
			const go = generator();

			go.next();

			const o = url.parse(this.target);
			const port = o.port || 80;

			const server = http.createServer(function (req, res) {
				go.next({
					info: req.headers,
					stream: req.stream
				});

				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.end('ok');
			});

			server.listen(port, '127.0.0.1', function (error) {
				//console.log(`listen ${port} ${error}`);
			});
			return go;
		} else
		if (this.isOut) {
			const myGen = function* () {
				let r = yield;
				request.post({
						url: this.target,
						formData: {
							content: r.stream,
						}
					},
					function optionalCallback(err, httpResponse, body) {
						//console.log(`http post done: ${err}`);
					});
			};
			const go = myGen();
			go.next();
			return go;
		}
	}
};
