import React from 'react';
import { DraggableCalculator } from '../draggable-calculator';
import { shallow } from 'enzyme';

describe('DraggableCalculator', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <DraggableCalculator
        mode="basic"
        show={true}
        onClose={jest.fn()}
        classes={{}}
      />
    );
  });

  describe('snapshot', () => {
    it('Creates snapshot using enzyme', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('updates state.deltaPosition', () => {
      wrapper.instance().handleDrag(null, { deltaX: 10, deltaY: 10 });
      const deltaPosition = wrapper.state('deltaPosition');
      expect(deltaPosition).toEqual({ x: 10, y: 10 });
    });
  });
});
