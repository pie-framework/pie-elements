import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { AlternateResponses } from '../alternateResponses';
import sensibleDefaults from '../defaults';
import { createSlateMarkup, processMarkup } from '../markupUtils';

jest.mock('../alternateSection', () => ({
  __esModule: true,
  default: (props) => <div data-testid="alternate-section" {...props} />,
}));

const theme = createTheme();

const model = {
  markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>',
  disabled: false,
  choices: {
    0: [
      { label: 'cow', value: '0' },
      { label: 'cattle', value: '1' },
      { label: 'calf', value: '2' },
    ],
    1: [
      { label: 'over', value: '0' },
      { label: 'past', value: '1' },
      { label: 'beyond', value: '2' },
    ],
    2: [{ label: 'moon', value: '0' }],
  },
  maxLengthPerChoice: [6, 6, 4],
  prompt: 'Complete the sentence',
};

const prepareModel = (model = {}) => {
  const joinedObj = {
    ...sensibleDefaults.model,
    ...model,
  };
  const slateMarkup = joinedObj.slateMarkup || createSlateMarkup(joinedObj.markup, joinedObj.choices);
  const processedMarkup = processMarkup(slateMarkup);

  return {
    ...joinedObj,
    slateMarkup,
    markup: processedMarkup,
  };
};

describe('AlternateResponses', () => {
  let onChange = jest.fn();
  let onLengthChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to create a properly initialized test instance
  const createTestInstance = (modelOverrides = {}, propsOverrides = {}) => {
    const testProps = {
      onChange,
      onLengthChange,
      classes: {},
      model: prepareModel({
        ...model,
        ...modelOverrides,
      }),
      maxLengthPerChoiceEnabled: false,
      ...propsOverrides,
    };

    const testInstance = new AlternateResponses(testProps);
    // Initialize state manually since we're not mounting
    testInstance.state = { maxLengthPerChoice: [] };

    // Mock setState to capture state updates
    testInstance.setState = jest.fn((newState) => {
      testInstance.state = { ...testInstance.state, ...newState };
    });

    return testInstance;
  };

  const renderAlternateResponses = (extras) => {
    const defaults = {
      onChange,
      onLengthChange,
      classes: {},
      model: prepareModel({
        ...model,
        ...extras,
      }),
      maxLengthPerChoiceEnabled: true,
    };
    const props = { ...defaults };

    return render(
      <ThemeProvider theme={theme}>
        <AlternateResponses {...props} />
      </ThemeProvider>
    );
  };

  describe('logic', () => {
    describe('updateChoicesIfNeeded', () => {
      it('sets state, updates edited choice', () => {
        const testInstance = createTestInstance();

        const newChoices = {
          0: [
            { label: 'cow', value: '0' },
            { label: 'cattle', value: '1' },
            { label: 'calf', value: '2' },
          ],
          1: [
            { label: 'under', value: '0' },
            { label: 'past', value: '1' },
            { label: 'beyond', value: '2' },
          ],
          2: [{ label: 'moon', value: '0' }],
        };

        testInstance.updateChoicesIfNeeded({
          model: {
            ...model,
            choices: newChoices,
          },
          maxLengthPerChoiceEnabled: false,
        });

        expect(testInstance.state).toEqual(
          expect.objectContaining({
            choices: newChoices,
            values: {
              0: { label: 'cow', value: '0' },
              1: { label: 'under', value: '0' },
            },
          }),
        );
      });

      it('sets state, if a choice has an alternate', () => {
        const testInstance = createTestInstance();

        const newChoices = {
          0: [
            { label: 'cow', value: '0' },
            { label: 'cattle', value: '1' },
            { label: 'calf', value: '2' },
          ],
          1: [
            { label: 'under', value: '0' },
            { label: 'past', value: '1' },
            { label: 'beyond', value: '2' },
          ],
          2: [
            { label: 'sun', value: '0' },
            { label: 'star', value: '1' },
          ],
        };

        testInstance.updateChoicesIfNeeded({
          model: {
            ...model,
            choices: newChoices,
          },
          maxLengthPerChoiceEnabled: false,
        });

        expect(testInstance.state).toEqual(
          expect.objectContaining({
            choices: newChoices,
            values: {
              0: { label: 'cow', value: '0' },
              1: { label: 'under', value: '0' },
              2: { label: 'sun', value: '0' },
            },
          }),
        );
      });

      it('sets state if some choices are removed', () => {
        const testInstance = createTestInstance();

        const newChoices = {
          0: [
            { label: 'cow', value: '0' },
            { label: 'cattle', value: '1' },
            { label: 'calf', value: '2' },
          ],
        };

        testInstance.updateChoicesIfNeeded({
          model: {
            ...model,
            choices: newChoices,
          },
          maxLengthPerChoiceEnabled: false,
        });

        expect(testInstance.state).toEqual(
          expect.objectContaining({
            choices: newChoices,
            values: {
              0: { label: 'cow', value: '0' },
            },
          }),
        );
      });

      it('does not change state', () => {
        const testInstance = createTestInstance();

        // Initialize state
        testInstance.updateChoicesIfNeeded({
          model,
          maxLengthPerChoiceEnabled: false,
        });

        // Call again with same model
        testInstance.updateChoicesIfNeeded({
          model,
          maxLengthPerChoiceEnabled: false,
        });

        expect(testInstance.state).toEqual(
          expect.objectContaining({
            choices: model.choices,
            values: {
              0: { label: 'cow', value: '0' },
              1: { label: 'over', value: '0' },
            },
          }),
        );
      });
    });

    describe('getRemainingChoices', () => {
      it('adds an alternate if selecting a choice', () => {
        const testInstance = createTestInstance();

        // Initialize state
        testInstance.updateChoicesIfNeeded({
          model,
          maxLengthPerChoiceEnabled: false,
        });

        const remainingChoices = testInstance.getRemainingChoices();

        expect(remainingChoices).toEqual([{ label: 'moon', value: '2' }]);
      });
    });

    describe('onChoiceChanged', () => {
      it('changes new alternate', () => {
        const testInstance = createTestInstance();

        // Initialize state
        testInstance.updateChoicesIfNeeded({
          model,
          maxLengthPerChoiceEnabled: false,
        });

        testInstance.onChoiceChanged({ label: 'New Choice', value: '1' }, 2);

        expect(onChange).toBeCalledWith({
          ...model.choices,
          2: [
            { label: 'moon', value: '0' },
            { label: 'New Choice', value: '1' },
          ],
        });
      });

      it('changes existing alternate', () => {
        const testInstance = createTestInstance();

        // Initialize state
        testInstance.updateChoicesIfNeeded({
          model,
          maxLengthPerChoiceEnabled: false,
        });

        testInstance.onChoiceChanged({ label: 'New Choice Edited', value: '1' }, 2);

        expect(onChange).toBeCalledWith({
          ...model.choices,
          2: [
            { label: 'moon', value: '0' },
            { label: 'New Choice Edited', value: '1' },
          ],
        });
      });
    });

    describe('onChoiceRemoved', () => {
      it('removes choice from section', () => {
        const testInstance = createTestInstance();

        // Initialize state
        testInstance.updateChoicesIfNeeded({
          model,
          maxLengthPerChoiceEnabled: false,
        });

        testInstance.onChoiceRemoved('1', '1');

        const expectedChoices = {
          ...model.choices,
          1: [
            { label: 'over', value: '0' },
            { label: 'beyond', value: '2' },
          ],
        };

        expect(onChange).toBeCalledWith(expectedChoices);
      });

      it('does not throw error if parameters are not correct', () => {
        const testInstance = createTestInstance();

        // Initialize state
        testInstance.updateChoicesIfNeeded({
          model,
          maxLengthPerChoiceEnabled: false,
        });

        testInstance.onChoiceRemoved('11', '1');

        expect(onChange).toBeCalledWith(model.choices);
      });
    });

    describe('onSectionSelect', () => {
      it('removing a selection', () => {
        const testInstance = createTestInstance({
          choices: {
            0: [
              { label: 'cow', value: '0' },
              { label: 'cattle', value: '1' },
              { label: 'calf', value: '2' },
            ],
            1: [
              { label: 'over', value: '0' },
              { label: 'past', value: '1' },
              { label: 'beyond', value: '2' },
            ],
            2: [{ label: 'moon', value: '0' }],
          },
        });

        // Initialize state
        testInstance.updateChoicesIfNeeded({
          model: {
            ...model,
            choices: {
              0: [
                { label: 'cow', value: '0' },
                { label: 'cattle', value: '1' },
                { label: 'calf', value: '2' },
              ],
              1: [
                { label: 'over', value: '0' },
                { label: 'past', value: '1' },
                { label: 'beyond', value: '2' },
              ],
              2: [{ label: 'moon', value: '0' }],
            },
          },
          maxLengthPerChoiceEnabled: false,
        });

        testInstance.onSectionSelect(undefined, '0');

        expect(onChange).toBeCalledWith({
          0: [{ label: 'cow', value: '0' }],
          1: [
            { label: 'over', value: '0' },
            { label: 'past', value: '1' },
            { label: 'beyond', value: '2' },
          ],
          2: [{ label: 'moon', value: '0' }],
        });
      });

      it('selecting a response', () => {
        const testInstance = createTestInstance();

        // Initialize state
        testInstance.updateChoicesIfNeeded({
          model,
          maxLengthPerChoiceEnabled: false,
        });

        const stateBefore = { ...testInstance.state };

        testInstance.onSectionSelect({ label: 'moon', value: '0' }, '2');

        expect(testInstance.state.choices).toEqual({
          ...stateBefore.choices,
          2: [
            { label: 'moon', value: '0' },
            { label: '', value: '1' },
          ],
        });
        expect(testInstance.state.values).toEqual({
          ...stateBefore.values,
          2: { label: 'moon', value: '0' },
        });
      });
    });
  });
});
