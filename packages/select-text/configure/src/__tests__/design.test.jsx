import { render } from '@testing-library/react';
import React from 'react';
import { Design } from '../design';
import defaultValues from '../defaultConfiguration';

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: (props) => <div data-testid="input-container">{props.children}</div>,
  NumberTextField: (props) => <input data-testid="number-text-field" {...props} />,
  FeedbackConfig: (props) => <div data-testid="feedback-config" />,
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div data-testid="settings-panel" onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn(),
  },
}));

jest.mock('lodash/debounce', () => (fn) => fn);

describe('design', () => {
  let w;
  let onChange;
  let onPromptChanged;
  let onRationaleChanged;

  const getModel = () => ({
    tokens: [],
  });

  const createInstance = (props = {}) => {
    const defaultProps = {
      model: getModel(),
      configuration: defaultValues.configuration,
      classes: {},
      className: 'foo',
      onModelChanged: onChange,
      onPromptChanged: onPromptChanged,
      onRationaleChanged: onRationaleChanged,
      ...props,
    };
    const instance = new Design(defaultProps);
    instance.setState = jest.fn((state, callback) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
      if (callback) callback();
    });
    return instance;
  };

  beforeEach(() => {
    onChange = jest.fn();
    onPromptChanged = jest.fn();
    onRationaleChanged = jest.fn();
    w = render(
      <Design
        model={getModel()}
        configuration={defaultValues.configuration}
        classes={{}}
        className={'foo'}
        onModelChanged={onChange}
        onPromptChanged={onPromptChanged}
        onRationaleChanged={onRationaleChanged}
      />,
    );
  });

  describe('logic', () => {
    const assert = (fn, args, expected) => {
      const e = expected(getModel());

      it(`${fn} ${JSON.stringify(args)} => ${JSON.stringify(e)}`, () => {
        const instance = createInstance();
        instance[fn].apply(instance, args);

        expect(onChange).toBeCalledWith(e);
      });
    };

    describe('changeText', () => {
      assert('changeText', [{ target: { value: 'foo' } }], (m) => ({
        ...m,
        text: 'foo',
      }));
    });

    describe('changeTokens', () => {
      assert('changeTokens', [[{ start: 0, end: 1, text: 'f' }], 'words'], (m) => ({
        ...m,
        maxSelections: 0,
        tokens: [{ start: 0, end: 1, text: 'f' }],
        mode: 'words',
      }));
      assert('changeTokens', [[{ start: 0, end: 8, text: 'Foo bar.', correct: true }], 'sentences'], (m) => ({
        ...m,
        maxSelections: 1,
        tokens: [{ start: 0, end: 8, text: 'Foo bar.', correct: true }],
        mode: 'sentences',
      }));
    });

    describe('changeMaxSelections', () => {
      assert('changeMaxSelections', [{}, 4], (m) => ({
        ...m,
        maxSelections: 4,
      }));
    });

    describe('changeFeedback', () => {
      assert('changeFeedback', [{ correctFeedbackType: 'none' }], (m) => ({
        ...m,
        feedback: { correctFeedbackType: 'none' },
      }));
    });

    describe('changePartialScoring', () => {
      assert('changePartialScoring', [true], (m) => ({
        ...m,
        partialScoring: true,
      }));
    });

    describe('changePrompt', () => {
      assert('onPromptChanged', ['New Prompt'], (m) => ({
        ...m,
        prompt: 'New Prompt',
      }));
    });

    describe('changeTeacherInstructions', () => {
      assert('onTeacherInstructionsChanged', ['New Teacher Instructions'], (m) => ({
        ...m,
        teacherInstructions: 'New Teacher Instructions',
      }));
    });

    describe('changeRationale', () => {
      assert('onRationaleChanged', ['New Rationale'], (m) => ({
        ...m,
        rationale: 'New Rationale',
      }));
    });
  });
});
