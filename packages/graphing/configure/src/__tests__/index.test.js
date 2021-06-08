import defaultValues from '../defaults';
import GraphLinesConfigure from '../index';

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: props => <div>{props.children}</div>,
  InputCheckbox: props => <div>{props.children}</div>,
  FeedbackConfig: props => <div>{props.children}</div>,
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  },
  settings: {
    Panel: props => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    numberFields: jest.fn(),
    checkboxes: jest.fn()
  }
}));

describe('createDefaultModel', () => {

  it('createDefaultModel should return ordered object, with correctAnswer first, if answers has correctAnswer key', () => {
    const model = defaultValues.model;

    model.answers = {
      aCorrectAnswer: {
        name: 'Correct Answer',
        marks: [{
          type: 'point',
          x: 0,
          y: 0
        }]
      },
      correctAnswer: {
        name: 'Correct Answer',
        marks: [{
          type: 'point',
          x: 0,
          y: 0
        }]
      },
      alternate1: {
        name: 'Alternate 1',
        marks: [{
          type: 'segment',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 },
        },
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Point',
          showLabel: true
        }]
      }
    };

    const orderedAnswers = {
      correctAnswer: {
        name: 'Correct Answer',
        marks: [{
          type: 'point',
          x: 0,
          y: 0
        }]
      },
      aCorrectAnswer: {
        name: 'Correct Answer',
        marks: [{
          type: 'point',
          x: 0,
          y: 0
        }]
      },
      alternate1: {
        name: 'Alternate 1',
        marks: [{
          type: 'segment',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 },
        },
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Point',
          showLabel: true
        }]
      }
    };

    expect(GraphLinesConfigure.createDefaultModel(model).answers).toEqual(orderedAnswers);
  })

  it('createDefaultModel should return alphabetically ordered object if answers does not have correctAnswer key', () => {
    const model = defaultValues.model;

    model.answers = {
      aCorrectAnswer: {
        name: 'Correct Answer',
        marks: [{
          type: 'point',
          x: 0,
          y: 0
        }]
      },
      alternate2: {
        name: 'Correct Answer',
        marks: [{
          type: 'point',
          x: 0,
          y: 0
        }]
      },
      alternate1: {
        name: 'Alternate 1',
        marks: [{
          type: 'segment',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 },
        },
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Point',
          showLabel: true
        }]
      }
    };

    const sortedAnswers = {
      aCorrectAnswer: {
        name: 'Correct Answer',
        marks: [{
          type: 'point',
          x: 0,
          y: 0
        }]
      },
      alternate1: {
        name: 'Alternate 1',
        marks: [{
          type: 'segment',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 },
        },
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Point',
          showLabel: true
        }]
      },
      alternate2: {
        name: 'Correct Answer',
        marks: [{
          type: 'point',
          x: 0,
          y: 0
        }]
      },
    };

    expect(GraphLinesConfigure.createDefaultModel(model).answers).toEqual(sortedAnswers);
  })
});
