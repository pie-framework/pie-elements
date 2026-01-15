import React from 'react';
import { render } from '@testing-library/react';

import Main from '../main';

describe('Main', () => {
  const mkWrapper = (modelOptions = {}) => {
    const model = {
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
      ...modelOptions,
    };

    return render(<Main model={model} />);
  };

  describe('snapshots', () => {
    it('not visible to students => renders empty div', () => {
      const { container } = mkWrapper();
      expect(container).toMatchSnapshot();
    });

    it('visible to students => renders table without half-scoring', () => {
      const { container } = mkWrapper({ visible: true });
      expect(container).toMatchSnapshot();
    });

    it('visible to students => renders table with half-scoring', () => {
      const { container } = mkWrapper({ visible: true, halfScoring: true });
      expect(container).toMatchSnapshot();
    });

    it('visible to students => renders empty div if no scales', () => {
      const { container } = mkWrapper({ scales: [] });
      expect(container).toMatchSnapshot();
    });
  });
});
