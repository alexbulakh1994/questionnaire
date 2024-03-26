import * as config from 'config';
import { expandEnv } from './env';

expandEnv(config);

export function loadModuleConfig(moduleName = '*') {
  if (!moduleName) {
    throw new Error('Module not specified');
  }
  const configObject = moduleName === '*' ? config : config[moduleName];
  if (configObject === undefined) {
    throw new Error(`Config for module '${moduleName}' not found`);
  }

  return configObject;
}
