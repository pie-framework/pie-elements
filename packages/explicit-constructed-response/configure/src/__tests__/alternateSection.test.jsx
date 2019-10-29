import { shallow } from 'enzyme';
import React from 'react';

import { AlternateSection, Choice } from '../alternateSection';

const choices = [{ label: 'cow', value: '0' }, { label: 'cattle', value: '1' }, { label: 'calf', value: '2' }];

describe('Choice', () => {
  let onChange = jest.fn();
  let onDelete = jest.fn();

  const wrapper = () => {
    const defaults = {
      classes: {},
      key: '0',
      markup: 'cow',
      onChange,
      onDelete,
    };
    const props = { ...defaults };

    return shallow(<Choice {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('calls onChange', () => {
      const w = wrapper();

      w.instance().onChange({ target: { value: 'TEST' } });

      setTimeout(() => {
        expect(onChange).toHaveBeenCalledWith('TEST');
      }, 400);
    });
  });
});

describe('AlternateSection', () => {
  let onSelect = jest.fn();
  let choiceChanged = jest.fn();
  let choiceRemoved = jest.fn();

  const wrapper = () => {
    const defaults = {
      classes: {},
      key: '0',
      value: 'cow',
      onSelect,
      choiceChanged,
      choiceRemoved,
      selectChoices: [{ label: 'moon', value: '2' }],
      choices
    };
    const props = { ...defaults };

    return shallow(<AlternateSection {...props} />);
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
      it('does not set state', () => {
        w.instance().updateChoicesIfNeeded({ choices });

        expect(w.instance().state).toEqual(expect.objectContaining({ choices }));
      });

      it('sets state, updates edited choice', () => {
        const newChoices = [
          { label: 'cow', value: '0' },
          { label: 'cattle', value: '1' },
          { label: 'little calf', value: '2' }
        ];

        w.instance().updateChoicesIfNeeded({ choices: newChoices });

        expect(w.instance().state).toEqual(expect.objectContaining({
          choices: newChoices,
        }));
      });

      it('sets state, updates adding new choice', () => {
        const newChoices = [
          { label: 'cow', value: '0' },
          { label: 'cattle', value: '1' },
          { label: 'little calf', value: '2' }
        ];

        w.instance().updateChoicesIfNeeded({ choices: newChoices });

        expect(w.instance().state).toEqual(expect.objectContaining({
          choices: newChoices,
        }));
      });

      it('sets state, updates removing choice', () => {
        const newChoices = [
          { label: 'cow', value: '0' },
          { label: 'cattle', value: '1' }
        ];

        w.instance().updateChoicesIfNeeded({ choices: newChoices });

        expect(w.instance().state).toEqual(expect.objectContaining({
          choices: newChoices,
        }));
      });
    });

    describe('handleSelect', () => {
      it('calls onSelect', () => {
        w.instance().handleSelect({ target: { value: '2' }});

        expect(onSelect).toBeCalledWith({ label: 'moon', value: '2' });
      });
    });

    describe('onAddChoice', () => {
      it('adds choice', () => {
        const state = w.instance().state;

        w.instance().onAddChoice();

        expect(w.instance().state.choices).toEqual([
          ...state.choices,
          { value: '3', label: '' }
        ]);
      });

      it('does not add choice if previously added choice is empty', () => {
        const state = w.instance().state;

        w.instance().onAddChoice();

        state.choices.push({ value: '3', label: '' });

        expect(w.instance().state.choices).toEqual(state.choices);

        w.instance().onAddChoice();

        expect(w.instance().state.choices).toEqual(state.choices);
      });
    });

    describe('onChoiceChanged', () => {
      it('calls choiceChanged', () => {
        w.instance().onChoiceChanged({ value: '0', label: 'cow' }, 'New value');

        expect(choiceChanged).toBeCalledWith({ value: '0', label: 'New value' });
      });
    });

    describe('onRemoveChoice', () => {
      it('calls choiceRemoved', () => {
        w.instance().onRemoveChoice({ value: '0', label: 'cow' });

        expect(choiceRemoved).toBeCalledWith('0');
      });
    });
  });
});
