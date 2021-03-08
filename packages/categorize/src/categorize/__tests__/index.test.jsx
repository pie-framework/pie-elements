import { shallow } from 'enzyme';
import React from 'react';
import { Categorize } from '../index';

jest.mock('@pie-lib/drag', () => ({
  uid: {
    withUid: jest.fn(a => a),
    Provider: jest.fn(a => a),
    generateId: jest.fn().mockReturnValue('1')
  },
  withDragContext: jest.fn(n => n)
}));

describe('categorize', () => {
  const defaultProps = {
    classes: {},
    session: {
      answers: []
    },
    model: {
      choices: [],
      categories: []
    }
  };
  let onAnswersChange;
  let onShowCorrectToggle;

  beforeEach(() => {
    onAnswersChange = jest.fn();
    onShowCorrectToggle = jest.fn();
  });
  const wrapper = extras => {
    const defaults = {
      ...defaultProps,
      onAnswersChange,
      onShowCorrectToggle
    };
    const props = { ...defaults, ...extras };

    return shallow(<Categorize {...props} />);
  };

  describe('snapshots', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });

    it('renders with feedback', () => {
      expect(wrapper({
        model: {
          ...defaultProps.model,
          correctness: 'correct',
          feedback: {
            correct: {
              type: 'default',
              default: 'Correct'
            },
            incorrect: {
              type: 'default',
              default: 'Incorrect'
            },
            partial: {
              type: 'default',
              default: 'Nearly'
            }
          },
        }
      })).toMatchSnapshot();
    });

    it('incorrect', () => {
      expect(wrapper({ incorrect: true })).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('dropChoice', () => {
      it('calls onAnswersChange', () => {
        const w = wrapper();

        w.instance().dropChoice('1', { id: '1', choiceIndex: 0 });
        expect(onAnswersChange).toBeCalledWith([
          { category: '1', choices: ['1'] }
        ]);
      });
    });

    describe('removeChoice', () => {
      it('calls onAnswersChange', () => {
        const w = wrapper({
          session: { answers: [{ category: '1', choices: ['1'] }] }
        });

        w.instance().removeChoice({ id: '1', categoryId: '1', choiceIndex: 0 });

        expect(onAnswersChange).toBeCalledWith([
          { category: '1', choices: [] }
        ]);
      });
    });

    describe('showAnswers', () => {
      it('calls onShowCorrectToggle', () => {
        const w = wrapper({
          session: { answers: [{ category: '1', choices: ['1'] }] }
        });

        w.instance().toggleShowCorrect();

        expect(onShowCorrectToggle).toHaveBeenCalled();
      });
    });
  });
});
