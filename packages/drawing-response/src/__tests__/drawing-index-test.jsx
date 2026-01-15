import React from 'react';
import { render } from '@testing-library/react';
import DrawingResponse from '../drawing-response';

describe('DrawingResponse', () => {
  const mkWrapper = (opts = {}) => {
    const defaultProps = {
      model: {
        disabled: false,
        imageDimensions: {
          height: 0,
          width: 0,
        },
        imageUrl: '',
        mode: 'gather',
        prompt: 'This is the question prompt',
      },
      ...opts,
    };

    return render(<DrawingResponse {...defaultProps} />);
  };

  describe('snapshots', () => {
    it('renders', () => {
      const { container } = mkWrapper();
      expect(container).toMatchSnapshot();
    });
  });
});
