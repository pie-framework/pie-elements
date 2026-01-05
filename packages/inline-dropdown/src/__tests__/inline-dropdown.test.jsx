import { render } from '@testing-library/react';
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
          0: [
            {
              label: 'cow ',
              value: '0',
              correct: true,
              rationale: 'rationale cow',
            },
            {
              label: 'dog ',
              value: '1',
              correct: false,
            },
            {
              label: 'cat ',
              value: '2',
              correct: false,
            },
          ],
          1: [
            {
              label: 'over ',
              value: '0',
              correct: true,
              rationale: 'rationale over',
            },
            {
              label: 'under ',
              value: '1',
              correct: false,
            },
            {
              label: 'across ',
              value: '2',
              correct: false,
            },
          ],
          2: [
            {
              label: 'moon ',
              value: '0',
              correct: true,
              rationale: 'rationale moon',
            },
            {
              label: 'sun',
              value: '2',
              correct: false,
            },
            {
              label: 'house ',
              value: '3',
              correct: false,
            },
          ],
        },
        markup: '<div><p>The {{0}} jumped {{1}} the {{2}}</p></div>',
        mode: 'gather',
        feedback: { 0: 'correct', 1: 'correct', 2: 'correct' },
        value: { 0: '1', 1: '0', 2: '0' },
        onChange,
        ...extra,
      };

      return render(<InlineDropdown {...props} />);
    };
  });

  describe('render', () => {
    it('should render in gather mode', () => {
      const { container } = wrapper();
      expect(container).toMatchSnapshot();
    });

    it('should render in view mode', () => {
      const { container } = wrapper({ mode: 'view' });
      expect(container).toMatchSnapshot();
    });

    it('should render in evaluate mode', () => {
      const { container } = wrapper({ mode: 'evaluate' });
      expect(container).toMatchSnapshot();
    });

    it('should render without teacher instructions', () => {
      const { container } = wrapper({ teacherInstructions: null });
      expect(container).toMatchSnapshot();
    });

    it('should render without rationale', () => {
      const { container } = wrapper({ rationale: null });
      expect(container).toMatchSnapshot();
    });

    it('should render without prompt', () => {
      const { container } = wrapper({ prompt: null });
      expect(container).toMatchSnapshot();
    });
  });
});
