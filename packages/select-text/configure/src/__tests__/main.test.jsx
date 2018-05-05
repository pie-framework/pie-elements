import { shallow } from 'enzyme';
import React from 'react';
import { Main } from '../main';

describe('main', () => {
  let w;
  let onChange;

  const getModel = () => ({ tokens: [] });
  beforeEach(() => {
    onChange = jest.fn();
    w = shallow(<Main model={getModel()} classes={{}} onChange={onChange} />);
  });

  describe('snapshot', () => {
    it('renders', () => {
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('changePartialScoring', () => {
      it('calls onChange', () => {
        w.instance().changePartialScoring([{ foo: 'foo' }]);
        expect(onChange).toBeCalledWith({
          ...getModel(),
          partialScoring: [{ foo: 'foo' }]
        });
      });
    });
  });
});
