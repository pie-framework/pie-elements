import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Scale from '../scale';

describe('Scale', () => {
  let wrapper, scale;

  const mkWrapper = (scaleOptions = {}) => {
    scale = {
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
        }
      ],
      ...scaleOptions
    };

    return mount(<Scale
      scale={scale}
      scaleIndex={1}
      classes={{}}
    />);
  };

  beforeEach(() => {
    wrapper = mkWrapper();
  });

  describe('snapshots', () => {
    it('renders without 0', () => {
      const wrapper = mkWrapper({ excludeZero: true });
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with 0', () => {
      const wrapper = mkWrapper();
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with no score points', () => {
      const wrapper = mkWrapper({ excludeZero: true, maxPoints: 0 });
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with no traits', () => {
      const wrapper = mkWrapper({ traits: [] });
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
