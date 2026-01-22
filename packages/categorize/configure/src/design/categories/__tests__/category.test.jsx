import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Category } from '../category';

jest.mock('@pie-lib/editable-html-tip-tap', () => (props) => <div {...props} />);
jest.mock('../droppable-placeholder', () => (props) => <div {...props} />);

const theme = createTheme();

describe('category', () => {
  let onChange = jest.fn();
  let onDelete = jest.fn();
  let onDeleteChoice = jest.fn();
  let onAddChoice = jest.fn();

  beforeEach(() => {
    onChange = jest.fn();
    onDelete = jest.fn();
    onDeleteChoice = jest.fn();
    onAddChoice = jest.fn();
  });

  const renderCategory = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      category: {
        id: '1',
        label: 'Category title',
      },
      configuration: {
        headers: {},
        baseInputConfiguration: {},
      },
      onChange,
      onDelete,
      onDeleteChoice,
      onAddChoice,
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <Category {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders with default props', () => {
      const { container } = renderCategory();
      expect(container).toBeInTheDocument();
    });

    it('renders without some components if no handlers are provided', () => {
      const { container } = renderCategory({
        onChange: undefined,
        onDelete: undefined,
      });
      expect(container).toBeInTheDocument();
    });
  });
});
