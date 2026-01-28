import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { AlternateSection, Choice } from '../alternateSection';

jest.mock('@pie-lib/editable-html-tip-tap', () => ({
  __esModule: true,
  default: ({ markup, onChange }) => (
    <div data-testid="editable-html" onClick={() => onChange && onChange('test')}>
      {markup}
    </div>
  ),
  ALL_PLUGINS: [],
}));

const theme = createTheme();

const choices = [
  { label: 'cow', value: '0' },
  { label: 'cattle', value: '1' },
  { label: 'calf', value: '2' },
];

describe('Choice', () => {
  let onChange = jest.fn();
  let onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderChoice = () => {
    const defaults = {
      classes: {},
      key: '0',
      markup: 'cow',
      onChange,
      onDelete,
    };
    const props = { ...defaults };

    return render(
      <ThemeProvider theme={theme}>
        <Choice {...props} />
      </ThemeProvider>
    );
  };

  describe('logic', () => {
    it('calls onChange', () => {
      jest.useFakeTimers();

      const testInstance = new Choice({
        classes: {},
        key: '0',
        markup: 'cow',
        onChange,
        onDelete,
      });

      // Initialize state and mock setState
      testInstance.state = { value: 'cow' };
      testInstance.setState = jest.fn((newState) => {
        testInstance.state = { ...testInstance.state, ...newState };
      });

      // Call onChange with a string (as EditableHtml does)
      testInstance.onChange('TEST');

      // Fast-forward time to trigger debounced callback
      jest.advanceTimersByTime(400);

      expect(onChange).toHaveBeenCalledWith('TEST');

      jest.useRealTimers();
    });
  });
});

describe('AlternateSection', () => {
  let onSelect = jest.fn();
  let choiceChanged = jest.fn();
  let choiceRemoved = jest.fn();
  let lengthChanged = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to create a properly initialized test instance
  const createTestInstance = (extras = {}) => {
    const defaults = {
      classes: {},
      key: '0',
      value: 'cow',
      onSelect,
      choiceChanged,
      choiceRemoved,
      lengthChanged,
      selectChoices: [{ label: 'moon', value: '2' }],
      choices,
      maxLength: 10,
      ...extras
    };

    const testInstance = new AlternateSection(defaults);
    // Initialize state manually since we're not mounting
    testInstance.state = { choices: [] };

    // Mock setState to capture state updates
    testInstance.setState = jest.fn((newState) => {
      testInstance.state = { ...testInstance.state, ...newState };
    });

    return testInstance;
  };

  const renderAlternateSection = (extras = {}) => {
    const defaults = {
      classes: {},
      key: '0',
      value: 'cow',
      onSelect,
      choiceChanged,
      choiceRemoved,
      lengthChanged,
      selectChoices: [{ label: 'moon', value: '2' }],
      choices,
      maxLength: 10,
      ...extras
    };
    const props = { ...defaults };

    return render(
      <ThemeProvider theme={theme}>
        <AlternateSection {...props} />
      </ThemeProvider>
    );
  };

  describe('logic', () => {
    describe('updateChoicesIfNeeded', () => {
      it('does not set state', () => {
        const testInstance = createTestInstance();

        testInstance.updateChoicesIfNeeded({ choices });

        expect(testInstance.state).toEqual(expect.objectContaining({ choices }));
      });

      it('sets state, updates edited choice', () => {
        const testInstance = createTestInstance();

        const newChoices = [
          { label: 'cow', value: '0' },
          { label: 'cattle', value: '1' },
          { label: 'little calf', value: '2' },
        ];

        testInstance.updateChoicesIfNeeded({ choices: newChoices });

        expect(testInstance.state).toEqual(
          expect.objectContaining({
            choices: newChoices,
          }),
        );
      });

      it('sets state, updates adding new choice', () => {
        const testInstance = createTestInstance();

        const newChoices = [
          { label: 'cow', value: '0' },
          { label: 'cattle', value: '1' },
          { label: 'little calf', value: '2' },
        ];

        testInstance.updateChoicesIfNeeded({ choices: newChoices });

        expect(testInstance.state).toEqual(
          expect.objectContaining({
            choices: newChoices,
          }),
        );
      });

      it('sets state, updates removing choice', () => {
        const testInstance = createTestInstance();

        const newChoices = [
          { label: 'cow', value: '0' },
          { label: 'cattle', value: '1' },
        ];

        testInstance.updateChoicesIfNeeded({ choices: newChoices });

        expect(testInstance.state).toEqual(
          expect.objectContaining({
            choices: newChoices,
          }),
        );
      });
    });

    describe('handleSelect', () => {
      it('calls onSelect', () => {
        const testInstance = createTestInstance();

        testInstance.handleSelect({ target: { value: '2' } });

        expect(onSelect).toBeCalledWith({ label: 'moon', value: '2' });
      });
    });

    describe('onAddChoice', () => {
      it('adds choice', () => {
        const testInstance = createTestInstance();
        testInstance.state = { choices: [...choices] };

        const stateBefore = [...testInstance.state.choices];

        testInstance.onAddChoice();

        expect(testInstance.state.choices).toEqual([...stateBefore, { value: '3', label: '' }]);
      });

      it('does not add choice if previously added choice is empty', () => {
        const testInstance = createTestInstance();
        testInstance.state = { choices: [...choices] };

        const stateBefore = [...testInstance.state.choices];

        testInstance.onAddChoice();

        const afterFirstAdd = [...testInstance.state.choices];
        expect(afterFirstAdd).toEqual([...stateBefore, { value: '3', label: '' }]);

        testInstance.onAddChoice();

        expect(testInstance.state.choices).toEqual(afterFirstAdd);
      });
    });

    describe('onChoiceChanged', () => {
      beforeEach(() => {
        choiceChanged.mockClear();
        lengthChanged.mockClear();
      });

      it('calls choiceChanged', () => {
        const testInstance = createTestInstance();
        testInstance.state = { choices: [...choices] };

        testInstance.onChoiceChanged({ value: '0', label: 'cow' }, 'New value');

        expect(choiceChanged).toBeCalledWith({ value: '0', label: 'New value' });
      });

      it('calls lengthChanged when new max length is greater than current maxLength', () => {
        // ['cow', 'cattle', 'calf'] - max length is 6 (cattle)
        // maxLength prop is 10, so we need something longer than 10
        const longChoice = 'Very long choice text'; // 21 characters

        const testInstance = createTestInstance();
        testInstance.state = { choices: [...choices] };

        testInstance.onChoiceChanged({ value: '0', label: 'cow' }, longChoice, 0);

        // 21 + 5 = 26
        expect(lengthChanged).toHaveBeenCalledWith(26);
      });

      it('calls lengthChanged when new max length is significantly smaller', () => {
        const testInstance = createTestInstance({ maxLength: 30 });
        testInstance.state = { choices: [...choices] };

        // ['cow', 'cattle', 'calf'] - max length is 6
        testInstance.onChoiceChanged({ value: '1', label: 'cattle' }, 'a', 1);

        // max length will be 4 (max of 'cow', 'a', 'calf')
        // Since 4 + 10 = 14 <= 30, this should trigger lengthChanged
        expect(lengthChanged).toHaveBeenCalledWith(7); // getAdjustedLength(4) = 4 + 3 = 7
      });

      it('does not call lengthChanged when new max length is within threshold', () => {
        // ['cow', 'cattle', 'calf'] - max length is 6
        // maxLength is 10, change to something that keeps max around the same
        const testInstance = createTestInstance();
        testInstance.state = { choices: [...choices] };

        testInstance.onChoiceChanged({ value: '0', label: 'cow' }, 'bull', 0);

        // max length will still be 6 (cattle), which is not > 10 and not <= 0 (10-10)
        expect(lengthChanged).not.toHaveBeenCalled();
      });

      it('calculates max length across all choices correctly', () => {
        const shortChoices = [
          { label: 'a', value: '0' },
          { label: 'bb', value: '1' },
          { label: 'ccc', value: '2' },
        ];

        const testInstance = createTestInstance({
          choices: shortChoices,
          maxLength: 5
        });
        testInstance.state = { choices: [...shortChoices] };

        testInstance.onChoiceChanged(
          { value: '2', label: 'ccc' },
          'This is much longer',
          2
        );
        expect(lengthChanged).toHaveBeenCalledWith(24);
      });

      it('handles mixed special characters correctly', () => {
        lengthChanged.mockClear();
        const mixedSpecialChoice = 'Test with & < > " \' symbols'; // 27 chars when decoded

        const testInstance = createTestInstance({ maxLength: 5 });
        testInstance.state = { choices: [...choices] };

        testInstance.onChoiceChanged({ value: '0', label: 'cow' }, mixedSpecialChoice, 0);

        // 27 normal characters + 5 buffer = 32
        expect(lengthChanged).toHaveBeenCalledWith(32);
      });
    });
  });
});
