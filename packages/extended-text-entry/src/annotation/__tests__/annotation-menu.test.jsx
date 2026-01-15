import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import AnnotationMenu from '../annotation-menu';

const theme = createTheme();

describe('freeform editor', () => {
  const defaultProps = {
    classes: {},
    anchorEl: {},
    open: false,
    annotations: [],
    isNewAnnotation: false
  };
  let onClose;
  let onDelete;
  let onEdit;
  let onWrite;
  let onAnnotate;

  beforeEach(() => {
    onClose = jest.fn();
    onDelete = jest.fn();
    onEdit = jest.fn();
    onWrite = jest.fn();
    onAnnotate = jest.fn();
  });

  const wrapper = extras => {
    const defaults = {
      ...defaultProps,
      onClose,
      onDelete,
      onEdit,
      onWrite,
      onAnnotate
    };
    const props = { ...defaults, ...extras };

    return render(
      <ThemeProvider theme={theme}>
        <AnnotationMenu { ...props } />
      </ThemeProvider>
    );
  };

  describe('snapshots', () => {
    it('renders', () => {
      const { container } = wrapper();
      expect(container).toMatchSnapshot();
    });

    it('opened', () => {
      const { container } = wrapper({ open: true });
      expect(container).toMatchSnapshot();
    });

    it('opened and new annotation selected', () => {
      const { container } = wrapper({ open: true, isNewAnnotation: true });
      expect(container).toMatchSnapshot();
    });
  });
});
