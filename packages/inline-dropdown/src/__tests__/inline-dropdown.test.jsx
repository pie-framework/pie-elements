import { shallow } from 'enzyme';
import React from 'react';

import { InlineDropdown } from '../inline-dropdown';

describe('InlineDropdown', () => {
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
          '0': [
            {
              label: 'cow ',
              value: '0',
              correct: true
            },
            {
              label: 'dog ',
              value: '1',
              correct: false
            },
            {
              label: 'cat ',
              value: '2',
              correct: false
            }
          ],
          '1': [
            {
              label: 'over ',
              value: '0',
              correct: true
            },
            {
              label: 'under ',
              value: '1',
              correct: false
            },
            {
              label: 'across ',
              value: '2',
              correct: false
            }
          ],
          '2': [
            {
              label: 'moon ',
              value: '0',
              correct: true
            },
            {
              label: 'sun',
              value: '2',
              correct: false
            },
            {
              label: 'house ',
              value: '3',
              correct: false
            }
          ]
        },
        markup: '<div><p>The {{0}} jumped {{1}} the {{2}}</p></div>',
        mode: 'gather',
        feedback: { 0: 'correct', 1: 'correct', 2: 'correct' },
        value: { 0: '1', 1: '0', 2: '0' },
        onChange,
        ...extra
      };

      return shallow(<InlineDropdown {...props}/>);
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
});
