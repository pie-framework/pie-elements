import * as React from 'react';
import { render } from '@testing-library/react';
import { Arrow } from '../arrow';

jest.mock('@mui/icons-material/ArrowDropDown', () => (props) => <div data-testid="arrow-head" {...props} />);

describe('Arrow', () => {
  const wrapper = (props = {}) => {
    return render(<Arrow classes={{}} {...props} />);
  };

  describe('render', () => {
    it('renders correctly for default direction', () => {
      const { container } = wrapper();
      expect(container).toMatchSnapshot();
    });

    it('renders correctly for direction left', () => {
      const { container } = wrapper({ direction: 'left' });
      expect(container).toMatchSnapshot();
    });
  });
});
