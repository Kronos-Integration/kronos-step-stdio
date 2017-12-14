import test from 'ava';
import { ReceiveEndpoint } from 'kronos-endpoint';
import {} from 'kronos-test-step';

import StdinStep from '../src/stdin';

before(done => {
  ksm.manager({}, [require('../index')]).then(m => {
    stdin = stdinStep.createInstance(
      {
        name: 'myStep',
        type: 'kronos-stdin'
      },
      m
    );

    const testEndpoint = new ReceiveEndpoint('test');

    testEndpoint.receive = async request => {};

    stdin.endpoints.out.connected = testEndpoint;

    manager = m;
    done();
  });
});

it('stdin', () => {
  describe('static', () => testStep.checkStepStatic(manager, stdin));

  describe('live-cycle', () =>
    testStep.checkStepLivecycle(
      manager,
      stdin,
      (step, state, livecycle, done) => done()
    ));

  describe('start', () => {
    it('should produce a request', done => {
      stdin.start().then(step => {
        try {
          assert.equal(step.state, 'running');
          setTimeout(done, 30);
        } catch (e) {
          done(e);
        }
      }, done);
    });
  });
});
