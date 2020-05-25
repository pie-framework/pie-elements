import React from 'react';
import PropTypes from 'prop-types';
import { Group, Line } from 'react-konva';
import { withStyles } from '@material-ui/core/styles/index';

class PolComponent extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    const { points } = nextProps;
    const xList = points.map(p => (p.x));
    const yList = points.map(p => (p.y));

    const xOffset = Math.min(...xList);
    const yOffset = Math.max(...yList);

    if (points.length) {
      return {
        x: xOffset,
        y: yOffset,
        points: points.reduce((acc, point) => { return acc.concat([point.x - xOffset, point.y - yOffset]) }, [])
      };
    }

    return {
      x: 0,
      y: 0,
      points: []
    };
  }

  state = {};

  handleClick = (e) => {
    const { points } = this.props;
    const xList = points.map(p => (p.x));
    const yList = points.map(p => (p.y));

    const width = Math.max(...xList) - Math.min(...xList);
    const height = Math.max(...yList) - Math.min(...yList);

    const { isDrawing, onClick, id } = this.props;

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
    const points = e.target.points() || this.state.points;

    const newPoints = points.reduce((acc, currentPointCoordinate, index) => {
      if (index % 2 === 0 && index + 1 < points.length) {
        acc.push({
          x: currentPointCoordinate + e.target.x(),
          y: points[index + 1]  + e.target.y()
        });

        return acc;
      } else {
        return acc;
      }
    }, []);

    onDragEnd(id, {
      points: newPoints
    })
  };

  render() {
    const {
      classes,
      correct,
      hotspotColor,
      outlineColor,
      strokeWidth = 5
    } = this.props;
    const { points, x, y } = this.state;

    return (
      <Group>
        <Line
          classes={classes.base}
          points={points}
          closed={true}
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

PolComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  correct: PropTypes.bool,
  isDrawing: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  points: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })).isRequired,
  strokeWidth: PropTypes.number
};

PolComponent.defaultProps = {
  correct: false,
};

export default withStyles(styles)(PolComponent);
