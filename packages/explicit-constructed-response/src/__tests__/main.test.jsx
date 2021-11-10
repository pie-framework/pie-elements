import { shallow } from 'enzyme';
import React from 'react';

import { Main } from '../main';

const choice = (l, v) => ({ label: l, value: v });

describe('Main', () => {
  let wrapper;
  let onChange = jest.fn();

  beforeAll(() => {
    wrapper = (extra) => {
      const props = {
        classes: {},
        prompt: 'Prompt',
        rationale: 'Rationale',
        teacherInstructions: 'Teacher Instructions',
        disabled: false,
        choices: {
          0: [choice('cow', '0'), choice('cattle', '1'), choice('calf', '2')],
          1: [choice('over', '0'), choice('past', '1'), choice('beyond', '2')],
          2: [choice('moon', '0')]
        },
        markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>',
        mode: 'gather',
        feedback: { 0: 'correct', 1: 'correct', 2: 'correct' },
        value: { 0: '1', 1: '0', 2: '0' },
        onChange,
        ...extra
      };

      return shallow(<Main {...props}/>);
    };
  });

  describe('render', () => {
    it('should render in gather mode', () => {
      expect(wrapper()).toMatchSnapshot();
    });

    it('should render in view mode', () => {
      expect(wrapper({ mode: 'view' })).toMatchSnapshot();
    });

    it('should render in evaluate mode', () => {
      expect(wrapper({ mode: 'evaluate' })).toMatchSnapshot();
    });

    it('should render without teacher instructions', () => {
      expect(wrapper({ teacherInstructions: null })).toMatchSnapshot();
    });

    it('should render without rationale', () => {
      expect(wrapper({ rationale: null })).toMatchSnapshot();
    });

    it('should render without prompt', () => {
      expect(wrapper({ prompt: null })).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('onChange', () => {
      wrapper().instance().onChange({ 0: '0', 1: '0', 2: '0' });

      setTimeout(() => {
        expect(onChange).toHaveBeenCalledWith({ 0: '0', 1: '0', 2: '0' });
      }, 400);
    });

    it('onChange when all responses have max length 1', () => {
      wrapper({
        choices: {
          0: [choice('b', '0')],
          1: [choice('a', '0')],
          2: [choice('c', '0')]
        },
        maxLengthPerChoice: [1, 1, 1]
      }).instance().onChange({ 0: 'a', 1: 'b', 2: 'c' });

      expect(onChange).toHaveBeenCalledWith({ 0: 'a', 1: 'b', 2: 'c' });
    });
  });
});
