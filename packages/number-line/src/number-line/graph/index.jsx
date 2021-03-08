import React from 'react';
import { scaleLinear } from 'd3-scale';
import { select, mouse } from 'd3-selection';
import { color } from '@pie-lib/render-ui';
import Point from './elements/point';
import Line from './elements/line';
import Ray from './elements/ray';
import BaseLine from './line';
import Arrow from './arrow';
import Ticks from './ticks';
import { snapTo } from './tick-utils';
import Stacks from './stacks';
import { TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import { Fade } from '../transitions';

const getXScale = (min, max, width, padding) => {
  if (min === undefined || max === undefined || width === undefined) {
    throw new Error('missing min/max/width');
  }

  return scaleLinear()
    .domain([min, max])
    .range([padding, width - padding]);
};

const Debug = props => (
  <g>
    <text x="00" y="20">
      {JSON.stringify(props)}
    </text>
  </g>
);

export class NumberLineGraph extends React.Component {
  static childContextTypes = {
    xScale: PropTypes.func.isRequired,
    snapValue: PropTypes.func.isRequired
  };

  static propTypes = {
    domain: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired
    }).isRequired,
    ticks: PropTypes.shape({ minor: PropTypes.number, major: PropTypes.number })
      .isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onToggleElement: PropTypes.func.isRequired,
    onMoveElement: PropTypes.func.isRequired,
    onAddElement: PropTypes.func.isRequired,
    debug: PropTypes.bool,
    elements: PropTypes.array,
    disabled: PropTypes.bool,
    onDeselectElements: PropTypes.func,
    arrows: PropTypes.shape({ left: PropTypes.bool, right: PropTypes.bool })
  };

  static defaultProps = {
    debug: false
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  xScaleFn() {
    const { domain, width } = this.props;
    return getXScale(domain.min, domain.max, width, 20);
  }

  snapValueFn() {
    const { domain, ticks } = this.props;
    return snapTo.bind(null, domain.min, domain.max, ticks.minor);
  }

  getChildContext() {
    return {
      xScale: this.xScaleFn(),
      snapValue: this.snapValueFn()
    };
  }

  /**
   * Note: we use d3 click + mouse to give us domain values directly.
   * Saves us having to calculate them ourselves from a MouseEvent.
   */
  onRectClick(rect) {
    const { elements, disabled } = this.props;

    if (disabled) {
      return;
    }

    const anyElementSelected = elements.some(e => e.selected);

    if (anyElementSelected) {
      this.props.onDeselectElements();
    } else {
      var coords = mouse(rect._groups[0][0]);
      const x = this.xScaleFn().invert(coords[0]);
      this.addElement(x);
    }
  }

  componentDidMount() {
    const rect = select(this.rect);
    rect.on('click', this.onRectClick.bind(this, rect));
  }

  addElement(x) {
    const snapFn = this.snapValueFn();
    const v = snapFn(x);
    this.props.onAddElement(v);
  }

  render() {
    const {
      domain,
      width,
      ticks,
      height,
      onToggleElement,
      onMoveElement,
      disabled
    } = this.props;
    let { arrows } = this.props;

    arrows = arrows || { left: true, right: true };
    const { min, max } = domain;

    if (domain.max <= domain.min) {
      return (
        <div>
          {domain.max} is less than or equal to {domain.min}
        </div>
      );
    } else {
      const lineY = height - 30;

      const stacks = new Stacks(domain);

      const elements = this.props.elements.map((el, index) => {
        const stackIndex = stacks.add(el);

        if (stackIndex === -1) {
          throw new Error('stack index is -1, cant add element');
        }

        const y = lineY - stackIndex * 25;

        const commonProps = {
          key: index,
          y,
          selected: el.selected && !disabled,
          interval: ticks.minor,
          disabled,
          correct: el.correct
        };

        const toggleElement = onToggleElement.bind(null, index, el);
        const moveElement = onMoveElement.bind(null, index, el);

        if (el.type === 'line') {
          const empty = {
            left: el.leftPoint === 'empty',
            right: el.rightPoint === 'empty'
          };

          return (
            <Line
              {...commonProps}
              domain={{ min: min, max: max }}
              onMoveLine={moveElement}
              onToggleSelect={toggleElement}
              position={el.position}
              empty={empty}
            />
          );
        } else if (el.type === 'point') {
          const bounds = {
            left: min - el.position,
            right: max - el.position
          };

          return (
            <Point
              {...commonProps}
              empty={el.pointType === 'empty'}
              position={el.position}
              bounds={bounds}
              onClick={toggleElement}
              onMove={moveElement}
            />
          );
        } else if (el.type === 'ray') {
          return (
            <Ray
              {...commonProps}
              domain={{ min: min, max: max }}
              direction={el.direction}
              position={el.position}
              onMove={moveElement}
              onToggleSelect={toggleElement}
              width={width}
              empty={el.pointType === 'empty'}
            />
          );
        }
      });

      return (
        <svg width={width} height={height}>
          {false && <Debug domain={domain} ticks={ticks} />}
          <BaseLine y={lineY} width={width} />
          {arrows.left && <Arrow y={lineY} />}
          {arrows.right && <Arrow x={width} y={lineY} direction="right" />}
          <Ticks y={lineY} domain={domain} ticks={ticks} />
          <rect
            ref={rect => (this.rect = rect)}
            //need to have a fill for it to be clickable
            fill={color.primary()}
            fillOpacity="0.0"
            width={width}
            height={height}
          />
          <TransitionGroup component="g">
            {elements.map((c, index) => (
              <Fade key={index}>{c}</Fade>
            ))}
          </TransitionGroup>
        </svg>
      );
    }
  }
}

export default NumberLineGraph;
