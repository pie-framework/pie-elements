import React from 'react';
import { render } from '@testing-library/react';
import Matrix from '../Matrix';

describe('Matrix', () => {
  const renderMatrix = (propsToOverride = {}) => {
    const onSessionChange = jest.fn();
    const props = {
      prompt: 'magic prompt',
      teacherInstructions: 'instructions',
      session: {},
      matrixValues: {},
      rowLabels: [],
      columnLabels: [],
      disabled: false,
      onSessionChange,
      ...propsToOverride,
    };
    return render(<Matrix {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = renderMatrix();
      expect(container).toMatchSnapshot();
    });
  });
});
