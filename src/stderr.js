import { Step } from 'kronos-step';

/**
 * Step with one input endpoint writing to stderr
 */
export default class StderrStep extends Step {
  /**
   * @return {string} 'kronos-stderr'
   */
  static get name() {
    return 'kronos-stderr';
  }

  static get description() {
    return 'writes to stderr';
  }

  static get endpoints() {
    return Object.assign(
      {
        in: {
          in: true
        }
      },
      Step.endpoints
    );
  }

  async _start() {
    this.endpoints.in.receive = async request => {
      request.pipe(process.stderr);
      this.currentRequest = request;
    };
  }

  async _stop() {
    if (this.currentRequest) {
      currentRequest.unpipe(process.stderr);
      this.currentRequest = undefined;
    }
  }
}
