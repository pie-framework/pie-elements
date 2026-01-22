import React from 'react';
import _ from 'lodash';
import { render } from '@testing-library/react';
import { NumberLine, Graph } from '../index';

describe('NumberLine', () => {
  const mkWrapper = (props, context) => {
    const onMoveElement = jest.fn();
    const onDeleteElements = jest.fn();
    const onAddElement = jest.fn();

    const defaults = {
      classes: {},
      model: {
        graph: {
          domain: { min: 0, max: 1 },
          width: 600,
          ticks: { minor: 0.1, major: 1 },
        },
      },
      onMoveElement,
      onDeleteElements,
      onAddElement,
    };

    props = _.merge(defaults, props);
    return render(<NumberLine {...props} />);
  };

  describe('getSize', () => {
    it('sets default width', () => {
      const { container } = mkWrapper();
      // Component renders with default width of 600
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('sets custom width', () => {
      const { container } = mkWrapper({ model: { graph: { width: 1001 } } });
      // Component renders with custom width of 1001
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});
