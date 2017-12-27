import { Step } from 'kronos-step';

/**
 * Step with one input endpoint writing to stdout
 */
export default class StdoutStep extends Step {
  /**
   * @return {string} 'kronos-stdout'
   */
  static get name() {
    return 'kronos-stdout';
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
      request.pipe(process.stdout);
      this.currentRequest = request;
    };
  }

  async _stop() {
    if (this.currentRequest) {
      currentRequest.unpipe(process.stdout);
      this.currentRequest = undefined;
    }
  }
}
