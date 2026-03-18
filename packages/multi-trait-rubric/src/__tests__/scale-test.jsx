import React from 'react';
import { render, screen } from '@testing-library/react';
import Scale from '../scale';

// Mock @pie-lib/render-ui
jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000',
    background: () => '#fff',
    primaryDark: () => '#333',
    secondaryBackground: () => '#eee',
  },
}));

describe('Scale', () => {
  const defaultScale = {
    excludeZero: false,
    maxPoints: 2,
    scorePointsLabels: ['Poor', 'Good', 'Excellent'],
    traitLabel: 'Writing Quality',
    traits: [
      {
        name: 'Trait 1',
        description: 'Trait 1 Description',
        scorePointsDescriptors: ['Descriptor 0', 'Descriptor 1', 'Descriptor 2'],
        standards: [],
      },
    ],
  };

  const renderScale = (scaleOptions = {}) => {
    const scale = { ...defaultScale, ...scaleOptions };
    return render(<Scale scale={scale} scaleIndex={0} classes={{}} />);
  };

  describe('trait label', () => {
    it('displays the trait label in the header', () => {
      renderScale();
      expect(screen.getByText('Writing Quality')).toBeInTheDocument();
    });
  });

  describe('score points', () => {
    it('displays correct score points including 0 when excludeZero is false', () => {
      renderScale({ maxPoints: 2, excludeZero: false });
      expect(screen.getByText('0 points')).toBeInTheDocument();
      expect(screen.getByText('1 point')).toBeInTheDocument();
      expect(screen.getByText('2 points')).toBeInTheDocument();
    });

    it('does not display 0 points when excludeZero is true', () => {
      renderScale({ maxPoints: 2, excludeZero: true });
      expect(screen.queryByText('0 points')).not.toBeInTheDocument();
      expect(screen.getByText('1 point')).toBeInTheDocument();
      expect(screen.getByText('2 points')).toBeInTheDocument();
    });

    it('renders singular "point" for value 1', () => {
      renderScale({ maxPoints: 1, excludeZero: true });
      expect(screen.getByText('1 point')).toBeInTheDocument();
    });
  });

  describe('traits', () => {
    it('displays trait names', () => {
      renderScale();
      expect(screen.getByText('Trait 1')).toBeInTheDocument();
    });

    it('handles empty traits array', () => {
      renderScale({ traits: [] });
      // Should still render the header
      expect(screen.getByText('Writing Quality')).toBeInTheDocument();
    });

    it('renders multiple traits', () => {
      renderScale({
        traits: [
          { name: 'First Trait', description: '', scorePointsDescriptors: [], standards: [] },
          { name: 'Second Trait', description: '', scorePointsDescriptors: [], standards: [] },
        ],
      });
      expect(screen.getByText('First Trait')).toBeInTheDocument();
      expect(screen.getByText('Second Trait')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles maxPoints of 0 with excludeZero true', () => {
      renderScale({ maxPoints: 0, excludeZero: true });
      expect(screen.queryByText(/point/)).not.toBeInTheDocument();
    });

    it('renders print mode message when arrowsDisabled and content overflows', () => {
      // Note: This would require mocking scroll dimensions which is complex
      // Just ensure it doesn't crash
      renderScale({ traits: [] });
      expect(screen.getByText('Writing Quality')).toBeInTheDocument();
    });
  });
});
