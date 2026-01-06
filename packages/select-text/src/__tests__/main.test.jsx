import { render } from '@testing-library/react';
import React from 'react';
import { Main } from '../main';

jest.mock('@pie-lib/text-select', () => ({
  prepareText: jest.fn(),
  TextSelect: (props) => <div data-testid="text-select" {...props} />,
  Legend: (props) => <div data-testid="legend" {...props} />,
}));

describe('main', () => {
  const getWrapper = (props) => {
    return render(
      <Main
        onSelectionChange={jest.fn()}
        model={{
          text: 'foo',
          tokens: [{ start: 0, end: 1, text: 'f' }],
        }}
        session={{
          selectedTokens: [{ start: 0, end: 1, text: 'f' }],
        }}
        classes={{}}
        {...props}
      />,
    );
  };

  const createInstance = (props = {}) => {
    const defaultProps = {
      onSelectionChange: jest.fn(),
      model: {
        text: 'foo',
        tokens: [{ start: 0, end: 1, text: 'f' }],
      },
      session: {
        selectedTokens: [{ start: 0, end: 1, text: 'f' }],
      },
      classes: {},
      ...props,
    };
    const instance = new Main(defaultProps);
    instance.setState = jest.fn((state, callback) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
      if (callback) callback();
    });
    instance.props = defaultProps;
    return instance;
  };

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = getWrapper();
      expect(container).toMatchSnapshot();
    });

    it('renders rationale', () => {
      const { container } = getWrapper({ rationale: 'This is rationale ' });
      expect(container).toMatchSnapshot();
    });

    it('renders showCorrect', () => {
      const instance = createInstance();
      instance.toggleShowCorrect();
      const { container } = render(<Main {...instance.props} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('shows correct answer', () => {
      const correctTokens = [{ start: 0, end: 1, text: 'f', correct: true, oldStart: 0, oldEnd: 1 }];
      const instance = createInstance({
        model: { text: 'foo', tokens: correctTokens },
      });
      const result = instance.correctAnswer();
      expect(result).toEqual(correctTokens);
    });
  });
});
