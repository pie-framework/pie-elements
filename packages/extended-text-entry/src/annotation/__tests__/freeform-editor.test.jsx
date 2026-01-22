import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import FreeformEditor from '../freeform-editor';

const theme = createTheme();

describe('freeform editor', () => {
  const defaultProps = {
    classes: {},
    anchorEl: {},
    open: false,
    offset: 10,
    value: 'note',
    type: 'positive'
  };
  let onClose;
  let onDelete;
  let onSave;
  let onTypeChange;

  beforeEach(() => {
    onClose = jest.fn();
    onDelete = jest.fn();
    onSave = jest.fn();
    onTypeChange = jest.fn();
  });

  const wrapper = extras => {
    const defaults = {
      ...defaultProps,
      onClose,
      onDelete,
      onSave,
      onTypeChange
    };
    const props = { ...defaults, ...extras };

    return render(
      <ThemeProvider theme={theme}>
        <FreeformEditor { ...props } />
      </ThemeProvider>
    );
  };

  describe('logic', () => {
    describe('save or autosave', () => {
      it('calls onSave',  () => {
        const testInstance = new FreeformEditor({
          ...defaultProps,
          onClose,
          onDelete,
          onSave,
          onTypeChange
        });

        testInstance.state = { value: 'good' };
        testInstance.handleSave();
        expect(onSave).toBeCalled();
      });

      it('calls onDelete', () => {
        const testInstance = new FreeformEditor({
          ...defaultProps,
          onClose,
          onDelete,
          onSave,
          onTypeChange
        });

        testInstance.state = { value: '' };
        testInstance.handleSave();
        expect(onDelete).toBeCalled();
      });

      it('calls onClose', () => {
        const testInstance = new FreeformEditor({
          ...defaultProps,
          onClose,
          onDelete,
          onSave,
          onTypeChange
        });

        testInstance.state = { value: 'note' };
        testInstance.handleSave();
        expect(onClose).toBeCalled();
      });
    });

    describe('type change', () => {
      it('calls onTypeChange',  () => {
        const testInstance = new FreeformEditor({
          ...defaultProps,
          onClose,
          onDelete,
          onSave,
          onTypeChange,
          value: 'note'
        });

        testInstance.state = { value: 'note' };
        testInstance.handleTypeChange();
        expect(onTypeChange).toBeCalledWith('note');
      });

      it('calls onTypeChange with changed value',  () => {
        const testInstance = new FreeformEditor({
          ...defaultProps,
          onClose,
          onDelete,
          onSave,
          onTypeChange
        });

        testInstance.state = { value: 'good' };
        testInstance.handleTypeChange();
        expect(onTypeChange).toBeCalledWith('good');
      });

      it('calls onDelete', () => {
        const testInstance = new FreeformEditor({
          ...defaultProps,
          onClose,
          onDelete,
          onSave,
          onTypeChange
        });

        testInstance.state = { value: '' };
        testInstance.handleTypeChange();
        expect(onDelete).toBeCalled();
      });
    });
  });
});
