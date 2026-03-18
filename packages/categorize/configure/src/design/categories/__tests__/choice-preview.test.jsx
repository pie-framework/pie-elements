import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ChoicePreview } from '../choice-preview';

jest.mock('@pie-lib/drag', () => ({
  DraggableChoice: (props) => (
    <div>
      <button onClick={props.onRemoveChoice}>Remove</button>
      {props.choice.content}
    </div>
  ),
}));

jest.mock('@pie-lib/render-ui', () => ({
  HtmlAndMath: (props) => <div>{props.text}</div>,
  color: {
    tertiary: () => '#000',
  },
}));

const theme = createTheme();

describe('ChoicePreview', () => {
  let onDelete = jest.fn();

  beforeEach(() => {
    onDelete = jest.fn();
  });

  const renderChoicePreview = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      choice: {
        content: 'content',
        id: '1',
      },
      onDelete,
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <ChoicePreview {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderChoicePreview();
      expect(container).toBeInTheDocument();
    });
  });
});
