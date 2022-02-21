import { shallow } from 'enzyme';
import React from 'react';

import Main from '../main';

describe('Main', () => {
  let wrapper;
  let onChange = jest.fn();

  beforeAll(() => {
    wrapper = (extra) => {
      const props = {
        model: {
          prompt: 'Prompt',
          mode: 'gather',
          rationale: 'Rationale',
          teacherInstructions: 'Teacher Instructions',
          rationaleEnabled: true,
          promptEnabled: true,
          teacherInstructionsEnabled: true,
          studentInstructionsEnabled: true,
          id: '1',
          element: 'drag-in-the-blank',
          markup: '{{0}} + {{1}} = 15',
          disabled: false,
          choices: [{ value: '<div>9</div>', id: '1' }, { value: '<div>6</div>', id: '0' }],
          choicesPosition: 'below',
          correctResponse: { 0: '0', 1: '1' },
          duplicates: true,
          alternateResponses: [['1'], ['0']],
          feedback: {},
          ...extra
        },
        value: { 0: '1', 1: '0' },
        onChange
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
});
