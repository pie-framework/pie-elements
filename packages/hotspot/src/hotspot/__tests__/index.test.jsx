import React from 'react';
import { render } from '@testing-library/react';
import { renderMath } from '@pie-lib/math-rendering';
import HotspotComponent from '../index';

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));

jest.mock('../container', () => (props) => <div data-testid="container" {...props} />);

describe('HotspotComponent', () => {
  const defaultModel = {
    disabled: false,
    imageUrl: 'http://example.com/image.png',
    prompt: 'prompt',
    mode: 'gather',
    multipleCorrect: false,
    shapes: { rectangles: [], polygons: [], circles: [] },
    dimensions: { width: 800, height: 600 },
    strokeWidth: 5,
  };

  const getWrapper = (props) =>
    render(
      <HotspotComponent
        onSelectChoice={jest.fn()}
        session={{ answers: [] }}
        model={defaultModel}
        {...props}
      />,
    );

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
        <HotspotComponent
          onSelectChoice={jest.fn()}
          session={{ answers: [] }}
          model={{ ...defaultModel, prompt: 'updated prompt' }}
        />,
      );

      expect(renderMath).toHaveBeenCalled();
    });
  });
});
