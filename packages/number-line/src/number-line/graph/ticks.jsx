import React from 'react';
import PropTypes from 'prop-types';
import { buildTickData, isMultiple } from './tick-utils';
import injectSheet from 'react-jss';
import { color } from '@pie-lib/render-ui';

const style = {
  text: {
    userSelect: 'none',
    textAlign: 'center',
    fill: color.primary()
  },
  line: {
    stroke: color.primary()
  }
};

export const TickValidator = PropTypes.shape({
  /** the number of major ticks (including min + max)
   * to display. cant be lower than 2.
   */
  major: (props, propName) => {
    let major = props[propName];
    let minor = props.minor;

    if (!isMultiple(major, minor)) {
      return new Error(`Invalid prop major. It must be a multiple of ${minor}`);
    }
  },
  /** the number of minor ticks to display between major ticks.
   * Can't be less than zero.
   */
  minor: (props, propName, componentName) => {
    let minor = props[propName];
    if (minor <= 0) {
      return new Error(
        `Invalid prop ${propName} must be > 0. ${componentName}`
      );
    }
  }
}).isRequired;

export class Tick extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    y: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    major: PropTypes.bool,
    fraction: PropTypes.bool,
    xScale: PropTypes.func,
    type: PropTypes.string
  };

  static defaultProps = {
    major: false
  };

  constructor(props) {
    super(props);
    this.wasRendered = false;
  };

  componentDidMount() {
    //center align the tick text
    if (this.text) {
      const { fraction } = this.props;
      let { width } = this.text.getBBox();
      this.text.setAttribute('x', (width / 2) * -1);

      if (fraction && !this.wasRendered) {
        // used for rendering the line fraction
        this.wasRendered = true;
        this.forceUpdate();
      }
    }
  }

  render() {
    //the domain value
    let { x, y, type, classes, xScale, fraction } = this.props;
    const displayFraction = fraction && x.n !== x.d && x.n !== 0 && x.d !== 1;
    const labelTick = type === 'major';
    const height = labelTick ? 20 : 10;
    const {
      width: textWidth = 0,
      height: textHeight = 0,
      x: textX = 0,
      y: textY = 0
    } = this.text && this.text.getBBox() || {};

    const xText = !fraction ? Number(x.toFixed(2))
      : !displayFraction ? x.n
        : <>
          <tspan x="0" dy="0.71em">{x.n}</tspan>
          <tspan x="0" dy="1.11em">{x.d}</tspan>
        </>;

    return (
      <g opacity="1" transform={`translate(${xScale(x)}, ${y})`}>
        <line
          className={classes.line}
          y1={(height / 2) * -1}
          y2={height / 2}
          x1="0.5"
          x2="0.5"
        />

        {displayFraction &&
          <line
            className={classes.line}
            x1={textX}
            x2={textX + textWidth}
            y1={textY + textHeight / 2}
            y2={textY + textHeight / 2}
          />
        }

        {labelTick && (
          <text
            ref={text => (this.text = text)}
            className={classes.text}
            y="14"
            width="10"
            dy="0.71em"
            textAnchor={displayFraction && "middle"}
          >
            {xText}
          </text>
        )}
      </g>
    );
  }
}

export class Ticks extends React.Component {
  static contextTypes = {
    xScale: PropTypes.func.isRequired
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    domain: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired
    }).isRequired,
    fraction: PropTypes.bool,
    ticks: TickValidator,
    y: PropTypes.number.isRequired
  };

  render() {
    let { domain, ticks, y, classes, fraction } = this.props;
    let { xScale } = this.context;

    const tickData = buildTickData(domain, ticks, { fraction });

    return (
      <g>
        {tickData.map(({ x, type }) => {
          return (
            <Tick
              classes={classes}
              fraction={fraction}
              x={x}
              y={y}
              type={type}
              xScale={xScale}
              key={`${x}-${type}`}
            />
          );
        })}
      </g>
    );
  }
}

export default injectSheet(style)(Ticks);
