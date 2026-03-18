import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Main from '../main';

jest.mock('@pie-lib/text-select', () => ({
  prepareText: jest.fn(),
}));

const theme = createTheme();

describe('main', () => {
  const renderMain = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <Main
          onSessionChange={jest.fn()}
          model={{}}
          session={{}}
          {...props}
        />
      </ThemeProvider>
    );
  };

  it('renders without crashing', () => {
    const { container } = renderMain();
    expect(container).toBeInTheDocument();
  });
});
