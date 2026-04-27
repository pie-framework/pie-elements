import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Header } from '../header';

const theme = createTheme();

describe('Header', () => {
  let onAdd = jest.fn();
  const renderHeader = (extras) => {
    const defaults = {
      classes: {
        header: 'header',
      },
      label: 'Header',
      className: 'className',
      onAdd,
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <Header {...props} />
      </ThemeProvider>
    );
  };
  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderHeader();
      expect(container).toBeInTheDocument();
    });
  });
});
