import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Main from '../main';

// Mock @pie-lib/render-ui
jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000',
    background: () => '#fff',
    primaryDark: () => '#333',
    secondaryBackground: () => '#eee',
  },
  UiLayout: ({ children }) => <div data-testid="ui-layout">{children}</div>,
}));

describe('Main', () => {
  const defaultModel = {
    halfScoring: false,
    scales: [
      {
        excludeZero: false,
        maxPoints: 1,
        scorePointsLabels: ['A', 'B'],
        traitLabel: 'Trait',
        traits: [],
      },
    ],
    visible: false,
  };

  const renderMain = (modelOptions = {}) => {
    const model = { ...defaultModel, ...modelOptions };
    return render(<Main model={model} />);
  };

  describe('visibility', () => {
    it('renders nothing when not visible', () => {
      const { container } = renderMain({ visible: false });
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when scales are empty', () => {
      const { container } = renderMain({ visible: true, scales: [] });
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when scales is undefined', () => {
      const { container } = renderMain({ visible: true, scales: undefined });
      expect(container.firstChild).toBeNull();
    });

    it('renders content when visible with scales', () => {
      renderMain({ visible: true, animationsDisabled: true });
      expect(screen.getByTestId('ui-layout')).toBeInTheDocument();
    });
  });

  describe('rubric toggle (with animations)', () => {
    it('renders "Show Rubric" link when animations enabled', () => {
      renderMain({ visible: true, animationsDisabled: false });
      expect(screen.getByRole('link', { name: /show rubric/i })).toBeInTheDocument();
    });

    it('toggles to "Hide Rubric" when clicked', () => {
      renderMain({ visible: true, animationsDisabled: false });
      const link = screen.getByRole('link', { name: /show rubric/i });
      fireEvent.click(link);
      expect(screen.getByRole('link', { name: /hide rubric/i })).toBeInTheDocument();
    });

    it('toggles back to "Show Rubric" when clicked again', () => {
      renderMain({ visible: true, animationsDisabled: false });
      const link = screen.getByRole('link', { name: /show rubric/i });
      fireEvent.click(link);
      fireEvent.click(screen.getByRole('link', { name: /hide rubric/i }));
      expect(screen.getByRole('link', { name: /show rubric/i })).toBeInTheDocument();
    });
  });

  describe('half scoring', () => {
    it('does not display half-scoring message when halfScoring is false', () => {
      renderMain({ visible: true, halfScoring: false, animationsDisabled: true });
      expect(screen.queryByText(/half-point/i)).not.toBeInTheDocument();
    });

    it('displays half-scoring message when halfScoring is true', () => {
      renderMain({ visible: true, halfScoring: true, animationsDisabled: true });
      expect(screen.getByText(/half-point or in-between scores are permitted/i)).toBeInTheDocument();
    });
  });
});
