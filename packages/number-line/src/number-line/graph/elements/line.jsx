import React from 'react';
import PropTypes from 'prop-types';
import Draggable from '../../../draggable';
import Point from './point';
import { basePropTypes } from './base';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import { color } from '@pie-lib/render-ui';

const duration = '150ms';

const style = {
  line: {
    '& .line-handle': {
      stroke: color.primary(),
      cursor: 'pointer',
      strokeWidth: '5px',
      transition: `opacity ${duration} linear, 
      stroke-width ${duration} linear,
      stroke ${duration} linear`
    },
    '&.react-draggable-dragging': {
      opacity: 0.6,
      '& .line-handle': {
        opacity: 1.0,
        strokeWidth: '12px'
      }
    }
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.8
  },
  selected: {
    '& .line-handle': {
      stroke: color.primaryDark()
    },
    '& circle': {
      stroke: color.primaryDark()
    }
  },
  correct: {
    '& .line-handle': {
      cursor: 'inherit',
      stroke: color.correct()
    }
  },
  incorrect: {
    '& .line-handle': {
      cursor: 'inherit',
      stroke: color.incorrect()
    }
  }
};

export class Line extends React.Component {
  static propTypes = {
    ...basePropTypes(),
    empty: PropTypes.shape({
      left: PropTypes.bool.isRequired,
      right: PropTypes.bool.isRequired
    }).isRequired,
    position: PropTypes.shape({
      left: PropTypes.number.isRequired,
      right: PropTypes.number.isRequired
    }).isRequired,
    y: PropTypes.number,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    correct: PropTypes.bool,
    onMoveLine: PropTypes.func.isRequired,
    onToggleSelect: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragStop: PropTypes.func
  };

  static defaultProps = {
    selected: false,
    y: 0,
    disabled: false,
    correct: undefined
  };

  static contextTypes = {
    xScale: PropTypes.func.isRequired,
    snapValue: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      left: null,
      right: null
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
      classes
    } = this.props;

    const { xScale } = this.context;

    const { onDrag, onMove } = this;
    const onMoveLeft = onMove.bind(this, 'left');
    const onMoveRight = onMove.bind(this, 'right');
    const onDragLeft = onDrag.bind(this, 'left');
    const onDragRight = onDrag.bind(this, 'right');

    const left = isNumber(this.state.left) ? this.state.left : position.left;
    const right = isNumber(this.state.right)
      ? this.state.right
      : position.right;

    const is = xScale(interval) - xScale(0);

    const onMouseDown = e => e.nativeEvent.preventDefault();
    const onLineDragStart = e => this.setState({ startX: e.clientX });

    const onLineClick = () => {
      const { startX, endX } = this.state;
      if (!startX || !endX) {
        return;
      }

      const deltaX = Math.abs(endX - startX);
      if (deltaX < is / 10) {
        this.props.onToggleSelect();
        this.setState({ startX: null, endX: null });
      }
    };

    const onRectClick = () => {
      this.props.onToggleSelect();
    };

    const onLineDragStop = (e, dd) => {
      this.setState({ endX: e.clientX });
      const invertedX = xScale.invert(dd.lastX + xScale(0));
      const newPosition = {
        left: position.left + invertedX,
        right: position.right + invertedX
      };

      if (!isEqual(newPosition, this.props.position)) {
        this.props.onMoveLine(newPosition);
      }
    };

    const scaledLineBounds = {
      left: (domain.min - position.left) / interval * is,
      right: (domain.max - position.right) / interval * is
    };

    var lineClass = classNames(classes.line, {
      [classes.disabled]: disabled,
      [classes.selected]: selected,
      [classes.correct]: correct === true,
      [classes.incorrect]: correct === false
    });

    const common = {
      interval,
      selected,
      disabled,
      correct
    };

    return (
      <Draggable
        disabled={disabled}
        axis="x"
        handle=".line-handle"
        grid={[is]}
        bounds={scaledLineBounds}
        onStart={onLineDragStart}
        onStop={onLineDragStop}
        onMouseDown={onMouseDown}
      >
        <g className={lineClass}>
          <g transform={`translate(0, ${y})`}>
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
              className={classNames('line-handle', classes.handle, {
                [classes.selected]: selected
              })}
              x1={xScale(left)}
              x2={xScale(right)}
              onClick={onLineClick}
            />
            <Point
              {...common}
              empty={empty.left}
              bounds={{
                left: domain.min - position.left,
                right: domain.max - position.left
              }}
              position={position.left}
              onDrag={onDragLeft}
              onMove={onMoveLeft}
            />
            <Point
              {...common}
              empty={empty.right}
              bounds={{
                left: domain.min - position.right,
                right: domain.max - position.right
              }}
              position={position.right}
              onDrag={onDragRight}
              onMove={onMoveRight}
            />
          </g>
        </g>
      </Draggable>
    );
  }
}

export default injectSheet(style)(Line);
