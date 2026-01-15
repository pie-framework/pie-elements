import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Main from '../main';

jest.mock('../draggable-calculator', () => {
  return function DraggableCalculator() {
    return <div data-testid="draggable-calculator">Draggable Calculator</div>;
  };
});

jest.mock('../calculator-icon', () => {
  return function CalculatorIcon() {
    return <svg data-testid="calculator-icon">Icon</svg>;
  };
});

const theme = createTheme();

test('render a calculator component', () => {
  const model = { mode: 'basic' };
  const { container } = render(
    <ThemeProvider theme={theme}>
      <Main model={model} />
    </ThemeProvider>
  );
  expect(container).toBeInTheDocument();
});
