import React from 'react';
import PropTypes from 'prop-types';
import { Line, Group } from 'react-konva';
import { withStyles } from '@material-ui/core/styles';

import Image from './image';
import { faCorrect, faWrong } from './icons';

class PolygonComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  getPolygonCenter = (points) => {
    const x = points.map(({ x }) => x);
    const y = points.map(({ y }) => y);
    const minX = Math.min.apply (null, x);
    const maxX = Math.max.apply (null, x);
    const minY = Math.min.apply (null, y);
    const maxY = Math.max.apply (null, y);
    return [(minX + maxX) / 2, (minY + maxY) / 2];
  };

  parsePointsForKonva = (points) => {
    const parsedPoints = [];
    points.forEach(({ x, y }) => {
      parsedPoints.push(x);
      parsedPoints.push(y);
    });
    return parsedPoints;
  };

  handleClick = (e) => {
    const { onClick, id, selected, disabled } = this.props;

    if (!disabled) {
      e.cancelBubble = true;
      onClick({ id, selected: !selected });
    }
  };

  handleMouseEnter = () => {
    const { disabled } = this.props;

    if (!disabled) {
      document.body.style.cursor = 'pointer';
    }
  };

  handleMouseLeave = () => {
    document.body.style.cursor = 'default';
  };

  getEvaluateOutlineColor = (isCorrect, outlineColor) => isCorrect ? outlineColor : 'red';

  getOutlineWidth = (selected, strokeWidth) => selected ? strokeWidth : 0;

  render() {
    const {
      classes,
      hotspotColor,
      isCorrect,
      isEvaluateMode,
      outlineColor,
      selected,
      points,
      evaluateText,
      strokeWidth
    } = this.props;

    const outlineColorParsed = isEvaluateMode
      ? this.getEvaluateOutlineColor(isCorrect, outlineColor)
      : outlineColor;
    const outlineWidth = this.getOutlineWidth(selected, strokeWidth);

    const pointsParsed = this.parsePointsForKonva(points);
    const center = this.getPolygonCenter(points);
    const iconX = center[0];
    const iconY = center[1];

    // Correctly selected hotspot: white checkmark in green circle (plus the selected hotspot will have a heavy outline, as on “Gather”)
    // Correctly not selected hotspot: none
    // Incorrectly selected hostpot: white “X” in red circle, plus the heavy outline around the selection should appear in red
    // Incorrectly not selected hotspot: white “X” in red circle
    let iconSrc;

    if (selected) {
      if (isCorrect) {
        iconSrc = faCorrect;
      } else {
        iconSrc = faWrong;
      }
    } else if (!isCorrect) {
      iconSrc = faWrong;
    }

    return (
      <Group>
        <Line
          points={pointsParsed}
          closed={true}
          classes={classes.base}
          fill={hotspotColor}
          onClick={this.handleClick}
          onTap={this.handleClick}
          draggable={false}
          stroke={outlineColorParsed}
          strokeWidth={outlineWidth}
          onMouseLeave={this.handleMouseLeave}
          onMouseEnter={this.handleMouseEnter}
        />
        {(isEvaluateMode && iconSrc) ? (
          <Image
            src={iconSrc}
            x={iconX}
            y={iconY}
            tooltip={evaluateText}
          />
        ): null}
      </Group>
    );
  }
}

const styles = () => ({
  base: {
    cursor: 'pointer',
    opacity: 0.5,
    position: 'relative'
  },
});

PolygonComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isCorrect: PropTypes.bool.isRequired,
  isEvaluateMode: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  points: PropTypes.array.isRequired,
  selected: PropTypes.bool.isRequired,
  evaluateText: PropTypes.string,
  strokeWidth: PropTypes.number
};

PolygonComponent.defaultProps = {
  evaluateText: null,
  strokeWidth: 5
};

export default withStyles(styles)(PolygonComponent);
