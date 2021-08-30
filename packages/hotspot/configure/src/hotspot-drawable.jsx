import React from 'react';
import PropTypes from 'prop-types';
import { Layer, Stage } from 'react-konva';
import max from 'lodash/max';
import cloneDeep from 'lodash/cloneDeep';
import { withStyles } from '@material-ui/core/styles/index';

import Rectangle from './hotspot-rectangle';
import Polygon from './hotspot-polygon';
import { updateImageDimensions, getUpdatedShapes } from './utils';

const IMAGE_MAX_WIDTH = 800;

export class Drawable extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    let dimensions = nextProps.dimensions;

    if (prevState && prevState.resizing) {
      dimensions = prevState.dimensions;
    }

    return {
      ...prevState,
      dimensions: dimensions,
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      isDrawing: false,
      stateShapes: false,
      resizing: false,
      dimensions: {
        height: 0,
        width: 0,
      },
    }
  }

  /// start of handling HotSpots section
  handleOnMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      const { onUpdateShapes, shapes } = this.props;
      // Add a new rectangle at the mouse position with 0 width and height
      const newShapes = shapes.slice();
      const value = max(newShapes.map(c => parseInt(c.id)).filter(id => !isNaN(id))) || 0;

      newShapes.push({
        id: `${value + 1}`,
        height: 0,
        width: 0,
        x: e.evt.layerX,
        y: e.evt.layerY,
        group: 'rectangles',
        index: shapes.length
      });

      this.setState({ isDrawing: true, isDrawingShapeId: `${value + 1}` });
      onUpdateShapes(newShapes);
    }
  };

  handleOnMouseUp = () => {
    // !IMPORTANT: currently, only 'rectangles' are drawable
    const { isDrawing, stateShapes } = this.state;
    const { onUpdateShapes } = this.props;

    // If we're drawing a shape, a click finishes the drawing and sends the new shapes to HOC
    if (isDrawing) {
      this.setState({ isDrawing: !isDrawing, stateShapes: false, isDrawingShapeId: undefined });

      if (stateShapes) {
        onUpdateShapes(stateShapes);
      }
    }
  };

  handleMouseMove = (e) => {
    // !IMPORTANT: currently, only 'rectangles' are drawable
    const { isDrawing, isDrawingShapeId } = this.state;
    const { shapes } = this.props;

    if (isDrawing && isDrawingShapeId) {
      const mouseX = e.evt.layerX;
      const mouseY = e.evt.layerY;

      const currShapeIndex = shapes.findIndex(shape => shape.id === isDrawingShapeId);
      const currShape = shapes[currShapeIndex];

      if (currShape) {
        const newWidth = mouseX - currShape.x;
        const newHeight = mouseY - currShape.y;

        const newShapesList = shapes.slice();

        newShapesList[currShapeIndex] = {
          ...newShapesList[currShapeIndex],
          height: newHeight,
          width: newWidth,
          x: currShape.x,
          y: currShape.y
        };

        // On mouse move don't trigger any event. Put the shapes on this state instead.
        this.setState({ stateShapes: newShapesList });
      }
    }
  };

  handleOnDragEnd = (id, updatedProps) => {
    const { shapes, onUpdateShapes } = this.props;
    const newShapes = shapes.map(shape => {
      if (shape.id === id) {
        return {
          ...shape,
          ...updatedProps
        }
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
      newShapes = shapes.map(shape => {
        if (shape.id === id) {
          shape.correct = !shape.correct;
        }
        return shape;
      })
    } else {
      newShapes = shapes.map(shape => {
        shape.correct = shape.id === id;
        return shape;
      })
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

    const dimensions = newWidth > IMAGE_MAX_WIDTH ? {
      height: newHeight / aspectWidth,
      width: IMAGE_MAX_WIDTH
    } : {
      height: newHeight,
      width: newWidth
    };

    this.setState(
      { dimensions },
      () => onUpdateImageDimension(dimensions));

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
    shapes && shapes.forEach(shape => {
      const right = shape.x + shape.width + 5;
      const bottom = shape.y + shape.height + 5;
      if (x <= right || y <= bottom) {
        drawable = false
      }
    });
    return drawable;
  }

  startResizing = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const box = this.image;
    const {
      disableDrag,
      preserveAspectRatioEnabled,
      dimensions,
      shapes
    } = this.props;

    // todo previously we had state.dimensions, is it needed?
    const { width, height } = updateImageDimensions(
      dimensions,
      {
        width: e.clientX - bounds.left,
        height: e.clientY - bounds.top
      },
      preserveAspectRatioEnabled
    );

    const resizeValid = this.checkIfResizeValid(width, height);
    const hasMinimumWidth = width > 150 && height > 150;

    if (resizeValid && hasMinimumWidth) {
      box.style.width = `${width}px`;
      box.style.height = `${height}px`;

      this.setState({
        resizing: true,
        dimensions: { height: height, width: width },
        stateShapes: getUpdatedShapes(dimensions, { width, height }, shapes)
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
  /// end of handling Image section

  render() {
    const {
      classes,
      imageUrl,
      dimensions: { height, width },
      hotspotColor,
      outlineColor,
      shapes,
      strokeWidth
    } = this.props;
    const {
      stateShapes,
      isDrawing,
      dimensions: { height: heightFromState, width: widthFromState }
    } = this.state;
    const shapesToUse = stateShapes || shapes;

    return (
      <div className={classes.base}>
        {imageUrl && (
          <div className={classes.imageContainer}>
            <img
              className={classes.image}
              onLoad={this.handleOnImageLoad}
              ref={ref => {
                this.image = ref;
              }}
              src={imageUrl}
              {...height && width ? { style: { height, width } } : {}}
            />
            <div ref={ref => {
              this.resize = ref;
            }} className={classes.resize}/>
          </div>
        )}

        <Stage
          className={classes.stage}
          height={heightFromState || height}
          width={widthFromState || width}
          onMouseDown={this.handleOnMouseDown }
          onMouseUp={this.handleOnMouseUp }
          onMouseMove={this.handleMouseMove }
        >
          <Layer>
            {shapesToUse.map((shape, index) => {
              const Tag = shape.group === 'polygons' ? Polygon : Rectangle;

              return (
                <Tag
                  correct={shape.correct}
                  isDrawing={isDrawing}
                  height={shape.height}
                  hotspotColor={hotspotColor}
                  id={shape.id}
                  key={index}
                  onClick={() => this.handleOnSetAsCorrect(shape)}
                  onDragEnd={this.handleOnDragEnd}
                  outlineColor={outlineColor}
                  width={shape.width}
                  x={shape.x}
                  y={shape.y}
                  points={shape.points}
                  strokeWidth={strokeWidth}
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
    position: 'relative'
  },
  image: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: 'fit-content'
  },
  resize: {
    borderBottom: '1px solid #727272',
    borderRight: '1px solid #727272',
    bottom: '-10px',
    cursor: 'se-resize',
    height: '10px',
    position: 'absolute',
    right: '-10px',
    width: '10px'
  },
  stage: {
    left: 0,
    top: 0,
    position: 'absolute'
  }
});

Drawable.propTypes = {
  classes: PropTypes.object.isRequired,
  disableDrag: PropTypes.func.isRequired,
  dimensions: PropTypes.object.isRequired,
  enableDrag: PropTypes.func.isRequired,
  imageUrl: PropTypes.string.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  multipleCorrect: PropTypes.bool.isRequired,
  onUpdateImageDimension: PropTypes.func.isRequired,
  onUpdateShapes: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  shapes: PropTypes.array.isRequired,
  strokeWidth: PropTypes.number,
  preserveAspectRatioEnabled: PropTypes.bool
};

export default withStyles(styles)(Drawable);
