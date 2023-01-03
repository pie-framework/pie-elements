import { shallow } from 'enzyme';
import React from 'react';
import { Main } from '../main';

import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
}));

jest.mock('@pie-lib/rubric', () => ({
  RUBRIC_TYPES: {
    SIMPLE_RUBRIC: 'simpleRubric',
    MULTI_TRAIT_RUBRIC: 'multiTraitRubric',
  },
}));

const model = (extras) => ({
  id: '1',
  element: 'complex-rubric',
  ...defaults.model,
  ...extras,
});

describe('Main', () => {
  let initialModel = model();
  let onModelChanged = jest.fn();
  let onConfigurationChanged = jest.fn();

  const wrapper = (extras) => {
    const defaults = {
      onModelChanged,
      onConfigurationChanged,
      classes: {},
      model: model(extras),
      configuration: {
        multiTraitrubric: {
          showStandards: {
            settings: false,
            label: 'Show Standards',
            enabled: false,
          },
          showExcludeZero: {
            settings: true,
            label: 'Exclude Zero',
            enabled: false,
          },
          showScorePointLabels: {
            settings: true,
            label: 'Show Score Point Labels',
            enabled: false,
          },
          showLevelTagInput: {
            settings: true,
            label: 'Show Level Tag Input',
            enabled: false,
          },
          showDescription: {
            settings: true,
            label: 'Show Description',
            enabled: false,
          },
          showVisibleToStudent: {
            settings: true,
            label: 'Visible to Student',
            enabled: false,
          },
          showHalfScoring: {
            settings: true,
            label: 'Half Scoring',
            enabled: false,
          },
          dragAndDrop: {
            settings: false,
            label: 'Enable Drag and Drop',
            enabled: false,
          },
        },
      },
    };
    const props = { ...defaults };

    return shallow(<Main {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('renders simple rubric', () => {
      const w = wrapper({ rubricType: 'simpleRubric' });
      expect(w).toMatchSnapshot();
    });

    it('renders multi trait rubric', () => {
      const w = wrapper({ rubricType: 'multiTraitRubric' });
      expect(w).toMatchSnapshot();
    });

    it('calls onModelChange when changing rubric type', () => {
      const w = wrapper();
      w.instance().onChangeRubricType({ target: { value: 'multiTraitRubric' } });
      expect(onModelChanged).toBeCalledWith({ ...initialModel, rubricType: 'multiTraitRubric' });
    });
  });
});
