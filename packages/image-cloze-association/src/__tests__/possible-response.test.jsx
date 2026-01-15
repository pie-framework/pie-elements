import React from 'react';
import { render } from '@testing-library/react';

import PossibleResponse from '../possible-response';

jest.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    setNodeRef: jest.fn(),
    attributes: {},
    listeners: {},
  }),
}));

describe('Possible Response', () => {
  const mkWrapper = (opts = {}) => {
    opts = {
      canDrag: false,
      containerStyle: {},
      data: { id: '1', value: 'test', containerIndex: 0 },
      onDragBegin: jest.fn(),
      ...opts,
    };

    return render(<PossibleResponse {...opts} />);
  };

  describe('snapshots', () => {
    describe('canDrag', () => {
      it('renders', () => {
        const { container } = mkWrapper({ canDrag: false });
        expect(container).toMatchSnapshot();
      });
    });

    describe('data', () => {
      it('renders', () => {
        const { container } = mkWrapper({ data: { id: 1, value: '1', containerIndex: 0 } });
        expect(container).toMatchSnapshot();
      });
    });
  });
});
