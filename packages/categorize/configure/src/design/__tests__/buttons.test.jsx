import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { RawAddButton } from '../buttons';

const theme = createTheme();

describe('AddButton', () => {
  let onClick = jest.fn();
  const renderAddButton = (extras) => {
    const defaults = {
      classes: { addButton: 'addButton' },
      className: 'className',
      onClick,
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <RawAddButton {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderAddButton();
      expect(container).toBeInTheDocument();
    });
  });
});
