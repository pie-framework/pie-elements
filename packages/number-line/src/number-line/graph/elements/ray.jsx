import * as colors from '../../colors';
import { color } from '@pie-lib/render-ui';
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Arrow from '../arrow';
import Point from './point';
import { basePropTypes } from './base';
import isNumber from 'lodash/isNumber';

const StyledRayGroup = styled('g')(({ $selected, $correct }) => ({
  '& line': {
    cursor: 'pointer',
    strokeWidth: '5px',
    stroke: color.primary(),
  },
  '& line, & .arrow': {
    transition: 'stroke 150ms linear, fill 150ms linear',
  },
  ...($selected && {
    '& line': {
      stroke: colors.selected,
    },
    '& .arrow': {
      fill: colors.selected,
      strokeWidth: '1px',
      stroke: colors.selected,
    },
  }),
  ...($correct === true && {
    '& line': {
      stroke: colors.correct,
    },
    '& .arrow': {
      fill: colors.correct,
      strokeWidth: '1px',
      stroke: colors.correct,
    },
  }),
  ...($correct === false && {
    '& line': {
      stroke: colors.incorrect,
    },
    '& .arrow': {
      fill: colors.incorrect,
      strokeWidth: '1px',
      stroke: colors.incorrect,
    },
  }),
}));

const StyledArrow = styled(Arrow)(({ $correct, $selected }) => ({
  fill: color.primary(),
  ...($correct === true && {
    fill: colors.correct,
    '--arrow-color': colors.correct,
  }),
  ...($correct === false && {
    fill: colors.incorrect,
    '--arrow-color': colors.incorrect,
  }),
  ...($selected && {
    fill: colors.selected,
    '--arrow-color': colors.selected,
  }),
}));

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
    onToggleSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selected: false,
    direction: 'positive',
    y: 0,
    disabled: false,
  };

  static contextTypes = {
    xScale: PropTypes.func.isRequired,
    snapValue: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      dragPosition: null,
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
    const { interval, empty, position, direction, domain, y, selected, disabled, width, correct } = this.props;
    /* eslint-enable */
    const { xScale } = this.context;

    const drag = this.drag.bind(this);
    const stopDrag = this.stopDrag.bind(this);

    const finalPosition = isNumber(this.state.dragPosition) ? this.state.dragPosition : position;

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

    return (
      <StyledRayGroup $selected={selected} $correct={correct} transform={`translate(0, ${y})`}>
        <line onClick={disabled ? noop : this.props.onToggleSelect} className="line-handle" x1={x1} x2={x2} />
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
          onClick={this.props.onToggleSelect}
        />
        <StyledArrow x={arrowX} $correct={correct} $selected={selected} direction={arrowDirection} />
      </StyledRayGroup>
    );
  }
}

export default Ray;
