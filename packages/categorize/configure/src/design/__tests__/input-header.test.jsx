import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { InputHeader } from '../input-header';

jest.mock('@pie-lib/editable-html-tip-tap', () => (props) => <div {...props} />);

const theme = createTheme();

describe('InputHeader', () => {
  let onChange = jest.fn();
  let onDelete = jest.fn();
  const renderInputHeader = (extras) => {
    const defaults = {
      classes: { inputHeader: 'inputHeader', editor: 'editor' },
      className: 'className',
      onChange,
      onDelete,
    };
    const props = { ...defaults, ...extras, configuration: {} };
    return render(
      <ThemeProvider theme={theme}>
        <InputHeader {...props} />
      </ThemeProvider>
    );
  };
  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderInputHeader();
      expect(container).toBeInTheDocument();
    });
  });
});
