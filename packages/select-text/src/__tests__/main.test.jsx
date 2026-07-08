import { render } from '@testing-library/react';
import React from 'react';
import { renderMath } from '@pie-lib/math-rendering';
import { Main } from '../main';

jest.mock('@pie-lib/text-select', () => ({
  prepareText: jest.fn(),
  TextSelect: (props) => <div data-testid="text-select" {...props} />,
  Legend: (props) => <div data-testid="legend" {...props} />,
}));

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
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

  beforeEach(() => {
    renderMath.mockClear();
  });

  describe('math rendering', () => {
    it('calls renderMath on mount', () => {
      getWrapper();
      expect(renderMath).toHaveBeenCalled();
    });

    it('passes the rendered dom node to renderMath on mount', () => {
      getWrapper();
      expect(renderMath).toHaveBeenCalledWith(expect.any(HTMLElement));
    });

    it('calls renderMath again on update', () => {
      const { rerender } = getWrapper();
      renderMath.mockClear();

      rerender(
        <Main
          onSelectionChange={jest.fn()}
          model={{
            text: 'bar',
            tokens: [{ start: 0, end: 1, text: 'b' }],
          }}
          session={{
            selectedTokens: [{ start: 0, end: 1, text: 'b' }],
          }}
          classes={{}}
        />,
      );

      expect(renderMath).toHaveBeenCalled();
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
