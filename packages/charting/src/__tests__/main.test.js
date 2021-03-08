import * as React from 'react';
import { Main } from '../main';
import { shallow } from 'enzyme/build';

jest.mock('lodash/uniq', () => {
  return () => ([]);
});

describe('Main', () => {
  const onAnswersChange = jest.fn();
  const defaultProps = {
    model: {
      backgroundMarks: [],
      correctMarks: [],
    },
    onAnswersChange,
    session: {}
  };

  describe('render', () => {
    let w;

    beforeEach(() => {
      w = props => shallow(<Main { ...props } />);
    });

    it('snapshot', () => {
      expect(w(defaultProps)).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w;

    beforeEach(() => {
      w = props => shallow(<Main { ...props } />);
    });

    it('calls onAnswersChange', () => {
      w(defaultProps).instance().changeData([]);
      expect(onAnswersChange).toHaveBeenCalledWith([]);
    });
  });

});
