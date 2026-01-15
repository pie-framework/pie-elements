import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import DroppablePlaceHolder from '../droppable-placeholder';

jest.mock('../choice-preview', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => <div>{props.choice && props.choice.content}</div>,
  };
});

const theme = createTheme();

describe('DroppablePlaceholder', () => {
  let connectDropTarget = jest.fn((o) => o);
  let onDropChoice = jest.fn();
  let onDeleteChoice = jest.fn();

  beforeEach(() => {
    connectDropTarget = jest.fn((o) => o);
    onDropChoice = jest.fn();
    onDeleteChoice = jest.fn();
  });

  const renderPlaceholder = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onDeleteChoice,
      onDropChoice,
      connectDropTarget,
      categoryId: '1',
      choices: [{ id: '1', content: 'content' }],
    };
    const props = {
      ...defaults,
      ...extras,
    };
    return render(
      <ThemeProvider theme={theme}>
        <DroppablePlaceHolder {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderPlaceholder();
      expect(container).toBeInTheDocument();
    });

    it('renders helper when no choices', () => {
      const { container } = renderPlaceholder({ choices: [] });
      expect(container).toBeInTheDocument();
    });
  });
});

