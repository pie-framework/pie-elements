import * as React from 'react';
import { render } from '@testing-library/react';
import { AnswerGrid } from '../answer-grid';

jest.mock('@mui/material/Radio', () => (props) => <input type="radio" {...props} />);
jest.mock('@mui/material/Checkbox', () => (props) => <input type="checkbox" {...props} />);
jest.mock('@mui/material/Typography', () => (props) => <div {...props}>{props.children}</div>);
jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000',
    background: () => '#fff',
    primaryLight: () => '#ccc',
    primary: () => '#1976d2',
    disabled: () => '#999',
    correct: () => '#00c853',
    incorrect: () => '#d32f2f',
  },
}));

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
      4: [false, false],
    },
    view: false,
    showCorrect: false,
    disabled: false,
    onAnswerChange: jest.fn(),
    choiceMode: 'radio',
    rows: [
      {
        id: 1,
        title: 'Question Text 1',
        values: [false, false],
      },
      {
        id: 2,
        title: 'Question Text 2',
        values: [false, false],
      },
      {
        id: 3,
        title: 'Question Text 3',
        values: [false, false],
      },
      {
        id: 4,
        title: 'Question Text 4',
        values: [false, false],
      },
    ],
    headers: ['Column 1', 'Column 2', 'Column 3'],
    answers: {
      1: [false, false],
      2: [false, false],
      3: [true, false],
      4: [false, false],
    },
  };

  const wrapper = (extras) => {
    const props = {
      ...defaultProps,
      ...extras,
    };

    return render(<AnswerGrid {...props} />);
  };

  const createInstance = (extras) => {
    const props = {
      ...defaultProps,
      ...extras,
    };

    const instance = new AnswerGrid(props);

    instance.setState = jest.fn((state) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
    });

    return instance;
  };

  it('renders correctly', () => {
    const { container } = wrapper();

    expect(container.querySelectorAll('input[type="radio"]').length).toEqual(8);
    expect(container.querySelectorAll('input[type="checkbox"]').length).toEqual(0);
  });

  it('marks answers if they are correct correctly', () => {
    const instance = createInstance({
      allowFeedback: true,
      showCorrect: true,
      disabled: true,
      view: false,
    });

    expect(instance.answerIsCorrect(1, false, 1)).toEqual(false);
    expect(instance.answerIsCorrect(3, true, 0)).toEqual(true);
  });

  it('marks answers if they are incorrect correctly', () => {
    const instance = createInstance({
      allowFeedback: true,
      showCorrect: true,
      disabled: true,
      view: false,
    });

    expect(instance.answerIsCorrect(1, false, 1)).toEqual(false);
    expect(instance.answerIsCorrect(3, true, 0)).toEqual(true);
  });

  it('does not show correct answers if feedback is not allowed', () => {
    const instance = createInstance({
      allowFeedback: true,
      showCorrect: true,
      disabled: true,
      view: false,
    });

    expect(instance.answerIsCorrect(1, false, 1)).toEqual(false);
    expect(instance.answerIsCorrect(3, true, 0)).toEqual(true);
  });
});
