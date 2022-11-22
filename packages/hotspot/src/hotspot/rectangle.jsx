import React from 'react';
import PropTypes from 'prop-types';
import { Rect, Group } from 'react-konva';
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

  getEvaluateOutlineColor = (isCorrect, markAsCorrect, outlineColor) =>
    markAsCorrect ? 'green' : isCorrect ? outlineColor : 'red';

  getOutlineWidth = (showCorrectEnabled, selected, markAsCorrect, strokeWidth) =>
    markAsCorrect || (!markAsCorrect && !showCorrectEnabled && selected) ? strokeWidth : 0;

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
      evaluateText,
      strokeWidth,
      scale,
      markAsCorrect,
      showCorrectEnabled,
    } = this.props;

    const outlineColorParsed = isEvaluateMode
      ? this.getEvaluateOutlineColor(isCorrect, markAsCorrect, outlineColor)
      : outlineColor;

    const outlineWidth = this.getOutlineWidth(showCorrectEnabled, selected, markAsCorrect, strokeWidth);

    const iconX = x + width / 2 - 10;
    const iconY = y + height / 2 - 10;

    // "Show Correct Answer" Enabled:
    //   - Correctly Selected: white checkmark in green circle
    //   - Correctly Not Selected: none
    //   - Incorrectly Selected: none
    //   - Incorrectly Not Selected: white checkmark in green circle
    // "Show Correct Answer" Disabled:
    //   - Correctly Selected:
    //     - white checkmark in green circle
    //     - heavy outline, as on “Gather”
    //   - Correctly Not Selected: none
    //   - Incorrectly Selected:
    //     - white "X" in red circle
    //     - heavy outline around the selection should appear in red
    //   - Incorrectly Not Selected: white "X" in red circle
    let iconSrc;

    if (showCorrectEnabled) {
      if ((selected && isCorrect) || (!selected && !isCorrect)) {
        iconSrc = faCorrect;
      }
    } else {
      if (selected) {
        if (isCorrect) {
          iconSrc = faCorrect;
        } else {
          iconSrc = faWrong;
        }
      } else if (!isCorrect) {
        iconSrc = faWrong;
      }
    }

    return (
      <Group scaleX={scale} scaleY={scale}>
        <Rect
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
        />
        {isEvaluateMode && iconSrc ? <Image src={iconSrc} x={iconX} y={iconY} tooltip={evaluateText} /> : null}
      </Group>
    );
  }
}

const styles = () => ({
  base: {
    cursor: 'pointer',
    opacity: 0.5,
    position: 'relative',
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
  evaluateText: PropTypes.string,
  strokeWidth: PropTypes.number,
  scale: PropTypes.number,
  markAsCorrect: PropTypes.bool.isRequired,
  showCorrectEnabled: PropTypes.bool.isRequired,
};

RectComponent.defaultProps = {
  isCorrect: false,
  evaluateText: null,
  strokeWidth: 5,
  scale: 1,
};

export default withStyles(styles)(RectComponent);
