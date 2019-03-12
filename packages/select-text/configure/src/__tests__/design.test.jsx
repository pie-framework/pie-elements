import { shallow } from 'enzyme';
import React from 'react';
import { Design } from '../design';
import defaultValues from '../defaultConfiguration';
describe('design', () => {
  let w;
  let onChange;
  let onPromptChanged;

  const getModel = () => ({
    tokens: [],
    configure: defaultValues
  });
  beforeEach(() => {
    onChange = jest.fn();
    onPromptChanged = jest.fn();
    w = shallow(
      <Design
        model={getModel()}
        classes={{}}
        className={'foo'}
        onChange={onChange}
        onPromptChanged={onPromptChanged}
      />
    );
  });

  describe('snapshot', () => {
    it('renders all items with defaultProps', () => {
      expect(w).toMatchSnapshot();
    });

    it('renders all items except feedback', () => {
      const defaultModel = getModel();

      defaultModel.configure.enableFeedback = false;

      const wrapper = shallow(
        <Design
          model={getModel()}
          classes={{}}
          className={'foo'}
          onChange={onChange}
          onPromptChanged={onPromptChanged}
        />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('renders all items except the content input', () => {
      const defaultModel = getModel();

      defaultModel.configure.enableContentChange = false;

      const wrapper = shallow(
        <Design
          model={getModel()}
          classes={{}}
          className={'foo'}
          onChange={onChange}
          onPromptChanged={onPromptChanged}
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
    describe('changeHighlight', () => {
      assert('changeHighlight', [], m => ({ ...m, highlightChoices: true }));
    });
    describe('changeFeedback', () => {
      assert('changeFeedback', [{ correctFeedbackType: 'none' }], m => ({
        ...m,
        feedback: { correctFeedbackType: 'none' }
      }));
    });
  });
});
