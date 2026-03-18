import React from 'react';
import { render, screen } from '@testing-library/react';
import Trait from '../trait';

// Mock @pie-lib/render-ui
jest.mock('@pie-lib/render-ui', () => ({
  color: {
    primaryDark: () => '#333',
    secondaryBackground: () => '#eee',
  },
}));

describe('Trait', () => {
  const defaultTrait = {
    name: 'Trait 1',
    description: 'Trait 1 Description',
    scorePointsDescriptors: ['Descriptor 0', 'Descriptor 1'],
    standards: ['Standard A', 'Standard B'],
  };

  const defaultOptions = {
    scorePointsValues: [0, 1],
    showStandards: true,
    showDescription: true,
  };

  const renderTrait = (traitOptions = {}, options = {}) => {
    const trait = { ...defaultTrait, ...traitOptions };
    const props = { ...defaultOptions, ...options };

    // Trait renders a <tr>, so we need a table wrapper
    return render(
      <table>
        <tbody>
          <Trait trait={trait} traitIndex={1} scaleIndex={1} {...props} />
        </tbody>
      </table>
    );
  };

  describe('trait name', () => {
    it('displays the trait name', () => {
      renderTrait();
      expect(screen.getByText('Trait 1')).toBeInTheDocument();
    });
  });

  describe('standards', () => {
    it('displays standards when showStandards is true', () => {
      renderTrait();
      expect(screen.getByText('Standard A,Standard B')).toBeInTheDocument();
    });

    it('does not display standards when showStandards is false', () => {
      renderTrait({}, { showStandards: false });
      expect(screen.queryByText('Standard A,Standard B')).not.toBeInTheDocument();
    });
  });

  describe('description', () => {
    it('displays description when showDescription is true', () => {
      renderTrait();
      expect(screen.getByText('Trait 1 Description')).toBeInTheDocument();
    });

    it('does not display description when showDescription is false', () => {
      renderTrait({}, { showDescription: false });
      expect(screen.queryByText('Trait 1 Description')).not.toBeInTheDocument();
    });
  });

  describe('score point descriptors', () => {
    it('displays score point descriptors', () => {
      renderTrait();
      expect(screen.getByText('Descriptor 0')).toBeInTheDocument();
      expect(screen.getByText('Descriptor 1')).toBeInTheDocument();
    });

    it('displays "No Description" when descriptor is empty', () => {
      renderTrait({ scorePointsDescriptors: [] });
      const noDescriptions = screen.getAllByText('No Description');
      expect(noDescriptions.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('handles empty scorePointsValues', () => {
      const { container } = renderTrait({}, { scorePointsValues: [] });
      expect(container.querySelector('tbody tr')).toBeInTheDocument();
    });

    it('renders without crashing when trait is partially defined', () => {
      renderTrait({ name: 'Only Name', description: '', scorePointsDescriptors: [], standards: [] });
      expect(screen.getByText('Only Name')).toBeInTheDocument();
    });
  });
});
