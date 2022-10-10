import { isDevMode } from '@angular/core';
import { environment } from '../../environments/environment';

interface LoggerParams {
  type?: 'log' | 'trace' | 'warn' | 'info' | 'debug' | 'error';
  inputs?: boolean;
  outputs?: boolean;
  printInProd?: boolean;
  timeStamp?: boolean;
}

// Default values when just @Log() is used
const defaultParams: Required<LoggerParams> = {
  type: 'log',
  inputs: true,
  outputs: true,
  printInProd: false,
  timeStamp: true
};

/**
 * @Log() appended on top of method to console.log() input, output of the method attached to.
 * @param params optional type of LoggerParams which can be passed to @Log()
 * If none is given, defaultParams are used.
 */
export function Log(params?: LoggerParams): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {

  const options: Required<LoggerParams> = {
    type: params?.type || defaultParams.type,
    inputs: params?.inputs === undefined ? defaultParams.inputs : params.inputs,
    outputs: params?.outputs === undefined ? defaultParams.outputs : params.outputs,
    printInProd: params?.printInProd === undefined ? defaultParams.printInProd : params.printInProd,
    timeStamp: params?.timeStamp === undefined ? defaultParams.timeStamp : params.timeStamp
  };

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    // Overwrite console logging in production with printInProd = true
    // https://angular.io/api/core/isDevMode
    if (!options.printInProd && (!isDevMode() || environment.production)) {
      return;
    }

    // Original method
    const original = descriptor.value;

    // Know that this is not the original variable name.
    // ParamNames are as they appear when passed to the method
    let paramNames = descriptor.value.toString().replace(/\s/g, '').match(/\((.*?)\)/)[1].split(',');

    descriptor.value = function (...args: any[]) {

      // Param names as they were passed into the method
      let paramValues: any[] = args.map(v => v);

      // Make the object to be printed
      let nameAndValue: any = {};
      if (paramValues.length === paramNames.length) {
        for (let i = 0; i < paramNames.length; i++) {
          nameAndValue = {...nameAndValue, ...{[paramNames[i]]: paramValues[i]}};
        }

      }

      const result = original.apply(this, args);

      let timeStamp = '';
      if (options.timeStamp) {
        timeStamp = formatConsoleDate(new Date());
      }

      // Only Inputs
      if (params?.inputs && !params?.outputs) {
        console[options.type](original.name + ' -> IN: ' + original.name + ':', [nameAndValue]);
      }

      // Only Outputs
      else if (!params?.inputs && params?.outputs) {
        console[options.type](original.name + ' -> OUT: ', result);
      }

      // Input and Output
      else {
        console[options.type](timeStamp, original.name + ' -> IN: ', nameAndValue, ' OUT: ', result);
      }

      return result;
    };
  };
}

// If you want every other console log to also be timestamped look here:
// https://stackoverflow.com/a/36887315/15439733
function formatConsoleDate(date: Date) {
  let hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  let milliseconds = date.getMilliseconds();

  return '[' +
         ((hour < 10) ? '0' + hour : hour) +
         ':' +
         ((minutes < 10) ? '0' + minutes : minutes) +
         ':' +
         ((seconds < 10) ? '0' + seconds : seconds) +
         '.' +
         ('00' + milliseconds).slice(-3) +
         ']';
}
