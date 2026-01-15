import React from 'react';
import { render } from '@testing-library/react';

import Trait from '../trait';

describe('Trait', () => {
  const mkWrapper = (traitOptions = {}, showOptions = {}) => {
    const trait = {
      name: 'Trait 1',
      description: 'Trait 1 Description',
      scorePointsDescriptors: ['Descriptor 0', 'Descriptor 1'],
      standards: ['a', 'b'],
      ...traitOptions,
    };

    const options = {
      scorePointsValues: [0, 1],
      showStandards: true,
      showDescription: true,
      ...showOptions,
    };

    return render(<Trait trait={trait} traitIndex={1} scaleIndex={1} {...options} />);
  };

  describe('snapshots', () => {
    it('renders without standards, description and scorePointsValues', () => {
      const { container } = mkWrapper({}, { showStandards: false, showDescription: false, scorePointsValues: [] });
      expect(container).toMatchSnapshot();
    });

    it('renders without scorePointsDescriptors', () => {
      const { container } = mkWrapper({ scorePointsDescriptors: [] }, {});
      expect(container).toMatchSnapshot();
    });
  });
});
