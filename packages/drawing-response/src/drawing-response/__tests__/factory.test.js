import factory from '../factory';

describe('factory', () => {
  it('creates instance', () => {
    const instance = factory('FreePathDrawable', {});
    expect(instance).toBeDefined();
    expect(instance.toJson().type).toEqual('FreePathDrawable');
  });

  it('throws error for unknown instance', () => {
    expect(() => factory('?', {})).toThrow(/Can't find.*/);
  });
});
