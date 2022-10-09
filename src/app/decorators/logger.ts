interface LoggerParams {
  type?: 'log' | 'trace' | 'warn' | 'info' | 'debug';
  inputs?: boolean;
  outputs?: boolean;
}

const defaultParams: Required<LoggerParams> = {
  type: 'log',
  inputs: true,
  outputs: true
};

export function Log(params?: LoggerParams): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
  const options: Required<LoggerParams> = {
    type: params?.type || defaultParams.type,
    inputs: params?.inputs === undefined ? defaultParams.inputs : params.inputs,
    outputs: params?.outputs === undefined ? defaultParams.outputs : params.outputs
  };
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    let functionString = descriptor.value.toString();
    let variableNames = functionString.match('\\((.*?)\\)')[0].replace('(', '').replace(')', '').replace(' ', '').split(',');

    descriptor.value = function (...args: any[]) {

      let values: any[] = args.toString().replace(' ', '').split(',');

      let varNameValues: any[] = variableNames.map((name: any, index: number) => name + ':' + values[index]);

      const result = original.apply(this, args);

      if (options.inputs && !options.outputs) {
        console[options.type]('Logged inputs ' + original.name + ':', varNameValues);
      } else if (!options.inputs && options.outputs) {
        console[options.type]('Logged outputs ' + original.name + ':', result);
      } else {
        console[options.type]('Logged inputs ' + original.name + ':', varNameValues + ' Logged outputs ' + original.name + ':', result)
      }

      return result;
    };
  };
}
