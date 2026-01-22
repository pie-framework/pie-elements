import * as React from 'react';
import { render } from '@testing-library/react';
import { Main } from '../main';

jest.mock('@pie-lib/correct-answer-toggle', () => (props) => <div data-testid="correct-answer-toggle" {...props} />);
jest.mock('@pie-lib/render-ui', () => ({
  Collapsible: (props) => <div data-testid="collapsible">{props.children}</div>,
  Feedback: (props) => <div data-testid="feedback" {...props} />,
  hasText: jest.fn(),
  PreviewPrompt: (props) => <div data-testid="preview-prompt">{props.children}</div>,
  UiLayout: (props) => <div data-testid="ui-layout">{props.children}</div>,
  hasMedia: jest.fn(),
  color: {
    text: () => '#000',
    background: () => '#fff',
    primaryLight: () => '#ccc',
  },
}));
jest.mock('../answer-grid', () => (props) => <div data-testid="answer-grid" {...props} />);

describe('Main', () => {
  const defaultProps = {
    model: {
      id: '1',
      element: 'match-element',
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
      partialScoring: [],
      layout: 3,
      headers: ['Column 1', 'Column 2', 'Column 3'],
      choiceMode: 'radio',
      feedback: {
        correct: {
          type: 'none',
          default: 'Correct',
        },
        partial: {
          type: 'none',
          default: 'Nearly',
        },
        incorrect: {
          type: 'none',
          default: 'Incorrect',
        },
      },
    },
    onSessionChange: jest.fn(),
    session: {},
  };

  const wrapper = (extras) => {
    const props = {
      ...defaultProps,
      ...extras,
    };

    return render(<Main {...props} />);
  };

  const createInstance = (extras) => {
    const props = {
      ...defaultProps,
      ...extras,
    };

    const instance = new Main(props);

    instance.setState = jest.fn((state) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
    });

    return instance;
  };

  it('generates answers correctly from rows', () => {
    const instance = createInstance();

    expect(
      instance.generateAnswers({
        layout: 3,
        rows: [
          {
            id: 1,
            title: 'Question Text 1',
            values: [true, false],
          },
          {
            id: 4,
            title: 'Question Text 2',
            values: [false, true],
          },
          {
            id: 12,
            title: 'Question Text 3',
            values: [false, false],
          },
          {
            id: 9,
            title: 'Question Text 4',
            values: [true, true],
          },
        ],
      }),
    ).toEqual({
      1: [false, false],
      4: [false, false],
      12: [false, false],
      9: [false, false],
    });
  });
});
