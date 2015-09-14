/* jslint node: true, esnext: true */

"use strict";

exports.stdin = {
  "direction": "in(active,passive)",
  implementation(manager, generator) {
    if (generator) {
      const go = generator();

      // TODO go.return(); or what is the name of the last value method
      go.next({
        info: {
          name: 'stdin'
        },
        stream: process.stdin
      });

      return undefined;
    }

    /*
     * stdin endpoint delivers one single stdin stream
     */
    const myGen = function* () {
      return {
        info: {
          name: 'stdin'
        },
        stream: process.stdin
      };
    };

    return myGen();
  }
};

exports.stdout = {
  "direction": "out(active,passive)",
  implementation(manager, generator) {
    if (generator) {
      for (let request of generator()) {
        //console.log(`stdout got stream generator: ${JSON.stringify(request.info)}: ${request.stream}`);
        request.stream.pipe(process.stdout);
      }
      return undefined;
    }

    const myGen = function* () {
      let request;
      while ((request = yield) !== undefined) {
        //console.log(`stdout got stream: ${JSON.stringify(request.info)}: ${request.stream}`);
        request.stream.pipe(process.stdout);
      }
    };

    return myGen();
  }
};

exports.stderr = {
  "direction": "out(active,passive)",
  implementation(manager, generator) {
    if (generator) {
      for (let request of generator()) {
        //console.log(`stderr got stream generator: ${JSON.stringify(request.info)}: ${request.stream}`);
        request.stream.pipe(process.stderr);
      }
      return undefined;
    }

    const myGen = function* () {
      let request;
      while ((request = yield) !== undefined) {
        //console.log(`stderr got stream: ${JSON.stringify(request.info)}: ${request.stream}`);
        request.stream.pipe(process.stderr);
      }
    };

    return myGen();
  }
};
