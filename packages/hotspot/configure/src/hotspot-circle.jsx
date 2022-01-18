import React from 'react';
import PropTypes from 'prop-types';
import { Circle, Group } from 'react-konva';
import { withStyles } from '@material-ui/core/styles/index';

class CircleComponent extends React.Component {
  handleClick = (e) => {
    const { width, height, isDrawing, onClick, id } = this.props;
    if (width < 0 && height < 0 && isDrawing) {
      return;
    }
    e.cancelBubble = true;
    onClick(id);
  };

  handleMouseEnter = () => {
    document.body.style.cursor = 'pointer';
  };

  handleMouseLeave = () => {
    document.body.style.cursor = 'default';
  };

  handleOnDragEnd = (e) => {
    const { onDragEnd, id } = this.props;

    onDragEnd(id, {
      x: e.target.x(),
      y: e.target.y()
    })
  };

  render() {
    const {
      classes,
      correct,
      height,
      hotspotColor,
      outlineColor,
      width,
      x,
      y,
      strokeWidth = 5,
      radius = 50
    } = this.props;

    return (
      <Group>
        <Circle
          classes={classes.base}
          width={width < 0 ? 0 : width}
          height={height < 0 ? 0 : height}
          fill={hotspotColor}
          onClick={this.handleClick}
          onTap={this.handleClick}
          draggable
          stroke={outlineColor}
          strokeWidth={correct ? strokeWidth : 0}
          onMouseLeave={this.handleMouseLeave}
          onMouseEnter={this.handleMouseEnter}
          onDragEnd={this.handleOnDragEnd}
          x={x}
          y={y}
          radius={radius < 0 ? 0 : radius}
        />
      </Group>
    );
  }
}

const styles = () => ({
  base: {
    cursor: 'pointer',
    opacity: 0.5
  },
});

CircleComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  correct: PropTypes.bool,
  isDrawing: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number,
  radius: PropTypes.number
};

CircleComponent.defaultProps = {
  correct: false,
};

export default withStyles(styles)(CircleComponent);
