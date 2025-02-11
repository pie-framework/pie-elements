import React from 'react';
import PropTypes from 'prop-types';
import { Line, Group, Rect } from 'react-konva';
import { withStyles } from '@material-ui/core/styles';
import { ImageComponent } from '@pie-lib/pie-toolbox/icons';
import { faCorrect, faWrong } from './icons';

class PolygonComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
    };
  }

  getPolygonCenter = (points) => {
    const x = points.map(({ x }) => x);
    const y = points.map(({ y }) => y);
    const minX = Math.min.apply(null, x);
    const maxX = Math.max.apply(null, x);
    const minY = Math.min.apply(null, y);
    const maxY = Math.max.apply(null, y);
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
      classes,
      hotspotColor,
      isCorrect,
      isEvaluateMode,
      hoverOutlineColor,
      outlineColor,
      selected,
      points,
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

    const pointsParsed = this.parsePointsForKonva(points);
    const center = this.getPolygonCenter(points);
    const iconX = center[0];
    const iconY = center[1];

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
    const useHoveredStyle = hovered && hoverOutlineColor;

    const xValues = pointsParsed.filter((_, index) => index % 2 === 0); // Even indices are x-coordinates
    const yValues = pointsParsed.filter((_, index) => index % 2 !== 0); // Odd indices are y-coordinates

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const rectX = minX;
    const rectY = minY;
    const rectWidth = maxX - minX;
    const rectHeight = maxY - minY;

    return (
      <Group scaleX={scale} scaleY={scale}>
        {useHoveredStyle && (
          <Rect
            x={rectX}
            y={rectY}
            width={rectWidth}
            height={rectHeight}
            stroke={selected ? 'transparent' : hoverOutlineColor}
            strokeWidth={strokeWidth}
          />
        )}
        <Line
          points={pointsParsed}
          closed={true}
          classes={classes.base}
          fill={selected && selectedHotspotColor? selectedHotspotColor : hotspotColor}
          onClick={this.handleClick}
          onTap={this.handleClick}
          draggable={false}
          stroke={useHoveredStyle && !selected ? 'transparent' : outlineColorParsed}
          strokeWidth={useHoveredStyle && !selected ? 0 : outlineWidth}
          onMouseLeave={this.handleMouseLeave}
          onMouseEnter={this.handleMouseEnter}
        />
        {isEvaluateMode && iconSrc ? <ImageComponent src={iconSrc} x={iconX} y={iconY} tooltip={evaluateText} /> : null}
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

PolygonComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isCorrect: PropTypes.bool.isRequired,
  isEvaluateMode: PropTypes.bool.isRequired,
  hoverOutlineColor: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  points: PropTypes.array.isRequired,
  selected: PropTypes.bool.isRequired,
  evaluateText: PropTypes.string,
  selectedHotspotColor: PropTypes.string,
  strokeWidth: PropTypes.number,
  scale: PropTypes.number,
  markAsCorrect: PropTypes.bool.isRequired,
  showCorrectEnabled: PropTypes.bool.isRequired,
};

PolygonComponent.defaultProps = {
  evaluateText: null,
  strokeWidth: 5,
  scale: 1,
};

export default withStyles(styles)(PolygonComponent);
