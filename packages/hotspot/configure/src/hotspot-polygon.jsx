import React from 'react';
import PropTypes from 'prop-types';
import { Group, Line, Circle } from 'react-konva';
import { withStyles } from '@material-ui/core/styles/index';
import { Rect } from 'react-konva/lib/ReactKonvaCore';
import DeleteWidget from './DeleteWidget';

const HOVERED_COLOR = '#00BFFF';

class PolComponent extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { id, points, imageHeight, imageWidth } = nextProps;
    // we execute this code only if image dimensions changed or an hotspot was added/deleted
    if (
      prevState.imageHeight !== imageHeight ||
      prevState.imageWidth !== imageWidth ||
      prevState.id !== nextProps.id ||
      JSON.stringify(prevState.points) !== JSON.stringify(points)
    ) {
      const xList = points.map((p) => p.x);
      const yList = points.map((p) => p.y);

      const x = Math.min(...xList);
      const y = Math.max(...yList);

      return {
        id,
        x,
        y,
        points,
        imageHeight,
        imageWidth,
      };
    }

    return null;
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
      id: '',
      x: 0,
      y: 0,
      points: [],
    };
  };

  state = {
    hovered: false,
    isDragging: false,
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

    if (isDrawing && id === 'newPolygon') {
      this.props.addPolygonPoint(e);
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

    this.setState({
      points: newPoints,
      ...this.getOffset(newPoints),
      isDragging: updateModel ? false : this.state.isDragging,
    });

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

    this.setState({
      points: newPoints,
      ...this.getOffset(newPoints),
      isDragging: updateModel ? false : this.state.isDragging,
    });

    if (updateModel) {
      onDragEnd(id, { points: newPoints });
    }
  };

  onDragStart = () => {
    this.setState({ isDragging: true });
  };

  handleDelete = (id) => {
    const { onDeleteShape } = this.props;
    onDeleteShape(id);
  };

  // serialize(points) {
  //   return points.reduce((acc, point) => [...acc, point.x, point.y], []);
  // }

  getBoundingBox(points) {
    const xValues = points.map((point) => point.x);
    const yValues = points.map((point) => point.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  render() {
    const {
      classes,
      correct,
      id,
      hotspotColor,
      outlineColor,
      selectedHotspotColor,
      hoverOutlineColor,
      strokeWidth = 5,
    } = this.props;

    const { points, x, y, hovered } = this.state;
    const isInProgress = id === 'newPolygon';
    const showPoints = hovered || id === 'newPolygon';

    const calculatedStrokeWidth = correct ? strokeWidth : hovered ? 1 : 0;
    const calculatedStroke = correct ? outlineColor : hovered ? HOVERED_COLOR : '';
    const boundingBox = this.getBoundingBox(points);
    const calculatedFill = correct ? selectedHotspotColor : hotspotColor;

    return (
      <Group classes={classes.group} onMouseLeave={this.handleMouseLeave} onMouseEnter={this.handleMouseEnter}>
        {hoverOutlineColor && hovered && (
          <Rect
            x={boundingBox.x}
            y={boundingBox.y}
            width={boundingBox.width}
            height={boundingBox.height}
            stroke={hoverOutlineColor}
            strokeWidth={2}
            listening={false}
          />
        )}
        <Line
          classes={classes.base}
          points={this.serialize(points)}
          closed={!isInProgress}
          fill={isInProgress ? 'transparent' : calculatedFill}
          onClick={this.handleClick}
          onTap={this.handleClick}
          draggable
          stroke={isInProgress ? outlineColor : calculatedStroke}
          strokeWidth={isInProgress ? 1 : calculatedStrokeWidth}
          onDragStart={this.onDragStart}
          onDragMove={this.handleOnDragEnd}
          onDragEnd={(e) => this.handleOnDragEnd(e, true)}
          x={x}
          y={y}
        />

        {showPoints &&
          points.map((point, index) => (
            <Circle
              key={index}
              className={classes.circle}
              x={point.x}
              y={point.y}
              radius={5}
              fill={index === 0 && id === 'newPolygon' ? 'blue' : 'white'}
              stroke={HOVERED_COLOR}
              strokeWidth={1}
              onClick={this.handleClick}
              onDragStart={this.onDragStart}
              onDragMove={(e) => {
                this.handleOnDragVertex(e, index);
              }}
              onDragEnd={(e) => {
                this.handleOnDragVertex(e, index, true);
              }}
              draggable
            />
          ))}
        {!this.state.isDragging && this.state.hovered && (
          <DeleteWidget x={x} y={y} id={id} handleWidgetClick={this.handleDelete} points={points} />
        )}
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
  imageHeight: PropTypes.number,
  imageWidth: PropTypes.number,
  hotspotColor: PropTypes.string.isRequired,
  selectedHotspotColor: PropTypes.string,
  hoverOutlineColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  addPolygonPoint: PropTypes.func.isRequired,
  onDeleteShape: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  points: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ).isRequired,
  strokeWidth: PropTypes.number,
};

PolComponent.defaultProps = {
  correct: false,
};

export default withStyles(styles)(PolComponent);
