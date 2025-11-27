import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';

import Draggable from '../../../draggable';

const duration = '150ms';

const StyledCircle = styled('circle')(({ $selected, $disabled, $correct, $empty }) => ({
  cursor: 'pointer',
  transition: `r ${duration} linear,  
  opacity ${duration} linear, 
  fill ${duration} linear,
  stroke ${duration} linear`,
  stroke: color.primary(),
  fill: color.primary(),
  '&.react-draggable-dragging': {
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

    const is = xScale(interval) - xScale(0);

    const dragPosition = (x) => {
      const normalized = x + xScale(0);
      const inverted = xScale.invert(normalized);
      return snapValue(position + inverted);
    };

    const onStart = (e) => {
      this.setState({ startX: e.clientX });
      if (onDragStart) {
        onDragStart();
      }
    };

    const onStop = (e, dd) => {
      if (onDragStop) {
        onDragStop();
      }

      const endX = e.clientX;
      const startX = this.state.startX;
      const deltaX = Math.abs(endX - startX);

      if (deltaX < is / 10) {
        if (onClick) {
          onClick();
          this.setState({ startX: null });
        }
      } else {
        const newPosition = dragPosition(dd.lastX);
        onMove(newPosition);
      }
    };

    //prevent the text select icon from rendering.
    const onMouseDown = (e) => e.nativeEvent.preventDefault();

    const scaledBounds = {
      left: (bounds.left / interval) * is,
      right: (bounds.right / interval) * is,
    };

    const onDrag = (e, dd) => {
      const p = dragPosition(dd.x);
      if (onDragCallback) {
        onDragCallback(p);
      }
    };

    return (
      <Draggable
        disabled={disabled}
        onMouseDown={onMouseDown}
        onStart={onStart}
        onDrag={onDrag}
        onStop={onStop}
        axis="x"
        grid={[is]}
        bounds={scaledBounds}
      >
        <g>
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
          />
        </g>
      </Draggable>
    );
  }
}

export default Point;
