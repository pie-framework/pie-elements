import defaultValues from '../defaults';
import GraphLinesConfigure from '../index';

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: (props) => <div>{props.children}</div>,
  InputCheckbox: (props) => <div>{props.children}</div>,
  FeedbackConfig: (props) => <div>{props.children}</div>,
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    numberFields: jest.fn(),
    checkboxes: jest.fn(),
  },
}));

describe('createDefaultModel', () => {
  it('createDefaultModel should return ordered object, with correctAnswer first, if answers has correctAnswer key', () => {
    const model = defaultValues.model;

    model.answers = {
      correctAnswer: {
        name: 'Correct Answer',
        marks: [
          {
            type: 'line',
            from: { x: 0, y: 0 },
            to: { x: 1, y: 1 },
            fill: 'Solid',
          },
        ],
      },
    };

    const orderedAnswers = {
      correctAnswer: {
        name: 'Correct Answer',
        marks: [
          {
            type: 'line',
            from: { x: 0, y: 0 },
            to: { x: 1, y: 1 },
            fill: 'Solid',
          },
        ],
      },
    };

    expect(GraphLinesConfigure.createDefaultModel(model).answers).toEqual(orderedAnswers);
  });
});
