import El from '../index';

jest.mock('../number-line', () => ({
  default: () => <div>NumberLine</div>
}));

describe('number-line', () => {
  let mod, deps, instance;

  let point = {
    session: n => ({
      type: 'point',
      domainPosition: n,
      pointType: 'full'
    }),
    graph: n => ({
      type: 'point',
      position: n,
      pointType: 'full'
    })
  };

  let getStubInstance = () => {
    let out = new El();
    out._render = jest.fn();
    out._applyInitialElements = jest.fn();
    return out;
  };

  describe('constructor', () => {
    it('inits', () => {
      instance = new El();
      expect(instance).not.toBe(null);
    });
  });

  describe('setters', () => {
    beforeEach(() => {
      instance = getStubInstance();
    });

    describe('session', () => {
      beforeEach(() => {
        instance.session = {};
      });

      it('calls _applyInitialElements', () => {
        expect(instance._applyInitialElements).toBeCalled();
      });

      it('calls _render', () => {
        expect(instance._render).toBeCalled();
      });
    });

    describe('model', () => {
      beforeEach(() => {
        instance.model = {};
      });

      it('calls _applyInitialElements', () => {
        expect(instance._applyInitialElements).toBeCalled();
      });

      it('calls _render', () => {
        expect(instance._render).toBeCalled();
      });
    });
  });

  describe('addElement', () => {
    beforeEach(() => {
      instance = getStubInstance();
      instance.session = {};
      instance.addElement({ type: 'point', position: 1, pointType: 'full' });
    });

    it('adds session formatted element to answer array', () => {
      expect(instance._session.answer[0]).toEqual({
        type: 'point',
        domainPosition: 1,
        pointType: 'full'
      });
    });
  });

  describe('moveElement', () => {
    beforeEach(() => {
      instance = getStubInstance();
      instance.session = {
        answer: [{ type: 'point', domainPosition: 1, pointType: 'full' }]
      };
      instance.moveElement(
        0,
        { type: 'point', position: 1, pointType: 'full' },
        2
      );
    });

    it('updates the session answer', () => {
      expect(instance._session.answer.length).toEqual(1);
      expect(instance._session.answer[0]).toEqual({
        type: 'point',
        domainPosition: 2,
        pointType: 'full'
      });
    });
  });

  describe('deleteElements', () => {
    beforeEach(() => {
      instance = getStubInstance();
      instance.session = {
        answer: [point.session(1), point.session(2), point.session(3)]
      };
      instance.deleteElements([0, 2]);
    });

    it('removes 2 elements', () => {
      expect(instance._session.answer.length).toEqual(1);
    });

    it('keeps the remaining point', () => {
      expect(instance._session.answer).toEqual([point.session(2)]);
    });
  });
});
