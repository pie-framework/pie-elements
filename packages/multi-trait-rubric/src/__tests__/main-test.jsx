import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Main from '../main';

describe('Main', () => {
  let wrapper, model;

  const mkWrapper = (modelOptions = {}) => {
    model = {
      halfScoring: false,
      scales: [
        {
          excludeZero: false,
          maxPoints: 1,
          scorePointsLabels: ['A', 'B'],
          traitLabel: 'Trait',
          traits: []
        }
      ],
      visible: false,
      ...modelOptions
    };

    return mount(<Main model={model}/>);
  };

  beforeEach(() => {
    wrapper = mkWrapper();
  });

  describe('snapshots', () => {
    it('not visible to students => renders empty div', () => {
      const wrapper = mkWrapper();
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('visible to students => renders table without half-scoring', () => {
      const wrapper = mkWrapper({ visible: true });
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('visible to students => renders table with half-scoring', () => {
      const wrapper = mkWrapper({ visible: true, halfScoring: true });
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('visible to students => renders empty div if no scales', () => {
      const wrapper = mkWrapper({ scales: [] });
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
