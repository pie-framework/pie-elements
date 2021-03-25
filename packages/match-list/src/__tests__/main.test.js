import * as React from 'react';
import { shallow } from 'enzyme';
import { Main } from '../main';
import { model } from '../../docs/demo/config';

describe('Main', () => {
  const onSessionChange = jest.fn();
  const defaultProps = {
    model: model('1'),
    session: {
      value: [1, 4, 3, 2]
    },
    classes: {},
    onSessionChange
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Main {...defaultProps} />);
  });

  describe('render', () => {
    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('logic', () => {

    describe('onRemoveAnswer', () => {
      it('should call onSessionChange with appropriate values', () => {
        wrapper.instance().onRemoveAnswer(0);
        expect(onSessionChange).toHaveBeenCalledWith({
          value: [undefined, 4, 3, 2]
        })
      });
    });

    describe('onPlaceAnswer', () => {
      it('should call onSessionChange with appropriate values', () => {
        wrapper.instance().onPlaceAnswer(0, 5);
        expect(onSessionChange).toHaveBeenCalledWith({
          value: [5, 4, 3, 2]
        })
      });
    });

    describe('toggleShowCorrect', () => {
      it('should change state the value for showCorrectAnswer to true', () => {
        wrapper.instance().toggleShowCorrect();
        expect(wrapper.state('showCorrectAnswer')).toBe(true);
      });
    });
  });
});
