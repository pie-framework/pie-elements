import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Trait from '../trait';

describe('Trait', () => {
  let wrapper, trait, options;

  const mkWrapper = (traitOptions = {}, showOptions = {}) => {
    trait = {
      name: 'Trait 1',
      description: 'Trait 1 Description',
      scorePointsDescriptors: ['Descriptor 0', 'Descriptor 1'],
      standards: ['a', 'b'],
      ...traitOptions
    };

    options = {
      scorePointsValues: [0, 1],
      showStandards: true,
      showDescription: true,
      ...showOptions
    };

    return mount(<Trait
      trait={trait}
      traitIndex={1}
      scaleIndex={1}
      {...options}
    />);
  };

  beforeEach(() => {
    wrapper = mkWrapper();
  });

  describe('snapshots', () => {
    it('renders without standards, description and scorePointsValues', () => {
      const wrapper = mkWrapper({}, { showStandards: false, showDescription: false, scorePointsValues: [] });
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders without scorePointsDescriptors', () => {
      const wrapper = mkWrapper({ scorePointsDescriptors: [] }, {});
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
