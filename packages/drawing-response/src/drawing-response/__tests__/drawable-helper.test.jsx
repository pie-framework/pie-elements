import DrawableHelper from '../drawable-helper';

describe('DrawableHelper', () => {
  describe('toJson', () => {
    it('emits json', () => {
      class Foo extends DrawableHelper {
        constructor(props) {
          super(props, 'FOO_TYPE');

          this.foo = 'bar';
        }
      }

      const foo = new Foo({});

      const o = foo.toJson();

      expect(o).toEqual({
        type: 'FOO_TYPE',
        foo: 'bar'
      });
    });
  });
});
