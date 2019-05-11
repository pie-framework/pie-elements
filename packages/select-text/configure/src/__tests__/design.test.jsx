import { shallow } from 'enzyme';
import React from 'react';
import { Design } from '../design';
import defaultValues from '../defaultConfiguration';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  },
  settings: {
    Panel: props => <div oChangeModel={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn()
  }
}));


describe('design', () => {
  let w;
  let onChange;
  let onPromptChanged;
  let onRationaleChanged;

  const getModel = () => ({
    tokens: [],
  });
  beforeEach(() => {
    onChange = jest.fn();
    onPromptChanged = jest.fn();
    onRationaleChanged = jest.fn();
    w = shallow(
      <Design
        model={getModel()}
        configuration={defaultValues.configuration}
        classes={{}}
        className={'foo'}
        onModelChanged={onChange}
        onPromptChanged={onPromptChanged}
        onRationaleChanged={onRationaleChanged}
      />
    );
  });

  describe('snapshot', () => {
    it('renders all items with defaultProps', () => {
      expect(w).toMatchSnapshot();
    });

    it('renders all items except feedback', () => {
      const defaultConfiguration = defaultValues.configuration;

      defaultConfiguration.feedback.settings = false;

      const wrapper = shallow(
        <Design
          model={getModel()}
          configuration={defaultConfiguration}
          classes={{}}
          className={'foo'}
          onModelChanged={onChange}
          onPromptChanged={onPromptChanged}
          onRationaleChanged={onRationaleChanged}
        />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('renders all items except the content input', () => {
      const defaultConfiguration = defaultValues.configuration;

      defaultConfiguration.text.settings = false;

      const wrapper = shallow(
        <Design
          model={getModel()}
          configuration={defaultConfiguration}
          classes={{}}
          className={'foo'}
          onModelChanged={onChange}
          onPromptChanged={onPromptChanged}
          onRationaleChanged={onRationaleChanged}
        />
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    const assert = (fn, args, expected) => {
      const e = expected(getModel());
      it(`${fn} ${JSON.stringify(args)} => ${JSON.stringify(e)}`, () => {
        const instance = w.instance();
        instance[fn].apply(instance, args);
        expect(onChange).toBeCalledWith(e);
      });
    };

    describe('changeText', () => {
      assert('changeText', [{ target: { value: 'foo' } }], m => ({
        ...m,
        text: 'foo'
      }));
    });

    describe('changeTokens', () => {
      assert(
        'changeTokens',
        [[{ start: 0, end: 1, text: 'f' }], 'words'],
        m => ({
          ...m,
          maxSelections: 0,
          tokens: [{ start: 0, end: 1, text: 'f' }],
          mode: 'words'
        })
      );
      assert(
        'changeTokens',
        [[{ start: 0, end: 8, text: 'Foo bar.', correct: true }], 'sentences'],
        m => ({
          ...m,
          maxSelections: 1,
          tokens: [{ start: 0, end: 8, text: 'Foo bar.', correct: true }],
          mode: 'sentences'
        })
      );
    });

    describe('changeMaxSelections', () => {
      assert('changeMaxSelections', [{}, 4], m => ({ ...m, maxSelections: 4 }));
    });

    describe('changeFeedback', () => {
      assert('changeFeedback', [{ correctFeedbackType: 'none' }], m => ({
        ...m,
        feedback: { correctFeedbackType: 'none' }
      }));
    });

    describe('changePartialScoring', () => {
      assert('changePartialScoring', [true], m => ({
        ...m,
        partialScoring: true
      }));
    });

    describe('changePrompt', () => {
      assert('onPromptChanged', ['New Prompt'], m => ({
        ...m,
        prompt: 'New Prompt'
      }));
    });

    describe('changeRationale', () => {
      assert('onRationaleChanged', ['New Rationale'], m => ({
        ...m,
        rationale: 'New Rationale'
      }));
    });


  });
});
