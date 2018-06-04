import util from 'util';

export const extractArgs = argObject => {
  let args = Array.prototype.slice.call(arguments);
  const method = args[0];
  const last = args[args.length - 1];
  const fnArgs = args.splice(1, args.length - 2);
  return { method, last, fnArgs };
};

export const callsOnChange = function() {
  let args = Array.prototype.slice.call(arguments);
  const wrapper = args[0];
  const method = args[1];
  const expected = args[args.length - 1];
  const fnArgs = args.splice(2, args.length - 3);
  const argString = fnArgs
    .map(o => util.inspect(o, { colors: true }))
    .join(', ');
  it(`${method}(${argString}) calls onChange with ${util.inspect(expected, {
    colors: true
  })}`, () => {
    const instance = wrapper.instance();
    instance[method].apply(instance, fnArgs);
    expected();
  });
};
