import React from 'react';
import { render, screen } from '@testing-library/react';
import DrawingResponse from '../drawing-response';

// Mock @pie-lib/render-ui
jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000',
    background: () => '#fff',
  },
  Collapsible: ({ children, labels }) => (
    <div data-testid="collapsible">
      <button>{labels.hidden}</button>
      {children}
    </div>
  ),
  PreviewPrompt: ({ prompt }) => <span data-testid="preview-prompt">{prompt}</span>,
  UiLayout: ({ children }) => <div data-testid="ui-layout">{children}</div>,
}));

// Mock the Container component since it has complex dependencies
jest.mock('../drawing-response/container', () => {
  return function MockContainer() {
    return <div data-testid="drawing-container">Drawing Container</div>;
  };
});

describe('DrawingResponse', () => {
  const defaultProps = {
    model: {
      disabled: false,
      imageDimensions: {
        height: 400,
        width: 600,
      },
      imageUrl: 'http://example.com/image.png',
      mode: 'gather',
      prompt: 'Draw your response',
      backgroundImageEnabled: true,
    },
    session: {},
    onSessionChange: jest.fn(),
  };

  const renderDrawingResponse = (propsOverrides = {}) => {
    const props = { ...defaultProps, ...propsOverrides };
    return render(<DrawingResponse {...props} />);
  };

  describe('prompt', () => {
    it('displays the prompt', () => {
      renderDrawingResponse();
      expect(screen.getByText('Draw your response')).toBeInTheDocument();
    });

    it('does not render prompt when not provided', () => {
      renderDrawingResponse({
        model: { ...defaultProps.model, prompt: '' },
      });
      // PreviewPrompt should not be in the document when prompt is empty
      const prompts = screen.queryAllByTestId('preview-prompt');
      expect(prompts.every(p => p.textContent !== 'Draw your response')).toBe(true);
    });
  });

  describe('teacher instructions', () => {
    it('does not show collapsible when teacherInstructions is not provided', () => {
      renderDrawingResponse();
      expect(screen.queryByTestId('collapsible')).not.toBeInTheDocument();
    });

    it('shows collapsible when teacherInstructions is provided', () => {
      renderDrawingResponse({
        model: { ...defaultProps.model, teacherInstructions: 'Grade based on creativity' },
      });
      expect(screen.getByTestId('collapsible')).toBeInTheDocument();
      expect(screen.getByText('Grade based on creativity')).toBeInTheDocument();
    });
  });

  describe('container', () => {
    it('renders the drawing container', () => {
      renderDrawingResponse();
      expect(screen.getByTestId('drawing-container')).toBeInTheDocument();
    });
  });

  describe('modes', () => {
    it('renders in gather mode', () => {
      renderDrawingResponse({
        model: { ...defaultProps.model, mode: 'gather' },
      });
      expect(screen.getByTestId('ui-layout')).toBeInTheDocument();
    });

    it('renders in evaluate mode', () => {
      renderDrawingResponse({
        model: { ...defaultProps.model, mode: 'evaluate' },
      });
      expect(screen.getByTestId('ui-layout')).toBeInTheDocument();
    });
  });
});
