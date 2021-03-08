import React from 'react';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';
import Draggable from '../../../draggable';
import classNames from 'classnames';
import injectSheet from 'react-jss';

const duration = '150ms';

const style = {
  point: {
    cursor: 'pointer',
    transition: `r ${duration} linear,  
    opacity ${duration} linear, 
    fill ${duration} linear,
    stroke ${duration} linear`,

    stroke: color.primary(),
    fill: color.primary(),
    '&.react-draggable-dragging': {
      opacity: 0.25,
      r: '10px'
    },
    '&:hover': {
      stroke: color.primaryDark()
    }
  },
  selected: {
    stroke: color.primaryDark()
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.8
  },
  correct: {
    cursor: 'inherit',
    stroke: color.correct(),
    fill: color.correct()
  },
  incorrect: {
    cursor: 'inherit',
    stroke: color.incorrect(),
    fill: color.incorrect()
  },
  empty: {
    fill: color.secondary()
  }
};

export class Point extends React.Component {
  static defaultProps = {
    y: 0,
    selected: false,
    empty: false,
    disabled: false,
    correct: undefined
  };

  static propTypes = {
    interval: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired,
    bounds: PropTypes.shape({
      left: PropTypes.number.isRequired,
      right: PropTypes.number.isRequired
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
    classes: PropTypes.object.isRequired
  };

  static contextTypes = {
    xScale: PropTypes.func.isRequired,
    snapValue: PropTypes.func.isRequired
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
      classes
    } = this.props;

    const { snapValue, xScale } = this.context;

    const dragPosition = x => {
      const normalized = x + xScale(0);
      const inverted = xScale.invert(normalized);
      return snapValue(position + inverted);
    };

    const onStart = e => {
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
    const onMouseDown = e => e.nativeEvent.preventDefault();

    const is = xScale(interval) - xScale(0);
    const scaledBounds = {
      left: bounds.left / interval * is,
      right: bounds.right / interval * is
    };

    const onDrag = (e, dd) => {
      const p = dragPosition(dd.x);
      if (onDragCallback) {
        onDragCallback(p);
      }
    };

    const circleClass = classNames(classes.point, {
      [classes.disabled]: disabled,
      [classes.selected]: selected,
      [classes.correct]: correct === true,
      [classes.incorrect]: correct === false,
      [classes.empty]: empty === true
    });

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
        <circle
          r="5"
          strokeWidth="3"
          className={circleClass}
          cx={xScale(position)}
          cy={y}
        />
      </Draggable>
    );
  }
}

export default injectSheet(style)(Point);
