import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Choice from '../choice';

jest.mock('@pie-lib/editable-html', () => (props) => <div {...props} />);
jest.mock('@pie-lib/config-ui', () => ({
  NumberTextField: (props) => <input type="number" {...props} />,
}));

const theme = createTheme();

describe('choice', () => {
  let onChange;
  let onDelete;
  let connectDragSource;
  let connectDragPreview;
  let connectDropTarget;

  beforeEach(() => {
    onChange = jest.fn();
    onDelete = jest.fn();
    connectDragSource = jest.fn((el) => el);
    connectDragPreview = jest.fn((el) => el);
    connectDropTarget = jest.fn((el) => el);
  });

  const renderChoice = (extras) => {
    const props = {
      classes: {},
      correctResponseCount: 0,
      className: 'classname',
      choice: {
        content: 'hi',
        id: '1',
      },
      onChange,
      onDelete,
      connectDragSource,
      connectDragPreview,
      connectDropTarget,
      ...extras,
    };

    return render(
      <ThemeProvider theme={theme}>
        <Choice {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderChoice();
      expect(container).toBeInTheDocument();
    });
  });
});

