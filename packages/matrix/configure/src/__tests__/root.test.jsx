import { shallow } from 'enzyme';
import React from 'react';

import { Main } from '../Main';
import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  settings: {
    Panel: (props) => <div {...props} />,
  },
}));

const model = (extras) => ({
  ...defaults.model,
  configure: {},
  ...extras,
});

describe('Main', () => {
  let w;
  let onModelChanged = jest.fn();
  let onConfigurationChanged = jest.fn();
  let initialModel = model();

  const wrapper = (extras) => {
    const defaults = {
      onModelChanged,
      onConfigurationChanged,
      classes: {},
      model: model(),
    };
    const props = { ...defaults, ...extras };

    return shallow(<Main {...props} />);
  };

  describe('snapshot', () => {
    it('renders with default values', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    beforeEach(() => {
      w = wrapper();
    });
    describe('onRemoveRowLabel', () => {
      it('removes a row label', () => {
        w.instance().onChangeModel({
          ...initialModel,
          rowLabels: ['I am interested in politics.'],
        });

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          rowLabels: ['I am interested in politics.'],
        });
      });
    });

    describe('onAddRowLabel', () => {
      it('adds a row label', () => {
        w.instance().onChangeModel({
          ...initialModel,
          rowLabels: [
            "I'm interested in politics.",
            "I'm interested in economics.",
            'c',
          ],
        });

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          rowLabels: [
            "I'm interested in politics.",
            "I'm interested in economics.",
            'c',
          ],
        });
      });
    });

    describe('onRemoveColumnLabel', () => {
      it('removes a row label', () => {
        w.instance().onChangeModel({
          ...initialModel,
          columnLabels: ['Disagree', 'Unsure'],
        });

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          columnLabels: ['Disagree', 'Unsure'],
        });
      });
    });

    describe('onAddColumnLabel', () => {
      it('adds a column label', () => {
        w.instance().onChangeModel({
          ...initialModel,
          columnLabels: ['Disagree', 'Unsure', 'Agree', 'a'],
        });

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          columnLabels: ['Disagree', 'Unsure', 'Agree', 'a'],
        });
      });
    });

    describe('onPromptChanged', () => {
      it('changes prompt', () => {
        w.instance().onPromptChanged('New Prompt');

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          prompt: 'New Prompt',
        });
      });
    });

    describe('onTeacherInstructionsChanged', () => {
      it('changes teacher instructions', () => {
        w.instance().onTeacherInstructionsChanged('New Teacher Instructions');

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          teacherInstructions: 'New Teacher Instructions',
        });
      });
    });
  });
});
