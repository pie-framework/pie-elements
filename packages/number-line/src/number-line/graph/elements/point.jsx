import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';

import { Draggable } from '../../../draggable';

const duration = '150ms';

const StyledCircle = styled('circle')(({ $selected, $disabled, $correct, $empty }) => ({
  cursor: 'pointer',
  transition: `r ${duration} linear,  
  opacity ${duration} linear, 
  fill ${duration} linear,
  stroke ${duration} linear`,
  stroke: color.primary(),
  fill: color.primary(),
  // was ".react-draggable-dragging"
  '&.dnd-kit-dragging': {
    opacity: 0.25,
    r: '10px',
  },
  '&:hover': {
    stroke: color.primaryDark(),
  },
  ...($selected && {
    stroke: color.primaryDark(),
  }),
  ...($disabled && {
    cursor: 'not-allowed',
    opacity: 0.8,
  }),
  ...($correct === true && {
    cursor: 'inherit',
    stroke: color.correct(),
    fill: color.correct(),
  }),
  ...($correct === false && {
    cursor: 'inherit',
    stroke: color.incorrect(),
    fill: color.incorrect(),
  }),
  ...($empty && {
    fill: 'white',
  }),
}));

export class Point extends React.Component {
  static defaultProps = {
    y: 0,
    selected: false,
    empty: false,
    disabled: false,
    correct: undefined,
  };

  static propTypes = {
    interval: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired,
    bounds: PropTypes.shape({
      left: PropTypes.number.isRequired,
      right: PropTypes.number.isRequired,
    }),
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    correct: PropTypes.bool,
    empty: PropTypes.bool,
    y: PropTypes.number,
    onMove: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    onDrag: PropTypes.func,
    onDragStop: PropTypes.func,
    onDragStart: PropTypes.func,
  };

  static contextTypes = {
    xScale: PropTypes.func.isRequired,
    snapValue: PropTypes.func.isRequired,
  };

  render() {
    const {
      onDragStop,
      onDragStart,
      onDrag: onDragCallback,
      onClick,
      onMove,
      interval,
      y,
      bounds,
      selected,
      position,
      disabled,
      correct,
      empty,
    } = this.props;

    const { snapValue, xScale } = this.context;

    // same as old `is`
    const step = xScale(interval) - xScale(0);

    const dragPosition = (deltaX) => {
      const normalized = deltaX + xScale(0);
      const inverted = xScale.invert(normalized);
      return snapValue(position + inverted);
    };

    // bounds in px (same as old scaledBounds)
    const scaledBounds = bounds
      ? {
          left: (bounds.left / interval) * step,
          right: (bounds.right / interval) * step,
        }
      : null;

    const handleMouseDown = (e) => e.nativeEvent.preventDefault();

    // called when drag starts (via LocalDraggableDndKit)
    const handleDragStart = () => {
      if (onDragStart) {
        onDragStart();
      }
    };

    // called continuously while dragging (snapped+clamped deltaX in px)
    const handleDragMove = (deltaX) => {
      const p = dragPosition(deltaX);
      if (onDragCallback) {
        onDragCallback(p);
      }
    };

    // called when drag ends (snapped+clamped deltaX in px)
    const handleDragEnd = (deltaX) => {
      if (onDragStop) {
        onDragStop();
      }

      const deltaAbs = Math.abs(deltaX);

      // click vs drag, same threshold as before: is / 10
      if (deltaAbs < step / 10) {
        if (onClick) {
          onClick();
        }
        return;
      }

      const newPosition = dragPosition(deltaX);
      onMove(newPosition);
    };

    const id = `point-${position}-${y}`;

    return (
      <Draggable  
        id={id}
        disabled={disabled}
        grid={[step]}
        bounds={scaledBounds}
        onMouseDown={handleMouseDown}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        {({
          setNodeRef,
          attributes,
          listeners,
          translateX,
          isDragging,
          onMouseDown,
        }) => (
          <g
            ref={setNodeRef}
            onMouseDown={onMouseDown}
            // axis="x": only horizontal translate
            transform={`translate(${translateX}, 0)`}
            {...attributes}
            {...listeners}
          >
            <circle
              r="20"
              strokeWidth="3"
              style={{ fill: 'transparent', pointerEvents: 'visibleStroke' }}
              cx={xScale(position)}
              cy={y}
              stroke={selected ? color.primaryDark() : 'none'}
            />
            <StyledCircle
              r="5"
              strokeWidth="3"
              cx={xScale(position)}
              cy={y}
              $selected={selected}
              $disabled={disabled}
              $correct={correct}
              $empty={empty}
              className={isDragging ? 'dnd-kit-dragging' : undefined}
            />
          </g>
        )}
      </ Draggable>
    );
  }
}

export default Point;
