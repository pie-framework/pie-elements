import * as React from 'react';
import { render } from '@testing-library/react';
import { Main } from '../main';
import { model } from '../../docs/demo/config';

jest.mock('../answer-area', () => (props) => <div data-testid="answer-area" {...props} />);
jest.mock('../choices-list', () => (props) => <div data-testid="choices-list" {...props} />);
jest.mock('@pie-lib/correct-answer-toggle', () => (props) => <div data-testid="correct-answer-toggle" {...props} />);
jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000',
    background: () => '#fff',
  },
  Feedback: (props) => <div data-testid="feedback" {...props} />,
  PreviewPrompt: (props) => <div data-testid="preview-prompt">{props.children}</div>,
}));
jest.mock('@pie-lib/drag', () => ({
  swap: (value, from, to) => {
    const newValue = { ...value };
    const temp = newValue[from];
    newValue[from] = newValue[to];
    newValue[to] = temp;
    return newValue;
  },
}));

describe('Main', () => {
  const onSessionChange = jest.fn();
  const defaultProps = {
    model: model('1'),
    session: {
      value: [1, 4, 3, 2],
    },
    classes: {},
    onSessionChange,
  };

  const wrapper = (props = {}) => {
    return render(<Main {...defaultProps} {...props} />);
  };

  const createInstance = (props = {}) => {
    const instanceProps = {
      ...defaultProps,
      ...props,
    };
    const instance = new Main(instanceProps);
    instance.setState = jest.fn((state) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
    });
    return instance;
  };

  describe('render', () => {
    it('renders correctly', () => {
      const { container } = wrapper();
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('onRemoveAnswer', () => {
      it('should call onSessionChange with appropriate values', () => {
        const instance = createInstance();
        instance.onRemoveAnswer(0);
        expect(onSessionChange).toHaveBeenCalledWith({
          value: [undefined, 4, 3, 2],
        });
      });
    });

    describe('onPlaceAnswer', () => {
      it('should call onSessionChange with appropriate values', () => {
        const instance = createInstance();
        instance.onPlaceAnswer({
          active: {
            data: {
              current: { type: 'choice', id: 5 },
            },
          },
          over: {
            data: {
              current: { type: 'drop-zone', promptId: 0 },
            },
          },
        });
        expect(onSessionChange).toHaveBeenCalled();
      });
    });

    describe('toggleShowCorrect', () => {
      it('should change state the value for showCorrectAnswer to true', () => {
        const instance = createInstance();
        instance.toggleShowCorrect();
        expect(instance.state.showCorrectAnswer).toBe(true);
      });
    });
  });
});
