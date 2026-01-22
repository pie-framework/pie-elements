import { render } from '@testing-library/react';
import React from 'react';
import { Row, canDrag } from '../row';
import { defaultProps } from './configure.test';

jest.mock('@mui/material/Radio', () => (props) => <input type="radio" {...props} />);
jest.mock('@mui/material/IconButton', () => (props) => <button {...props}>{props.children}</button>);
jest.mock('@mui/icons-material/Delete', () => () => <div data-testid="delete-icon" />);
jest.mock('@mui/icons-material/DragHandle', () => () => <div data-testid="drag-handle" />);
jest.mock('@pie-lib/render-ui', () => ({
  color: {
    tertiary: () => '#999',
  },
}));
jest.mock('@pie-lib/editable-html', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => <div data-testid="editable-html" />,
    DEFAULT_PLUGINS: ['bold', 'italic'],
  };
});
jest.mock('@pie-lib/config-ui', () => ({
  Checkbox: (props) => <input type="checkbox" {...props} />,
  AlertDialog: (props) => <div>{props.children}</div>,
  NumberTextField: (props) => <div />,
  InputContainer: (props) => <div>{props.children}</div>,
  FeedbackConfig: (props) => <div />,
  InputCheckbox: (props) => <div />,
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn(),
  },
}));

describe('choice', () => {
  let onDeleteRow;
  let onChange;
  let connectDragSource;
  let connectDropTarget;
  let onMoveRow;

  beforeEach(() => {
    onChange = jest.fn();
    onDeleteRow = jest.fn();
    connectDragSource = jest.fn();
    connectDropTarget = jest.fn();
    onMoveRow = jest.fn();
  });

  const defaultModel = defaultProps.model;

  const wrapper = (extras) => {
    const props = {
      classes: {},
      model: defaultModel,
      row: {
        id: 1,
        title: 'Question Text 1',
        values: [false, false],
      },
      idx: 1,
      isDragging: false,
      onDeleteRow: onDeleteRow,
      onChange: onChange,
      connectDragSource: connectDragSource,
      connectDropTarget: connectDropTarget,
      onMoveRow: onMoveRow,
      ...extras,
    };

    return render(<Row {...props} />);
  };

  const createInstance = (extras) => {
    const props = {
      classes: {},
      model: defaultModel,
      row: {
        id: 1,
        title: 'Question Text 1',
        values: [false, false],
      },
      idx: 1,
      isDragging: false,
      onDeleteRow: onDeleteRow,
      onChange: onChange,
      connectDragSource: connectDragSource,
      connectDropTarget: connectDropTarget,
      onMoveRow: onMoveRow,
      ...extras,
    };

    const instance = new Row(props);

    // Mock setState to execute updates immediately for testing
    instance.setState = jest.fn((state) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
    });

    return instance;
  };

  describe('logic', () => {
    describe('onRowTitleChange', () => {
      it('calls onChange', () => {
        const w = createInstance();
        const callback = w.onRowTitleChange(1);

        callback({
          target: {
            value: 'Foo',
          },
        });

        expect(onChange).toBeCalledWith({
          rows: [
            {
              id: 1,
              title: 'Foo',
              values: [false, false],
            },
            ...defaultModel.rows.slice(1),
          ],
          ...defaultModel,
        });
      });
    });

    describe('onRowValueChange', () => {
      it('calls onChange', () => {
        const w = createInstance();
        const callback = w.onRowValueChange(1, 1);

        callback({
          target: {
            checked: true,
          },
        });

        expect(onChange).toBeCalledWith({
          rows: [
            {
              id: 1,
              title: 'Question Text 1',
              values: [true, false],
            },
            ...defaultModel.rows.slice(1),
          ],
          ...defaultModel,
        });
      });
    });

    describe('onDeleteRow', () => {
      it('calls onChange', () => {
        const w = createInstance();
        const callback = w.onDeleteRow(1);

        callback();

        expect(onDeleteRow).toBeCalledWith(1);
      });

      it('does not delete all rows and shows dialog', () => {
        let onModelChanged = jest.fn();
        const w = createInstance();
        const callback = w.onDeleteRow(1);

        callback();

        expect(onModelChanged).toHaveBeenCalledTimes(0);
      });
    });

    describe('onMouseDownOnHandle', () => {
      it('change canDrag value to true', () => {
        const w = createInstance();

        w.onMouseDownOnHandle();

        expect(canDrag).toEqual(true);
      });
    });

    describe('onMouseUpOnHandle', () => {
      it('change canDrag value to false', () => {
        const w = createInstance();

        w.onMouseUpOnHandle();

        expect(canDrag).toEqual(false);
      });
    });
  });
});

