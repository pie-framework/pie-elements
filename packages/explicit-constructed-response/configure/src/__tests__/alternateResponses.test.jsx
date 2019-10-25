import { shallow } from 'enzyme';
import React from 'react';

import { AlternateResponses } from '../alternateResponses';
import sensibleDefaults from '../defaults';
import { createSlateMarkup, processMarkup } from '../markupUtils';

const model = {
  markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>',
  disabled: false,
  choices: {
    0: [{ label: 'cow', value: '0' }, { label: 'cattle', value: '1' }, { label: 'calf', value: '2' }],
    1: [{ label: 'over', value: '0' }, { label: 'past', value: '1' }, { label: 'beyond', value: '2' }],
    2: [{ label: 'moon', value: '0' }]
  },
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
    markup: processedMarkup
  };
};

describe('AlternateResponses', () => {
  let onChange = jest.fn();

  const wrapper = extras => {
    const defaults = {
      onChange,
      classes: {},
      model: prepareModel({
        ...model,
        ...extras
      })
    };
    const props = { ...defaults };

    return shallow(<AlternateResponses {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w;

    beforeEach(() => {
      w = wrapper();
    });

    describe('updateChoicesIfNeeded', () => {
      it('sets state, updates edited choice', () => {
        const newChoices = {
          0: [{ label: 'cow', value: '0' }, { label: 'cattle', value: '1' }, { label: 'calf', value: '2' }],
          1: [{ label: 'under', value: '0' }, { label: 'past', value: '1' }, { label: 'beyond', value: '2' }],
          2: [{ label: 'moon', value: '0' }]
        };

        w.instance().updateChoicesIfNeeded({
          model: {
            ...model,
            choices: newChoices,
          }
        });

        expect(w.instance().state).toEqual(expect.objectContaining({
          choices: newChoices,
          values: {
            0: { label: 'cow', value: '0' },
            1: { label: 'under', value: '0' }
          }
        }));
      });

      it('sets state, if a choice has an alternate', () => {
        const newChoices = {
          0: [{ label: 'cow', value: '0' }, { label: 'cattle', value: '1' }, { label: 'calf', value: '2' }],
          1: [{ label: 'under', value: '0' }, { label: 'past', value: '1' }, { label: 'beyond', value: '2' }],
          2: [{ label: 'sun', value: '0' }, { label: 'star', value: '1' }]
        };

        w.instance().updateChoicesIfNeeded({
          model: {
            ...model,
            choices: newChoices,
          }
        });

        expect(w.instance().state).toEqual(expect.objectContaining({
          choices: newChoices,
          values: {
            0: { label: 'cow', value: '0' },
            1: { label: 'under', value: '0' },
            2: { label: 'sun', value: '0' }
          }
        }));
      });

      it('sets state if some choices are removed', () => {
        const newChoices = {
          0: [{ label: 'cow', value: '0' }, { label: 'cattle', value: '1' }, { label: 'calf', value: '2' }],
        };

        w.instance().updateChoicesIfNeeded({
          model: {
            ...model,
            choices: newChoices,
          }
        });

        expect(w.instance().state).toEqual(expect.objectContaining({
          choices: newChoices,
          values: {
            0: { label: 'cow', value: '0' }
          }
        }));
      });

      it('does not change state', () => {
        w.instance().updateChoicesIfNeeded({ model });

        expect(w.instance().state).toEqual(expect.objectContaining({
          choices: model.choices,
          values: {
            0: { label: 'cow', value: '0' },
            1: { label: 'over', value: '0' }
          }
        }));
      });
    });

    describe('getRemainingChoices', () => {
      it('adds an alternate if selecting a choice', () => {
        const remainingChoices = w.instance().getRemainingChoices();

        expect(remainingChoices).toEqual([
          { label: 'moon', value: '2' }
        ]);
      });
    });

    describe('onChoiceChanged', () => {
      it('changes new alternate', () => {
        w.instance().onChoiceChanged({ label: 'New Choice', value: '1' }, 2);

        expect(onChange).toBeCalledWith({
            ...model.choices,
            2: [{ label: 'moon', value: '0' }, { label: 'New Choice', value: '1' }]
          }
        );
      });

      it('changes existing alternate', () => {
        w.instance().onChoiceChanged({ label: 'New Choice Edited', value: '1' }, 2);

        expect(onChange).toBeCalledWith({
            ...model.choices,
            2: [{ label: 'moon', value: '0' }, { label: 'New Choice Edited', value: '1' }]
          }
        );
      });
    });

    describe('onChoiceRemoved', () => {
      it('removes choice from section', () => {
        const choices = w.instance().props.model.choices;

        w.instance().onChoiceRemoved('1', '1');

        choices[1] = [{ label: 'over', value: '0' }, { label: 'beyond', value: '2' }];

        expect(onChange).toBeCalledWith(choices);
      });

      it('does not throw error if parameters are not correct', () => {
        const choices = w.instance().props.model.choices;

        w.instance().onChoiceRemoved('11', '1');

        expect(onChange).toBeCalledWith(choices);
      });
    });

    describe('onSectionSelect', () => {
      it('removing a selection', () => {
        const choices = w.instance().props.model.choices;

        w.instance().onSectionSelect(undefined, '0');

        expect(onChange).toBeCalledWith({
          ...choices,
          '0': [{ label: 'cow', value: '0' }]
        });
      });

      it('selecting a response', () => {
        const state = w.instance().state;

        w.instance().onSectionSelect({ label: 'moon', value: '0' }, '2');

        expect(w.instance().state.choices).toEqual({
          ...state.choices,
          '2': [{ label: 'moon', value: '0' }, { label: '', value: '1' }]
        });
        expect(w.instance().state.values).toEqual({
          ...state.values,
          2: { label: 'moon', value: '0' }
        });
      });
    });
  });
});
