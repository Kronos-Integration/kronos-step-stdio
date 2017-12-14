import test from 'ava';
import { ReceiveEndpoint } from 'kronos-endpoint';

(testStep = require('kronos-test-step')),
  (stdoutStep = require('../lib/stdout')),
  (stderrStep = require('../lib/stderr'));

it('stdout', () => {
  test(
    'stdout',
    stdoutStep.createInstance(
      {
        name: 'myStep',
        type: 'kronos-stdout'
      },
      manager
    )
  );
});

it('stderr', () => {
  test(
    'stderr',
    stderrStep.createInstance(
      {
        name: 'myStep',
        type: 'kronos-stderr'
      },
      manager
    )
  );
});

function test(name, step) {
  const testEndpoint = new endpoint.SendEndpoint('test', {
    get name() {
      return 'Test';
    },
    toString() {
      return this.name;
    }
  });

  testEndpoint.connected = step.endpoints.in;

  describe('static', () => testStep.checkStepStatic(manager, step));

  describe('live-cycle', () =>
    testStep.checkStepLivecycle(manager, step, (step, state, livecycle, done) =>
      done()
    ));
}
