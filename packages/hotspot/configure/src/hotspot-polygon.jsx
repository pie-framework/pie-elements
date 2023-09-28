import React from 'react';
import PropTypes from 'prop-types';
import { Group, Line, Circle } from 'react-konva';
import { withStyles } from '@material-ui/core/styles/index';

const HOVERED_COLOR = '#00BFFF';

class PolComponent extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { points, imageHeight, imageWidth } = nextProps;

    // we execute this code only if image dimensions changed
    if (prevState.imageHeight !== nextProps.imageHeight || prevState.imageWidth !== nextProps.imageWidth) {
      if (points.length) {
        const xList = points.map((p) => p.x);
        const yList = points.map((p) => p.y);

        const x = Math.min(...xList);
        const y = Math.max(...yList);

        return {
          x,
          y,
          points,
          imageHeight,
          imageWidth,
        };
      }

      return {
        x: 0,
        y: 0,
        points: [],
        imageHeight,
        imageWidth,
      };
    } else {
      return null;
    }
  }

  getOffset = (points) => {
    const xList = points.map((p) => p.x);
    const yList = points.map((p) => p.y);

    return {
      x: Math.min(...xList),
      y: Math.max(...yList),
    };
  };

  serialize = (points) => {
    const { x: xOffset, y: yOffset } = this.getOffset(points);

    return points.reduce((acc, point) => [...acc, point.x - xOffset, point.y - yOffset], []);
  };

  getInitialState = (points) => {
    if (points.length) {
      const { x, y } = this.getOffset(points);

      return {
        x,
        y,
        points,
      };
    }

    return {
      x: 0,
      y: 0,
      points: [],
    };
  };

  state = {
    hovered: false,
    ...this.getInitialState(this.props.points),
  };

  handleClick = (e) => {
    const { points } = this.props;
    const xList = points.map((p) => p.x);
    const yList = points.map((p) => p.y);

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
    this.setState({ hovered: true });
    document.body.style.cursor = 'pointer';
  };

  handleMouseLeave = () => {
    this.setState({ hovered: false });
    document.body.style.cursor = 'default';
  };

  handleOnDragEnd = (e, updateModel = false) => {
    const { onDragEnd, id } = this.props;
    const points = e.target.points() || this.serialize(this.state.points);

    const newPoints = points.reduce((acc, currentPointCoordinate, index) => {
      if (index % 2 === 0 && index + 1 < points.length) {
        return [
          ...acc,
          {
            x: currentPointCoordinate + e.target.x(),
            y: points[index + 1] + e.target.y(),
          },
        ];
      }

      return acc;
    }, []);

    this.setState({ points: newPoints, ...this.getOffset(newPoints) });

    if (updateModel) {
      onDragEnd(id, { points: newPoints });
    }
  };

  handleOnDragVertex = (e, changedIndex, updateModel) => {
    const { onDragEnd, id } = this.props;
    const { points } = this.state;

    const newPoints = points.map((point, index) =>
      index === changedIndex ? { x: e.target.x(), y: e.target.y() } : point,
    );

    this.setState({ points: newPoints, ...this.getOffset(newPoints) });

    if (updateModel) {
      onDragEnd(id, { points: newPoints });
    }
  };

  render() {
    const { classes, correct, hotspotColor, outlineColor, strokeWidth = 5 } = this.props;
    const { points, x, y, hovered } = this.state;

    const calculatedStrokeWidth = correct ? strokeWidth : hovered ? 1 : 0;
    const calculatedStroke = correct ? outlineColor : hovered ? HOVERED_COLOR : '';

    return (
      <Group classes={classes.group} onMouseLeave={this.handleMouseLeave} onMouseEnter={this.handleMouseEnter}>
        <Line
          classes={classes.base}
          points={this.serialize(points)}
          closed={true}
          fill={hotspotColor}
          onClick={this.handleClick}
          onTap={this.handleClick}
          draggable
          stroke={calculatedStroke}
          strokeWidth={calculatedStrokeWidth}
          onDragMove={this.handleOnDragEnd}
          onDragEnd={(e) => this.handleOnDragEnd(e, true)}
          x={x}
          y={y}
        />

        {hovered &&
          points.map((point, index) => (
            <Circle
              key={index}
              className={classes.circle}
              x={point.x}
              y={point.y}
              radius={5}
              fill={'white'}
              stroke={HOVERED_COLOR}
              strokeWidth={1}
              draggable
              onDragMove={(e) => {
                this.handleOnDragVertex(e, index);
              }}
              onDragEnd={(e) => {
                this.handleOnDragVertex(e, index, true);
              }}
            />
          ))}
      </Group>
    );
  }
}

const styles = () => ({
  base: {
    cursor: 'pointer',
    opacity: 0.5,
  },
  circle: {
    opacity: 4,
  },
  group: {
    padding: '12px',
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
  points: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ).isRequired,
  strokeWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  imageWidth: PropTypes.number,
};

PolComponent.defaultProps = {
  correct: false,
};

export default withStyles(styles)(PolComponent);
