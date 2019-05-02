import React from 'react';
import PropTypes from 'prop-types';
import { Layer, Stage } from 'react-konva';
import { withStyles } from '@material-ui/core/styles/index';

import Rectangle from './hotspot-rectangle';

const generateUniqueId = () =>
  Math.random().toString(36).substring(2)
  + (new Date()).getTime().toString(36);

class Drawable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      stateShapes: false,
      dimensions: {
        height: 0,
        width: 0,
      }
    }
  }

  handleOnStageClick = (e) => {
    const { isDrawing, stateShapes } = this.state;
    const { onUpdateShapes } = this.props;

    // If we're drawing a shape, a click finishes the drawing and sends the new shapes to HOC
    if (isDrawing) {
      this.setState({ isDrawing: !isDrawing, stateShapes: false });
      onUpdateShapes(stateShapes);
      return;
    }

    // Otherwise, add a new rectangle at the mouse position with 0 width and height
    const newShapes = this.props.shapes.slice();
    newShapes.push({
      id: generateUniqueId(),
      height: 0,
      width: 0,
      x: e.evt.layerX,
      y: e.evt.layerY
    });

    this.setState({ isDrawing: true });
    onUpdateShapes(newShapes);
  };

  handleOnSetAsCorrect = (id) => {
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

    onUpdateShapes(newShapes);
  };

  handleOnDragEnd = (id, { x, y }) => {
    const { shapes, onUpdateShapes } = this.props;

    const newShapes = shapes.map(shape => {
      if (shape.id === id) {
        return {
          ...shape,
          x,
          y,
        }
      }
      return shape;
    });

    onUpdateShapes(newShapes);
  };

  handleMouseMove= (e) => {
    const { isDrawing } = this.state;
    const { shapes } = this.props;

    if (isDrawing) {
      const mouseX = e.evt.layerX;
      const mouseY = e.evt.layerY;

      const currShapeIndex = shapes.length - 1;
      const currShape = shapes[currShapeIndex];
      const newWidth = mouseX - currShape.x;
      const newHeight = mouseY - currShape.y;

      const newShapesList = shapes.slice();
      newShapesList[currShapeIndex] = {
        id: currShape.id,
        height: newHeight,
        width: newWidth,
        x: currShape.x,
        y: currShape.y
      };
      // On mouse move don't trigger any event. Put the shapes on this state instead.
      this.setState({ stateShapes: newShapesList });
    }
  };

  handleOnImageLoad = ({ target: { offsetHeight, offsetWidth } }) => {
    const { onUpdateImageDimension } = this.props;
    const resizeHandle = this.resize;

    const dimensions = {
      height: offsetHeight,
      width: offsetWidth
    };

    this.setState({ dimensions });
    onUpdateImageDimension(dimensions);

    resizeHandle.addEventListener('mousedown', this.initialiseResize, false);
  };

  initialiseResize = () => {
    window.addEventListener('mousemove', this.startResizing, false);
    window.addEventListener('mouseup', this.stopResizing, false);
  };

  startResizing = (e) => {
    const box = this.image;
    const { maxImageHeight, maxImageWidth, disableDrag } = this.props;

    const bounds = e.target.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const resizeValid = this.checkIfResizeValid(x, y);
    const fitsContainer = y < maxImageHeight && x < maxImageWidth;
    const hasMinimumWidth = x > 150 && y > 150;

    if (fitsContainer && resizeValid && hasMinimumWidth) {
      box.style.width = `${x}px`;
      box.style.height = `${y}px`;

      this.setState({ dimensions:{ height: y, width: x }});
    }

    disableDrag();
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

  stopResizing = () => {
    const { enableDrag, onUpdateImageDimension } = this.props;
    const { dimensions } = this.state;

    enableDrag();
    onUpdateImageDimension(dimensions);

    window.removeEventListener('mousemove', this.startResizing, false);
    window.removeEventListener('mouseup', this.stopResizing, false);
  };

  render() {
    const {
      classes,
      imageUrl,
      hotspotColor,
      maxImageHeight,
      maxImageWidth,
      outlineColor,
      shapes
    } = this.props;
    const {
      stateShapes,
      dimensions: { height, width },
      isDrawing
    } = this.state;
    const shapesToUse = stateShapes || shapes;

    return (
      <div className={classes.base}>
        {imageUrl ? (
          <div className={classes.imageContainer}>
            <img
              className={classes.image}
              height="auto"
              onLoad={this.handleOnImageLoad}
              ref={ref => { this.image = ref; }}
              src={imageUrl}
              style={{ maxWidth: maxImageWidth, maxHeight: maxImageHeight }}
            />
            <div ref={ref => { this.resize = ref; }} className={classes.resize} />
          </div>
        ) : null}

        <Stage
          className={classes.stage}
          height={height}
          onClick={this.handleOnStageClick}
          onContentMouseMove={this.handleMouseMove}
          width={width}
        >
          <Layer>
            {shapesToUse.map((shape, index) => (
              <Rectangle
                correct={shape.correct}
                isDrawing={isDrawing}
                height={shape.height}
                hotspotColor={hotspotColor}
                id={shape.id}
                key={index}
                onClick={this.handleOnSetAsCorrect}
                onDragEnd={this.handleOnDragEnd}
                outlineColor={outlineColor}
                width={shape.width}
                x={shape.x}
                y={shape.y}
              />
            ))}
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
  enableDrag: PropTypes.func.isRequired,
  imageUrl: PropTypes.string.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  maxImageHeight: PropTypes.number.isRequired,
  maxImageWidth: PropTypes.number.isRequired,
  multipleCorrect: PropTypes.bool.isRequired,
  onUpdateImageDimension: PropTypes.func.isRequired,
  onUpdateShapes: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  shapes: PropTypes.shape([]).isRequired
};

export default withStyles(styles)(Drawable);
