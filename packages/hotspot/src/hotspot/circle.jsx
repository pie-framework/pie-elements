import React from 'react';
import PropTypes from 'prop-types';
import { Circle, Group } from 'react-konva';
import { withStyles } from '@material-ui/core/styles';

import Image from './image';
import { faCorrect, faWrong } from './icons';

class RectComponent extends React.Component {
  constructor(props) {
    super(props);
  }

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
      height,
      hotspotColor,
      isCorrect,
      isEvaluateMode,
      outlineColor,
      selected,
      width,
      x,
      y,
      radius = 50,
      evaluateText,
      strokeWidth
    } = this.props;

    const outlineColorParsed = isEvaluateMode
      ? this.getEvaluateOutlineColor(isCorrect, outlineColor)
      : outlineColor;

    const outlineWidth = this.getOutlineWidth(selected, strokeWidth);

    const iconX = (x + (width / 2)) - 10;
    const iconY = (y + (height / 2)) - 10;

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
        <Circle
          classes={classes.base}
          width={width}
          height={height}
          fill={hotspotColor}
          onClick={this.handleClick}
          onTap={this.handleClick}
          draggable={false}
          stroke={outlineColorParsed}
          strokeWidth={outlineWidth}
          onMouseLeave={this.handleMouseLeave}
          onMouseEnter={this.handleMouseEnter}
          x={x}
          y={y}
          radius={radius < 0 ? 0 : radius}
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

RectComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isCorrect: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isEvaluateMode: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  evaluateText: PropTypes.string,
  strokeWidth: PropTypes.number
};

RectComponent.defaultProps = {
  isCorrect: false,
  evaluateText: null,
  strokeWidth: 5
};

export default withStyles(styles)(RectComponent);
