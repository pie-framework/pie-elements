import { shallow } from 'enzyme';
import React from 'react';
import { Row, choiceSource, choiceTarget, canDrag } from '../row';
import { defaultProps } from './configure.test';

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

  const wrapper = extras => {
    const props = {
      classes: {},
      model: defaultModel,
      row: {
        id: 1,
        title: 'Question Text 1',
        values: [false, false]
      },
      idx: 1,
      isDragging: false,
      onDeleteRow: onDeleteRow,
      onChange: onChange,
      connectDragSource: connectDragSource,
      connectDropTarget: connectDropTarget,
      onMoveRow: onMoveRow,
      ...extras
    };

    return shallow(<Row {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('onRowTitleChange', () => {
      it('calls onChange', () => {
        const w = wrapper();
        const callback = w.instance().onRowTitleChange(1);

        callback({
          target: {
            value: 'Foo'
          }
        });

        expect(onChange).toBeCalledWith({
          rows: [
            {
              id: 1,
              title: 'Foo',
              values: [false, false]
            },
            ...defaultModel.rows.slice(1)
          ],
          ...defaultModel
        });
      });
    });

    describe('onRowValueChange', () => {
      it('calls onChange', () => {
        const w = wrapper();
        const callback = w.instance().onRowValueChange(1, 1);

        callback({
          target: {
            checked: true
          }
        });

        expect(onChange).toBeCalledWith({
          rows: [
            {
              id: 1,
              title: 'Question Text 1',
              values: [true, false]
            },
            ...defaultModel.rows.slice(1)
          ],
          ...defaultModel
        });
      });
    });

    describe('onDeleteRow', () => {
      it('calls onChange', () => {
        const w = wrapper();
        const callback = w.instance().onDeleteRow(1);

        callback();

        expect(onDeleteRow).toBeCalledWith(1);
      });
    });

    describe('onMouseDownOnHandle', () => {
      it('change canDrag value to true', () => {
        const w = wrapper();

        w.instance().onMouseDownOnHandle();

        expect(canDrag).toEqual(true);
      });
    });

    describe('onMouseUpOnHandle', () => {
      it('change canDrag value to false', () => {
        const w = wrapper();

        w.instance().onMouseUpOnHandle();

        expect(canDrag).toEqual(false);
      });
    });
  });
});

describe('spec', () => {
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

  const defaultModel = {
    id: '1',
    element: 'match-element',
    rows: [{
      id: 1,
      title: 'Question Text 1',
      values: [false, false]
    }, {
      id: 2,
      title: 'Question Text 2',
      values: [false, false]
    }, {
      id: 3,
      title: 'Question Text 3',
      values: [false, false]
    }, {
      id: 4,
      title: 'Question Text 4',
      values: [false, false]
    }],
    shuffled: false,
    partialScoring: [],
    layout: 3,
    headers: ['Column 1', 'Column 2', 'Column 3'],
    responseType: 'radio',
    feedback: {
      correct: {
        type: 'none',
        default: 'Correct'
      },
      partial: {
        type: 'none',
        default: 'Nearly'
      },
      incorrect: {
        type: 'none',
        default: 'Incorrect'
      }
    },
  };

  const wrapper = extras => {
    const props = {
      classes: {},
      model: defaultModel,
      row: {
        id: 1,
        title: 'Question Text 1',
        values: [false, false]
      },
      idx: 1,
      isDragging: false,
      onDeleteRow: onDeleteRow,
      onChange: onChange,
      connectDragSource: connectDragSource,
      connectDropTarget: connectDropTarget,
      onMoveRow: onMoveRow,
      ...extras
    };

    return shallow(<Row {...props} />);
  };

  describe('canDrag', () => {
    it('returns true after mousedown event was emmited on the Drag Handle', () => {
      const w = wrapper();

      w.instance().onMouseDownOnHandle();

      const result = choiceSource.canDrag({});

      expect(result).toEqual(true);
    });

    it('returns false after mouseup event was emmited on the document', () => {
      const w = wrapper();

      w.instance().onMouseUpOnHandle();

      const result = choiceSource.canDrag({});

      expect(result).toEqual(false);
    });
  });

  describe('beginDrag', () => {
    it('returns the id', () => {
      const result = choiceSource.beginDrag({ row: { id: 1 }, idx: 1 });

      expect(result).toEqual({ id: 1, index: 1 });
    });
  });

  describe('drop', () => {
    let monitor;
    let item;

    beforeEach(() => {
      item = {
        index: 1
      };
      monitor = {
        didDrop: jest.fn().mockReturnValue(false),
        getItem: jest.fn().mockReturnValue(item)
      };
    });

    it('calls onMoveRow when one row is dropped over another', () => {
      const props = {
        idx: 2,
        onMoveRow: jest.fn()
      };
      choiceTarget.drop(props, monitor);
      expect(props.onMoveRow).toBeCalledWith(1, 2);
    });
  });
});
