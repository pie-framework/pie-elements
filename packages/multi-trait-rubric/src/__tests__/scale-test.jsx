import React from 'react';
import { render } from '@testing-library/react';

import Scale from '../scale';

describe('Scale', () => {
  const mkWrapper = (scaleOptions = {}) => {
    const scale = {
      excludeZero: false,
      maxPoints: 1,
      scorePointsLabels: ['A', 'B'],
      traitLabel: 'Trait',
      traits: [
        {
          name: 'Trait 1',
          description: 'Trait 1 Description',
          scorePointsDescriptors: ['Descriptor 0', 'Descriptor 1'],
          standards: [],
        },
      ],
      ...scaleOptions,
    };

    return render(<Scale scale={scale} scaleIndex={1} classes={{}} />);
  };

  describe('snapshots', () => {
    it('renders without 0', () => {
      const { container } = mkWrapper({ excludeZero: true });
      expect(container).toMatchSnapshot();
    });

    it('renders with 0', () => {
      const { container } = mkWrapper();
      expect(container).toMatchSnapshot();
    });

    it('renders with no score points', () => {
      const { container } = mkWrapper({ excludeZero: true, maxPoints: 0 });
      expect(container).toMatchSnapshot();
    });

    it('renders with no traits', () => {
      const { container } = mkWrapper({ traits: [] });
      expect(container).toMatchSnapshot();
    });
  });
});
