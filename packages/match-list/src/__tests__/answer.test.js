import * as React from 'react';
import { render } from '@testing-library/react';
import { Answer } from '../answer';
import { model } from '../../docs/demo/config';

jest.mock('@pie-lib/drag', () => ({
  PlaceHolder: (props) => <div data-testid="placeholder">{props.children}</div>,
}));
jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000',
    white: () => '#fff',
    correct: () => '#00c853',
    incorrect: () => '#d32f2f',
  },
}));

describe('Answer', () => {
  const defaultProps = {
    model: model('1'),
    session: {},
    classes: {},
  };

  const wrapper = (props = {}) => {
    return render(<Answer {...defaultProps} {...props} />);
  };

  describe('render', () => {
    it('renders correctly', () => {
      const { container } = wrapper();
      expect(container).toMatchSnapshot();
    });
  });
});
