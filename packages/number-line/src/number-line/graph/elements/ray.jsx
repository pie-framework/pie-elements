import * as colors from '../../colors';
import { color } from '@pie-lib/render-ui';
import React from 'react';
import PropTypes from 'prop-types';
import Arrow from '../arrow';
import Point from './point';
import { basePropTypes } from './base';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import isNumber from 'lodash/isNumber';

const rayColor = rayColor => ({
  '& line': {
    stroke: rayColor
  },
  '& .arrow': {
    fill: rayColor,
    strokeWidth: '1px',
    stroke: rayColor
  }
});

const style = {
  ray: {
    '& line': {
      cursor: 'pointer',
      strokeWidth: '5px',
      stroke: color.primary()
    },
    '& line, & .arrow': {
      transition: 'stroke 150ms linear, fill 150ms linear'
    }
  },
  selected: rayColor(colors.selected),
  correct: rayColor(colors.correct),
  incorrect: rayColor(colors.incorrect),
  arrowCorrect: {
    '--arrow-color': colors.correct
  },
  arrowIncorrect: {
    '--arrow-color': colors.incorrect
  },
  arrowSelected: {
    '--arrow-color': colors.selected
  }
};

export class Ray extends React.Component {
  static propTypes = {
    ...basePropTypes(),
    width: PropTypes.number.isRequired,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    empty: PropTypes.bool,
    direction: PropTypes.oneOf(['positive', 'negative']),
    y: PropTypes.number,
    position: PropTypes.number.isRequired,
    onMove: PropTypes.func.isRequired,
    onToggleSelect: PropTypes.func.isRequired
  };

  static defaultProps = {
    selected: false,
    direction: 'positive',
    y: 0,
    disabled: false
  };

  static contextTypes = {
    xScale: PropTypes.func.isRequired,
    snapValue: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      dragPosition: null
    };
  }

  drag(p) {
    const { domain } = this.props;
    if (p >= domain.min && p <= domain.max) {
      this.setState({ dragPosition: p });
    }
  }

  stopDrag() {
    this.setState({ dragPosition: null });
  }

  render() {
    /* eslint-disable */
    const {
      interval,
      empty,
      position,
      direction,
      domain,
      y,
      selected,
      disabled,
      width,
      correct,
      classes
    } = this.props;
    /* eslint-enable */
    const { xScale } = this.context;

    const drag = this.drag.bind(this);
    const stopDrag = this.stopDrag.bind(this);

    const finalPosition = isNumber(this.state.dragPosition)
      ? this.state.dragPosition
      : position;

    const className = classNames(classes.ray, {
      [classes.selected]: selected,
      [classes.correct]: correct === true,
      [classes.incorrect]: correct === false
    });

    const positive = direction === 'positive';
    const left = positive ? finalPosition : domain.min;
    const right = positive ? domain.max : finalPosition;
    // const triangleX = positive ? xScale(right) : xScale(left);

    //const et the line run all the way to 0 or width.
    const x1 = positive ? xScale(left) : 8;
    const x2 = positive ? width - 8 : xScale(right);
    const arrowX = positive ? width : 0;
    const arrowDirection = positive ? 'right' : 'left';

    const noop = () => {};

    const arrowClassNames = classNames({
      [classes.arrowCorrect]: correct === true,
      [classes.arrowIncorrect]: correct === false,
      [classes.arrowSelected]: selected
    });

    return (
      <g className={className} transform={`translate(0, ${y})`}>
        <line
          onClick={disabled ? noop : this.props.onToggleSelect}
          className="line-handle"
          x1={x1}
          x2={x2}
        />
        <Point
          disabled={disabled}
          correct={correct}
          selected={selected}
          empty={empty}
          interval={interval}
          bounds={{ left: domain.min - position, right: domain.max - position }}
          position={position}
          onDrag={drag}
          onDragStop={stopDrag}
          onMove={this.props.onMove}
        />
        <Arrow
          x={arrowX}
          className={arrowClassNames}
          direction={arrowDirection}
        />
      </g>
    );
  }
}

export default injectSheet(style)(Ray);
