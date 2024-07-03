import React from 'react';
import PropTypes from 'prop-types';
import { Layer, Stage } from 'react-konva';
import cloneDeep from 'lodash/cloneDeep';
import { withStyles } from '@material-ui/core/styles/index';

import Rectangle from './hotspot-rectangle';
import Polygon from './hotspot-polygon';
import Circle from './hotspot-circle';
import { updateImageDimensions, getUpdatedShapes } from './utils';
import RectangleShape from './shapes/rectagle';
import CircleShape from './shapes/circle';
import PolygonShape from './shapes/polygon';
const IMAGE_MAX_WIDTH = 800;

export class Drawable extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // Update the state only if the props have changed
    if (nextProps.shapes !== prevState.shapes) {
      return { shapes: nextProps.shapes };
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      isDrawing: false,
      stateShapes: false,
      resizing: false,
      temporaryPolygon: null,
      shapes: [],
      dimensions: {
        height: 0,
        width: 0,
      },
    };
  }

  handleOnMouseDown = (e) => {
    const { shapeType, onUpdateShapes, shapes } = this.props;
    let newState, newShapeId;

    // Ensure that the click originated from the expected element
    if (e.target !== e.currentTarget) {
      return;
    }

    switch (shapeType) {
      case 'rectangle':
        newState = RectangleShape.create(shapes, e);
        break;
      case 'circle':
        newState = CircleShape.create(shapes, e);
        break;
      case 'polygon':
        newShapeId = this.state.isDrawingShapeId;

        if (newShapeId) {
          // If a polygon is in progress, add a new point
          const shapes = this.addPolygonPoint(e);

          newState = {
            isDrawing: true,
            isDrawingShapeId: newShapeId,
            shapes: shapes,
          };
        } else {
          // Else start a new one
          newState = PolygonShape.create(shapes, e);
        }
        break;
      default:
        console.error(`Unsupported shape type: ${shapeType}`);
        return;
    }

    this.setState({
      ...newState,
    });

    onUpdateShapes(newState.shapes);
  };

  addPolygonPoint(e) {
    const { shapes } = PolygonShape.addPoint(this.state, e, (newShapes) => {
      this.setState({
        isDrawing: false,
        shapes: newShapes,
        isDrawingShapeId: undefined,
      });

      this.props.onUpdateShapes(newShapes);
    });

    return shapes;
  }

  handleOnMouseUp = () => {
    const { shapeType, onUpdateShapes } = this.props;
    let newState;

    if (shapeType === 'polygon') {
      return;
    }

    switch (shapeType) {
      case 'rectangle':
        newState = RectangleShape.finalizeCreation(this.state, this.props);
        break;
      case 'circle':
        newState = CircleShape.finalizeCreation(this.state, this.props);
        break;
      default:
        console.error(`Unsupported shape type: ${shapeType}`);
        return;
    }

    this.setState({
      ...newState,
      isDrawing: false,
    });

    onUpdateShapes(newState.shapes);
  };

  handleMouseMove = (e) => {
    const { shapeType, onUpdateShapes, shapes } = this.props;
    let newState;

    if (this.state.isDrawing) {
      switch (shapeType) {
        case 'rectangle':
          newState = RectangleShape.handleMouseMove(this.state, e);
          break;
        case 'circle':
          newState = CircleShape.handleMouseMove(this.state, e);
          break;
        case 'polygon':
          newState = PolygonShape.handleMouseMove(this.state, e);
          break;
        default:
          console.error(`Unsupported shape type: ${shapeType}`);
          return;
      }

      this.setState(newState);
      onUpdateShapes(newState.shapes);
    }
  };

  handleOnMouseOutOrLeave = (e) => {
    if (this.state.isDrawing) {
      this.handleOnMouseUp(e);
    }
  };

  handleOnDragEnd = (id, updatedProps) => {
    const { shapes, onUpdateShapes, dimensions } = this.props;
    const { width: canvasWidth, height: canvasHeight } = dimensions;

    const newShapes = shapes.filter((shape) => {
      if (shape.id === id) {
        let newX = updatedProps.x;
        let newY = updatedProps.y;

        if (shape.group === 'rectangles') {
          if (newX < 0 || newX + shape.width > canvasWidth || newY < 0 || newY + shape.height > canvasHeight) {
            return false; // remove shape
          }
        } else if (shape.group === 'circles') {
          const radius = shape.radius;
          if (newX - radius < 0 || newX + radius > canvasWidth || newY - radius < 0 || newY + radius > canvasHeight) {
            return false; // remove shape
          }
        } else if (shape.group === 'polygons') {
          const points = shape.points;
          const minX = Math.min(...points.filter((_, index) => index % 2 === 0));
          const minY = Math.min(...points.filter((_, index) => index % 2 !== 0));
          const maxX = Math.max(...points.filter((_, index) => index % 2 === 0));
          const maxY = Math.max(...points.filter((_, index) => index % 2 !== 0));

          const deltaX = updatedProps.x - shape.x;
          const deltaY = updatedProps.y - shape.y;

          const newMinX = minX + deltaX;
          const newMinY = minY + deltaY;
          const newMaxX = maxX + deltaX;
          const newMaxY = maxY + deltaY;

          if (newMinX < 0 || newMaxX > canvasWidth || newMinY < 0 || newMaxY > canvasHeight) {
            return false; // remove shape
          }

          const newPoints = points.map((point, index) =>
            index % 2 === 0 ? point + deltaX : point + deltaY
          );

          return { ...shape, points: newPoints, x: newX, y: newY };
        }

        return { ...shape, x: newX, y: newY };
      }
      return shape;
    });

    onUpdateShapes(cloneDeep(newShapes));
  };

  handleOnSetAsCorrect = (shape) => {
    const { id } = shape;
    const { multipleCorrect, shapes, onUpdateShapes } = this.props;

    let newShapes = [];

    if (multipleCorrect) {
      newShapes = shapes.map((shape) => {
        if (shape.id === id) {
          shape.correct = !shape.correct;
        }
        return shape;
      });
    } else {
      newShapes = shapes.map((shape) => {
        shape.correct = shape.id === id;
        return shape;
      });
    }

    onUpdateShapes(cloneDeep(newShapes));
  };
  /// end of handling HotSpots section

  /// start of handling Image section
  handleOnImageLoad = ({ target }) => {
    const { onUpdateImageDimension } = this.props;
    const resizeHandle = this.resize;
    const elementStyle = getComputedStyle(target);
    const newHeight = parseFloat(elementStyle.height);
    const newWidth = parseFloat(elementStyle.width);
    const aspectWidth = newWidth / IMAGE_MAX_WIDTH;

    const dimensions =
      newWidth > IMAGE_MAX_WIDTH
        ? {
            height: newHeight / aspectWidth,
            width: IMAGE_MAX_WIDTH,
          }
        : {
            height: newHeight,
            width: newWidth,
          };

    this.setState({ dimensions }, () => onUpdateImageDimension(dimensions));

    resizeHandle.addEventListener('mousedown', this.initialiseResize, false);
  };

  initialiseResize = () => {
    window.addEventListener('mousemove', this.startResizing, false);
    window.addEventListener('mouseup', this.stopResizing, false);
  };

  checkIfResizeValid(x, y) {
    const { shapes } = this.state;
    let drawable = true;

    // Do not allow resizing over the hotspots
    shapes &&
      shapes.forEach((shape) => {
        const right = shape.x + shape.width + 5;
        const bottom = shape.y + shape.height + 5;
        if (x <= right || y <= bottom) {
          drawable = false;
        }
      });
    return drawable;
  }

  startResizing = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const box = this.image;
    const { disableDrag, preserveAspectRatioEnabled, dimensions, shapes } = this.props;

    // todo previously we had state.dimensions, is it needed?
    const { width, height } = updateImageDimensions(
      dimensions,
      {
        width: e.clientX - bounds.left,
        height: e.clientY - bounds.top,
      },
      preserveAspectRatioEnabled,
    );

    const resizeValid = this.checkIfResizeValid(width, height);
    const hasMinimumWidth = width > 150 && height > 150;

    if (resizeValid && hasMinimumWidth && box) {
      box.style.width = `${width}px`;
      box.style.height = `${height}px`;

      this.setState({
        resizing: true,
        dimensions: { height: height, width: width },
        stateShapes: getUpdatedShapes(dimensions, { width, height }, shapes),
      });
    }

    disableDrag();
  };

  stopResizing = () => {
    const { enableDrag, onUpdateImageDimension, onUpdateShapes } = this.props;
    const { dimensions, stateShapes } = this.state;

    enableDrag();

    if (stateShapes) {
      onUpdateShapes(cloneDeep(stateShapes));
    }

    onUpdateImageDimension(dimensions);

    window.removeEventListener('mousemove', this.startResizing, false);
    window.removeEventListener('mouseup', this.stopResizing, false);

    this.setState({ resizing: false, stateShapes: false });
  };

  deleteShape = (id) => {
    this.setState({
      isDrawing: false,
      isDrawingShapeId: undefined,
    });
    this.props.onDeleteShape(id);
  }
  /// end of handling Image section

  render() {
    const {
      classes,
      imageUrl,
      dimensions: { height, width },
      hotspotColor,
      outlineColor,
      shapes,
      strokeWidth,
      onDeleteShape,
    } = this.props;
    const {
      stateShapes,
      isDrawing,
      dimensions: { height: heightFromState, width: widthFromState },
    } = this.state;
    const shapesToUse = stateShapes || shapes;

    return (
      <div className={classes.base}>
        {imageUrl && (
          <div className={classes.imageContainer}>
            <img
              className={classes.image}
              onLoad={this.handleOnImageLoad}
              ref={(ref) => {
                this.image = ref;
              }}
              src={imageUrl}
              {...(height && width ? { style: { height, width } } : {})}
            />
            <div
              ref={(ref) => {
                this.resize = ref;
              }}
              className={classes.resize}
            />
          </div>
        )}

        <Stage
          className={classes.stage}
          height={heightFromState || height}
          width={widthFromState || width}
          onMouseDown={this.handleOnMouseDown}
          onMouseUp={this.handleOnMouseUp}
          onMouseMove={this.handleMouseMove}
          onContentMouseOut={this.handleOnMouseOutOrLeave}
          onContentMouseLeave={this.handleOnMouseOutOrLeave}
        >
          <Layer>
            {shapesToUse.map((shape, i) => {
              let Tag;
              switch (shape.group) {
                case 'rectangles':
                  Tag = Rectangle;
                  break;
                case 'circles':
                  Tag = Circle;
                  break;
                case 'polygons':
                  Tag = Polygon;
                  break;
                default:
                  return null;
              }

              return (
                <Tag
                  correct={shape.correct}
                  isDrawing={isDrawing}
                  {...(shape.group === 'circles'
                    ? { radius: shape.radius }
                    : { height: shape.height, width: shape.width })}
                  hotspotColor={hotspotColor}
                  id={shape.id}
                  key={i}
                  onClick={() => this.handleOnSetAsCorrect(shape)}
                  onDragEnd={this.handleOnDragEnd}
                  onDeleteShape={this.deleteShape}
                  outlineColor={outlineColor}
                  width={shape.width}
                  x={shape.x}
                  y={shape.y}
                  {...(shape.group === 'polygons' ? { points: shape.points } : {})}
                  strokeWidth={strokeWidth}
                  imageHeight={heightFromState || height}
                  imageWidth={widthFromState || width}
                  {...(shape.group === 'polygons' ? { addPolygonPoint: (e) => this.addPolygonPoint(e) } : {})}
                  dragBoundFunc={(pos) => {
                    let newX = pos.x;
                    let newY = pos.y;

                    if (shape.group === 'rectangles') {
                      newX = Math.max(0, Math.min(pos.x, (widthFromState || width) - shape.width));
                      newY = Math.max(0, Math.min(pos.y, (heightFromState || height) - shape.height));
                    } else if (shape.group === 'circles') {
                      const radius = shape.radius;
                      newX = Math.max(radius, Math.min(pos.x, (widthFromState || width) - radius));
                      newY = Math.max(radius, Math.min(pos.y, (heightFromState || height) - radius));
                    } else if (shape.group === 'polygons') {
                      const points = shape.points;
                      const minX = Math.min(...points.filter((_, index) => index % 2 === 0));
                      const minY = Math.min(...points.filter((_, index) => index % 2 !== 0));
                      const maxX = Math.max(...points.filter((_, index) => index % 2 === 0));
                      const maxY = Math.max(...points.filter((_, index) => index % 2 !== 0));

                      const deltaX = pos.x - shape.x;
                      const deltaY = pos.y - shape.y;

                      let constrainedDeltaX = deltaX;
                      let constrainedDeltaY = deltaY;

                      if (minX + deltaX < 0) constrainedDeltaX = -minX;
                      if (maxX + deltaX > (widthFromState || width)) constrainedDeltaX = (widthFromState || width) - maxX;
                      if (minY + deltaY < 0) constrainedDeltaY = -minY;
                      if (maxY + deltaY > (heightFromState || height)) constrainedDeltaY = (heightFromState || height) - maxY;

                      const newPoints = points.map((point, index) =>
                        index % 2 === 0 ? point + constrainedDeltaX : point + constrainedDeltaY
                      );

                      return {
                        x: shape.x + constrainedDeltaX,
                        y: shape.y + constrainedDeltaY,
                        points: newPoints,
                      };
                    }

                    return {
                      x: newX,
                      y: newY,
                    };
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    );
  }
}

const styles = () => ({
  base: {
    position: 'relative',
  },
  image: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: 'fit-content',
  },
  resize: {
    borderBottom: '1px solid #727272',
    borderRight: '1px solid #727272',
    bottom: '-10px',
    cursor: 'se-resize',
    height: '10px',
    position: 'absolute',
    right: '-10px',
    width: '10px',
  },
  stage: {
    left: 0,
    top: 0,
    position: 'absolute',
  },
});

Drawable.propTypes = {
  classes: PropTypes.object.isRequired,
  disableDrag: PropTypes.func.isRequired,
  dimensions: PropTypes.object.isRequired,
  enableDrag: PropTypes.func.isRequired,
  shapeType: PropTypes.oneOf(['rectangle', 'circle', 'polygon']),
  imageUrl: PropTypes.string.isRequired,
  handleFinishDrawing: PropTypes.func.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  multipleCorrect: PropTypes.bool.isRequired,
  onUpdateImageDimension: PropTypes.func.isRequired,
  onUpdateShapes: PropTypes.func.isRequired,
  onDeleteShape: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  shapes: PropTypes.array.isRequired,
  strokeWidth: PropTypes.number,
  preserveAspectRatioEnabled: PropTypes.bool,
};

export default withStyles(styles)(Drawable);
