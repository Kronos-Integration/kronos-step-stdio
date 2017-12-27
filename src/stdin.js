import { Step } from 'kronos-step';

/**
 * Step with one output endpoint reading from stdin
 */
export default class StdintStep extends Step {
  /**
   * @return {string} 'kronos-stdin'
   */
  static get name() {
    return 'kronos-stdin';
  }

  static get description() {
    return 'reads from stdin';
  }

  static get endpoints() {
    return Object.assign(
      {
        out: {
          out: true
        }
      },
      Step.endpoints
    );
  }

  async _start() {
    this.endpoints.in.receive = request => {
      request.pipe(process.stdin);
      this.currentRequest = request;
    };
  }
}
