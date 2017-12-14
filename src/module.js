import StdoutStep from './stdout';
import StderrStep from './stderr';
import StdinStep from './stdin';

export registerWithManager = manager => Promise.all([
  manager.registerStep(StdoutStep),
  manager.registerStep(StderrStep),
  manager.registerStep(StdinStep)
]);
