import * as React from 'react';
import { render, screen } from '@testing-library/react';
import AddRow from '../add-row';

jest.mock('@mui/material/Button', () => (props) => <button {...props}>{props.children}</button>);
jest.mock('@mui/icons-material/Add', () => () => <div data-testid="add-icon" />);

describe('AddRow', () => {
  const defaultProps = {
    onAddClick: jest.fn(),
    disabled: false,
  };

  it('renders correctly', () => {
    const { container } = render(<AddRow {...defaultProps} />);

    expect(screen.getByText('Add Another Row')).toBeInTheDocument();
    expect(screen.getByTestId('add-icon')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
