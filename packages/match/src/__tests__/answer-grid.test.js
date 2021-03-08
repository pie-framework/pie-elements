import * as React from 'react';
import AnswerGrid from '../answer-grid';
import { shallowChild } from '@pie-lib/test-utils';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

describe('AnswerGrid', () => {
  const defaultProps = {
    allowFeedback: false,
    classes: {
      correct: 'correct',
      incorrect: 'incorrect',
    },
    correctAnswers: {
      1: [true, false],
      2: [false, false],
      3: [true, false],
      4: [false, false]
    },
    view: false,
    showCorrect: false,
    disabled: false,
    onAnswerChange: jest.fn(),
    choiceMode: 'radio',
    rows: [{
      id: 1,
      title: 'Question Text 1',
      values: [false, false]
    }, {
      id: 2,
      title: 'Question Text 2',
      values: [false, false]
    }, {
      id: 3,
      title: 'Question Text 3',
      values: [false, false]
    }, {
      id: 4,
      title: 'Question Text 4',
      values: [false, false]
    }],
    headers: ['Column 1', 'Column 2', 'Column 3'],
    answers: {
      1: [false, false],
      2: [false, false],
      3: [true, false],
      4: [false, false]
    },
  };

  let wrapper;
  let component;

  beforeEach(() => {
    wrapper = shallowChild(AnswerGrid, defaultProps, 1);
  });

  it('renders', () => {
    component = wrapper();

    expect(component).toMatchSnapshot();
  });

  it('renders correctly', () => {
    component = wrapper();

    expect(component.find(Radio).length).toEqual(8);
    expect(component.find(Checkbox).length).toEqual(0);
    expect(component.find(Typography).length).toEqual(0);
  });

  it('marks answers if they are correct correctly', () => {
    component = wrapper({
      ...defaultProps,
      allowFeedback: true,
      showCorrect: true,
      disabled: true,
      view: false
    });

    expect(component.instance().answerIsCorrect(1, false, 1)).toEqual(false);
    expect(component.instance().answerIsCorrect(3, true, 0)).toEqual(true);
    expect(component.find(Radio).at(4).props().className.includes('correct')).toEqual(true);
  });

  it('does not show correct answers if feedback is not allowed', () => {
    component = wrapper({
      ...defaultProps,
      allowFeedback: false,
      showCorrect: true,
      disabled: true,
      view: false
    });

    expect(component.instance().answerIsCorrect(1, false, 1)).toEqual(false);
    expect(component.instance().answerIsCorrect(3, true, 0)).toEqual(true);
    expect(component.find(Radio).at(4).props().className.includes('correct')).toEqual(false);
  });

  it('marks answers if they are incorrect correctly', () => {
    component = wrapper({
      ...defaultProps,
      allowFeedback: true,
      showCorrect: true,
      disabled: true,
      view: false
    });

    expect(component.instance().answerIsCorrect(1, false, 1)).toEqual(false);
    expect(component.instance().answerIsCorrect(3, true, 0)).toEqual(true);
    expect(component.find(Radio).at(0).props().className.includes('incorrect')).toEqual(true);
  });

  it('does not show correct answers if feedback is not allowed', () => {
    component = wrapper({
      ...defaultProps,
      allowFeedback: true,
      showCorrect: true,
      disabled: true,
      view: false
    });

    expect(component.instance().answerIsCorrect(1, false, 1)).toEqual(false);
    expect(component.instance().answerIsCorrect(3, true, 0)).toEqual(true);
    expect(component.find(Radio).at(0).props().className.includes('incorrect')).toEqual(true);
  });

});
