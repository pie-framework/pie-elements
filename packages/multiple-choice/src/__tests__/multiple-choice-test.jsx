import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import { MultipleChoice, Choice } from '../multiple-choice';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';


describe('Choice', () => {
  let wrapper, onChoiceChanged = jest.fn();

  beforeEach(() => {
    wrapper = extras => {
      const props = {
        classes: {},
        choice: {},
        index: 0,
        choicesLength: 1,
        showCorrect: false,
        isEvaluateMode: false,
        choiceMode: 'radio',
        disabled: true,
        onChoiceChanged,
        checked: true,
        correctness: 'correct',
        displayKey: '0',
        ...extras
      };
      return shallow(<Choice {...props}/>);
    };
  });

  describe('snapshot', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('does not call onChoiceChanged if disabled is true', () => {
      let w = wrapper();

      w.instance().onChange();

      expect(onChoiceChanged).not.toHaveBeenCalled();
    });

    it('calls onChoiceChanged if disabled is false', () => {
      let w = wrapper({ disabled: false });

      w.instance().onChange();

      expect(onChoiceChanged).toHaveBeenCalled();
    });
  });
});

describe('CorespringChoice', () => {
  let wrapper, toggle;

  beforeEach(() => {
    toggle = () => {
      return <div>mocked-toggle</div>;
    };
  });

  let mkWrapper = (opts, clone = true) => {
    opts = clone
      ? (opts = _.merge(
        {
          classes: {},
          choices: [],
          disabled: false,
          keyMode: 'letters',
          onChoiceChanged: jest.fn(),
          mode: 'gather'
        },
        opts
      ))
      : opts;

    return shallow(<MultipleChoice {...opts} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      wrapper = mkWrapper({
        choices: [
          { value: 'a', label: 'label a', correct: true, feedback: 'great' },
          { value: 'b', label: 'label b' },
          { value: 'c', label: 'label c', correct: true, feedback: 'great' }
        ]
      });

      expect(wrapper).toMatchSnapshot();
    });

    describe('renders incorrect tick if one answer is correct but it is not checked', () => {
      it('renders', () => {
        let w = mkWrapper({
          mode: 'evaluate',
          keyMode: 'none',
          choices: [
            { value: 'a', label: 'label a', correct: true, feedback: 'great' },
            { value: 'b', label: 'label b' },
            { value: 'c', label: 'label c', correct: true, feedback: 'great' }
          ],
          session: {
            value: ['a']
          }
        });

        expect(w).toMatchSnapshot();
      });
    });

    describe('getCorrectness', () => {
      let itemChoices = [
        { value: 'a', label: 'label a', correct: true, feedback: 'great' },
        { value: 'b', label: 'label b' },
        { value: 'c', label: 'label c', feedback: 'great' },
        { value: 'd', label: 'label d', correct: true, feedback: 'great' }
      ];
      let w = mkWrapper({
        mode: 'evaluate',
        choices: itemChoices,
        session: {
          value: ['a', 'c']
        }
      });

      describe('showCorrectToggle disabled (state.showCorrect is false)', () => {
        it('shows choice correctness only if was checked', () => {
          // this one was selected and is correct
          expect(w.instance().getCorrectness(itemChoices[0])).toEqual('correct');
          // this one was not selected and is incorrect
          expect(w.instance().getCorrectness(itemChoices[1])).toEqual(undefined);
          // this one was selected, but is incorrect
          expect(w.instance().getCorrectness(itemChoices[2])).toEqual('incorrect');
          // this one was not selected and is correct
          expect(w.instance().getCorrectness(itemChoices[3])).toEqual('incorrect');
        });
      });

      describe('showCorrectToggle enabled (state.showCorrect is true)', () => {
        it('shows choice correctness no matter if was checked or not', () => {
          w.instance().state.showCorrect = true;

          // this one is correct
          expect(w.instance().getCorrectness(itemChoices[0])).toEqual('correct');
          // this one is not correct
          expect(w.instance().getCorrectness(itemChoices[1])).toEqual(undefined);
          // this one is not correct
          expect(w.instance().getCorrectness(itemChoices[2])).toEqual(undefined);
          // this one is correct
          expect(w.instance().getCorrectness(itemChoices[3])).toEqual('correct');
        });
      });
    });

    describe('onToggle', () => {
      it('toggles the state', () => {
        let w = mkWrapper({ mode: 'evaluate' });
        expect(w.state('showCorrect')).toEqual(false);
        w.instance().onToggle();
        expect(w.state('showCorrect')).toEqual(true);
      });
    });

    describe('Toggle', () => {
      it('toggle is rendered', () => {
        const t = mkWrapper().find(CorrectAnswerToggle);
        expect(t.length).toEqual(1);
      });

      it('toggle show is set to false', () => {
        expect(
          mkWrapper()
            .find(CorrectAnswerToggle)
            .prop('show')
        ).toEqual(false);
      });

      it('shows toggle if mode is evaluate, feedback is enabled and responseCorrect is false', () => {
        expect(
          mkWrapper({ mode: 'evaluate', responseCorrect: false, feedbackEnabled: true })
            .find(CorrectAnswerToggle)
            .prop('show')
        ).toEqual(true);
      });

      it('hides toggle if mode is evaluate and responseCorrect is false', () => {
        expect(
          mkWrapper({ mode: 'evaluate', responseCorrect: true })
            .find(CorrectAnswerToggle)
            .prop('show')
        ).toEqual(false);
      });

      it('not toggled if showCorrect is false', () => {
        let w = mkWrapper({ mode: 'evaluate' });
        w.setState({ showCorrect: false });
        expect(w.find(CorrectAnswerToggle).prop('toggled')).toEqual(false);
      });

      it('is toggled showCorrect=true && mode=evaluate', () => {
        let w = mkWrapper({ mode: 'evaluate' });
        w.setState({ showCorrect: true });
        expect(w.find(CorrectAnswerToggle).prop('toggled')).toEqual(true);
      });
    });
  });
});
