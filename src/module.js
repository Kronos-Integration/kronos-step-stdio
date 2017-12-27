import StdoutStep from './stdout';
import StderrStep from './stderr';
import StdinStep from './stdin';

export function registerWithManager(manager) {
  return Promise.all([
    manager.registerStep(StdoutStep),
    manager.registerStep(StderrStep),
    manager.registerStep(StdinStep)
  ]);
}
