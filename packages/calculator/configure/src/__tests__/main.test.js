import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Main } from '../main';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  TwoChoice: (props) => (
    <div data-testid="two-choice" data-value={props.value}>
      {props.header}
    </div>
  ),
}));

jest.mock('@pie-element/calculator', () => ({
  CalculatorLayout: (props) => <div data-testid="calculator-layout" data-mode={props.mode} />,
}));

const theme = createTheme();

describe('Render a calculator element', () => {
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
  });

  const renderMain = (model = { mode: 'basic' }) => {
    return render(
      <ThemeProvider theme={theme}>
        <Main model={model} onChange={onChange} />
      </ThemeProvider>
    );
  };

  it('renders without crashing', () => {
    const { container } = renderMain();
    expect(container).toBeInTheDocument();
  });

  describe('onModeChange', () => {
    it('calls onChange', () => {
      const { container } = renderMain();
      // Test the method directly by creating an instance
      const mainInstance = new Main({
        model: { mode: 'basic' },
        onChange,
      });

      mainInstance.onModeChange('scientific');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({ mode: 'scientific' });
    });
  });
});
