import React from 'react';
import PropTypes from 'prop-types';
import { Circle, Group, Rect } from 'react-konva';
import { styled } from '@mui/material/styles';
import ImageComponent from './image-konva-tooltip';
import { faCorrect, faWrong } from './icons';

class CircleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
    };
  }

  handleClick = (e) => {
    const { onClick, id, selected, disabled } = this.props;

    if (!disabled) {
      e.cancelBubble = true;
      onClick({ id, selected: !selected, selector: 'Mouse' });
    }
  };

  handleMouseEnter = () => {
    const { disabled } = this.props;

    if (!disabled) {
      document.body.style.cursor = 'pointer';
    }
    this.setState({ hovered: true });
  };

  handleMouseLeave = () => {
    document.body.style.cursor = 'default';
    this.setState({ hovered: false });
  };

  getEvaluateOutlineColor = (isCorrect, markAsCorrect, outlineColor) =>
    markAsCorrect ? 'green' : isCorrect ? outlineColor : 'red';

  getOutlineWidth = (showCorrectEnabled, selected, markAsCorrect, strokeWidth) =>
    markAsCorrect || (!markAsCorrect && !showCorrectEnabled && selected) ? strokeWidth : 0;

  render() {
    const {
      radius,
      hotspotColor,
      isCorrect,
      isEvaluateMode,
      hoverOutlineColor,
      outlineColor,
      selected,
      x,
      y,
      evaluateText,
      strokeWidth,
      scale,
      markAsCorrect,
      selectedHotspotColor,
      showCorrectEnabled,
    } = this.props;

    const { hovered } = this.state;

    const outlineColorParsed = isEvaluateMode
      ? this.getEvaluateOutlineColor(isCorrect, markAsCorrect, outlineColor)
      : outlineColor;

    const outlineWidth = this.getOutlineWidth(showCorrectEnabled, selected, markAsCorrect, strokeWidth);

    const iconX = x - 10;
    const iconY = y - 10; // Adjust position for the icon

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

    const useHoveredStyle = hovered && hoverOutlineColor;

    return (
      <Group scaleX={scale} scaleY={scale}>
        {useHoveredStyle && (
          <Rect
            x={x - radius}
            y={y - radius}
            width={radius * 2}
            height={radius * 2}
            stroke={selected ? 'transparent' : hoverOutlineColor}
            strokeWidth={strokeWidth}
          />
        )}
        <Circle
          radius={radius}
          fill={selected && selectedHotspotColor ? selectedHotspotColor : hotspotColor}
          onClick={this.handleClick}
          onTap={this.handleClick}
          draggable={false}
          stroke={useHoveredStyle && !selected ? 'transparent' : outlineColorParsed}
          strokeWidth={useHoveredStyle && !selected ? 0 : outlineWidth}
          onMouseLeave={this.handleMouseLeave}
          onMouseEnter={this.handleMouseEnter}
          x={x}
          y={y}
          opacity={0.5}
        />
        {isEvaluateMode && iconSrc ? <ImageComponent src={iconSrc} x={iconX} y={iconY} tooltip={evaluateText} /> : null}
      </Group>
    );
  }
}

CircleComponent.propTypes = {
  radius: PropTypes.number.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isCorrect: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isEvaluateMode: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  hoverOutlineColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  evaluateText: PropTypes.string,
  strokeWidth: PropTypes.number,
  scale: PropTypes.number,
  selectedHotspotColor: PropTypes.string,
  markAsCorrect: PropTypes.bool.isRequired,
  showCorrectEnabled: PropTypes.bool.isRequired,
};

CircleComponent.defaultProps = {
  isCorrect: false,
  evaluateText: null,
  strokeWidth: 5,
  scale: 1,
};

export default CircleComponent;
