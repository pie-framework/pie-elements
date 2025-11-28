import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import { color } from '@pie-lib/render-ui';
import { Draggable } from '../../../draggable';

import Point from './point';
import { basePropTypes } from './base';

const duration = '150ms';

const StyledLineGroup = styled('g')(({ $disabled, $selected, $correct }) => ({
  '& .line-handle': {
    stroke: color.primary(),
    cursor: 'pointer',
    strokeWidth: '5px',
    transition: `opacity ${duration} linear, 
    stroke-width ${duration} linear,
    stroke ${duration} linear`,
  },
  // was ".react-draggable-dragging" in the old version
  '&.dnd-kit-dragging': {
    opacity: 0.6,
    '& .line-handle': {
      opacity: 1.0,
      strokeWidth: '12px',
    },
  },
  ...($disabled && {
    cursor: 'not-allowed',
    opacity: 0.8,
  }),
  ...($selected && {
    '& .line-handle': {
      stroke: color.primaryDark(),
    },
  }),
  ...($correct === true && {
    '& .line-handle': {
      cursor: 'inherit',
      stroke: color.correct(),
    },
  }),
  ...($correct === false && {
    '& .line-handle': {
      cursor: 'inherit',
      stroke: color.incorrect(),
    },
  }),
}));

export class Line extends React.Component {
  static propTypes = {
    ...basePropTypes(),
    empty: PropTypes.shape({
      left: PropTypes.bool.isRequired,
      right: PropTypes.bool.isRequired,
    }).isRequired,
    position: PropTypes.shape({
      left: PropTypes.number.isRequired,
      right: PropTypes.number.isRequired,
    }).isRequired,
    y: PropTypes.number,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    correct: PropTypes.bool,
    onMoveLine: PropTypes.func.isRequired,
    onToggleSelect: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragStop: PropTypes.func,
  };

  static defaultProps = {
    selected: false,
    y: 0,
    disabled: false,
    correct: undefined,
  };

  static contextTypes = {
    xScale: PropTypes.func.isRequired,
    snapValue: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      left: null,
      right: null,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      const { position } = nextProps;
      this.setState({ left: position.left, right: position.right });
    }
  }

  onDrag(side, p) {
    const { domain } = this.props;
    if (p >= domain.min && p <= domain.max) {
      const newState = {};
      newState[side] = p;
      this.setState(newState);
    }
  }

  onMove(side, d) {
    const { position: p } = this.props;
    const newPosition = { left: p.left, right: p.right };
    newPosition[side] = d;
    this.props.onMoveLine(newPosition);
  }

  render() {
    const {
      interval,
      empty,
      position,
      domain,
      y,
      selected,
      disabled,
      correct,
    } = this.props;

    const { xScale } = this.context;

    const { onDrag, onMove } = this;
    const onMoveLeft = onMove.bind(this, 'left');
    const onMoveRight = onMove.bind(this, 'right');
    const onDragLeft = onDrag.bind(this, 'left');
    const onDragRight = onDrag.bind(this, 'right');

    const left = isNumber(this.state.left) ? this.state.left : position.left;
    const right = isNumber(this.state.right) ? this.state.right : position.right;

    const is = xScale(interval) - xScale(0);

    const onMouseDown = (e) => e.nativeEvent.preventDefault();

    const onLineClick = () => {
      // click on the line toggles selection
      this.props.onToggleSelect();
    };

    const onRectClick = () => {
      this.props.onToggleSelect();
    };

    // dnd-kit drag stop handler (receives pixel deltaX from LocalDraggableDndKit)
    const onLineDragStop = (deltaX) => {
      // small movement -> treat as click (same threshold as before: is / 10)
      const deltaAbs = Math.abs(deltaX);
      if (deltaAbs < is / 10) {
        this.props.onToggleSelect();
        return;
      }

      // convert pixel delta to domain delta (same math as before)
      const invertedX = xScale.invert(deltaX + xScale(0));
      const newPosition = {
        left: position.left + invertedX,
        right: position.right + invertedX,
      };

      if (!isEqual(newPosition, this.props.position)) {
        this.props.onMoveLine(newPosition);
      }
    };

    const scaledLineBounds = {
      left: ((domain.min - position.left) / interval) * is,
      right: ((domain.max - position.right) / interval) * is,
    };

    const common = {
      interval,
      selected,
      disabled,
      correct,
    };

    // unique-ish id for this line; if you already have an id prop, use that instead
    const draggableId = `line-${position.left}-${position.right}-${y}`;

    return (
      <Draggable
        id={draggableId}
        disabled={disabled}
        grid={[is]}
        bounds={scaledLineBounds}
        onMouseDown={onMouseDown}
        onDragEnd={onLineDragStop}
      >
        {({
          setNodeRef,
          attributes,
          listeners,
          translateX,
          isDragging,
          onMouseDown: handleMouseDown,
        }) => (
          <StyledLineGroup
            ref={setNodeRef}
            $disabled={disabled}
            $selected={selected}
            $correct={correct}
            className={isDragging ? 'dnd-kit-dragging' : undefined}
            onMouseDown={handleMouseDown}
            {...attributes}
          >
            <g transform={`translate(${translateX}, ${y})`}>
              <rect
                x={xScale(left)}
                width={Math.abs(xScale(right) - xScale(left))}
                fill="red"
                fillOpacity="0.0"
                y="-8"
                height={16}
                onClick={onRectClick}
              />
              <line
                className="line-handle"
                x1={xScale(left)}
                x2={xScale(right)}
                onClick={onLineClick}
                // this is your "handle": only dragging when grabbing this line
                {...listeners}
              />
              <Point
                {...common}
                empty={empty.left}
                bounds={{
                  left: domain.min - position.left,
                  right: domain.max - position.left,
                }}
                position={position.left}
                onDrag={onDragLeft}
                onMove={onMoveLeft}
                onClick={onRectClick}
              />
              <Point
                {...common}
                empty={empty.right}
                bounds={{
                  left: domain.min - position.right,
                  right: domain.max - position.right,
                }}
                position={position.right}
                onDrag={onDragRight}
                onMove={onMoveRight}
                onClick={onRectClick}
              />
            </g>
          </StyledLineGroup>
        )}
      </Draggable>
    );
  }
}

export default Line;
