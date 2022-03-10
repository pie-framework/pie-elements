import { shallow } from 'enzyme';
import React from 'react';
import FreeformEditor from '../freeform-editor';
import { unwrap } from "@material-ui/core/test-utils";

const Editor = unwrap(FreeformEditor);

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

    return shallow(<Editor { ...props } />);
  };

  describe('snapshots', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });

    it('opened', () => {
      expect(wrapper({ open: true })).toMatchSnapshot();
    });

    it('opened, negative type', () => {
      expect(
        wrapper({ open: true, type: 'negative' })
      ).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('save or autosave', () => {
      it('calls onSave',  () => {
        const w = wrapper();

        w.setState({ value: 'good' });
        w.instance().handleSave();
        expect(onSave).toBeCalled();
      });

      it('calls onDelete', () => {
        const w = wrapper();

        w.setState({ value: '' });
        w.instance().handleSave();
        expect(onDelete).toBeCalled();
      });

      it('calls onClose', () => {
        const w = wrapper();

        w.setState({ value: 'note' });
        w.instance().handleSave();
        expect(onClose).toBeCalled();
      });
    });

    describe('type change', () => {
      it('calls onTypeChange',  () => {
        const w = wrapper();

        w.instance().handleTypeChange();
        expect(onTypeChange).toBeCalledWith('note');
      });

      it('calls onTypeChange with changed value',  () => {
        const w = wrapper();

        w.setState({ value: 'good' });
        w.instance().handleTypeChange();
        expect(onTypeChange).toBeCalledWith('good');
      });

      it('calls onDelete', () => {
        const w = wrapper();

        w.setState({ value: '' });
        w.instance().handleTypeChange();
        expect(onDelete).toBeCalled();
      });
    });
  });
});
