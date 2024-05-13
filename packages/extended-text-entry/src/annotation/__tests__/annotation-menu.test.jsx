import { shallow } from 'enzyme';
import React from 'react';
import AnnotationMenu from '../annotation-menu';

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

    return shallow(<AnnotationMenu { ...props } />);
  };

  describe('snapshots', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });

    it('opened', () => {
      expect(wrapper({ open: true })).toMatchSnapshot();
    });

    it('opened and new annotation selected', () => {
      expect(
        wrapper({ open: true, isNewAnnotation: true })
      ).toMatchSnapshot();
    });
  });
});
