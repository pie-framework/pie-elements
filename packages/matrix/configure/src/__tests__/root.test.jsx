import { render } from '@testing-library/react';
import React from 'react';

import { Main } from '../Main';
import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: (props) => <div data-testid="input-container" {...props}>{props.children}</div>,
  settings: {
    Panel: (props) => <div data-testid="settings-panel" {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
  },
  layout: {
    ConfigLayout: (props) => <div data-testid="config-layout">{props.children}</div>,
  },
}));

jest.mock('@pie-lib/editable-html', () => (props) => (
  <div data-testid="editable-html" {...props}>{props.children}</div>
));

jest.mock('../MatrixColumnsSizeHeaderInput', () => (props) => (
  <div data-testid="matrix-columns-size-header-input" {...props} />
));

jest.mock('../MatrixRowsSizeHeaderInput', () => (props) => (
  <div data-testid="matrix-rows-size-header-input" {...props} />
));

jest.mock('../MatrixLabelTypeHeaderInput', () => (props) => (
  <div data-testid="matrix-label-type-header-input" {...props} />
));

jest.mock('../MatrixValues', () => (props) => (
  <div data-testid="matrix-values" {...props} />
));

const model = (extras) => ({
  ...defaults.model,
  configure: {},
  ...extras,
});

describe('Main', () => {
  let onModelChanged;
  let onConfigurationChanged;
  let initialModel;

  const defaultProps = {
    classes: {},
    model: model(),
  };

  const wrapper = (extras) => {
    const props = {
      ...defaultProps,
      onModelChanged,
      onConfigurationChanged,
      ...extras
    };

    return render(<Main {...props} />);
  };

  const createInstance = (extras) => {
    const props = {
      ...defaultProps,
      onModelChanged,
      onConfigurationChanged,
      ...extras,
    };
    return new Main(props);
  };

  beforeEach(() => {
    onModelChanged = jest.fn();
    onConfigurationChanged = jest.fn();
    initialModel = model();
  });

  describe('snapshot', () => {
    it('renders with default values', () => {
      const { container } = wrapper();
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('onRemoveRowLabel', () => {
      it('removes a row label', () => {
        const instance = createInstance();
        instance.onChangeModel({
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
        const instance = createInstance();
        instance.onChangeModel({
          ...initialModel,
          rowLabels: ["I'm interested in politics.", "I'm interested in economics.", 'c'],
        });

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          rowLabels: ["I'm interested in politics.", "I'm interested in economics.", 'c'],
        });
      });
    });

    describe('onRemoveColumnLabel', () => {
      it('removes a row label', () => {
        const instance = createInstance();
        instance.onChangeModel({
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
        const instance = createInstance();
        instance.onChangeModel({
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
        const instance = createInstance();
        instance.onPromptChanged('New Prompt');

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          prompt: 'New Prompt',
        });
      });
    });

    describe('onTeacherInstructionsChanged', () => {
      it('changes teacher instructions', () => {
        const instance = createInstance();
        instance.onTeacherInstructionsChanged('New Teacher Instructions');

        expect(onModelChanged).toBeCalledWith({
          ...initialModel,
          teacherInstructions: 'New Teacher Instructions',
        });
      });
    });
  });
});
