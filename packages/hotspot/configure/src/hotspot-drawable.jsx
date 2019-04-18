import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { Layer, Stage } from 'react-konva';

import Rectangle from './hotspot-rectangle';
import {withStyles} from "@material-ui/core/styles/index";

class Drawable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shapes: [],
      isDrawing: false,
      isDrawingMode: true,
      dimensions: {
        height: 0,
        width: 0,
      }
    }
  }

  handleClick = (e) => {
    const { isDrawing, isDrawingMode } = this.state;
    const { onChangeShapes } = this.props;

    if (!isDrawingMode) {
      return;
    }
    if (isDrawing) {
      this.setState({
        isDrawing: !isDrawing
      });
      return;
    }

    const newShapes = this.props.shapes.slice();
    newShapes.push({
      height: 0,
      width: 0,
      x: e.evt.layerX,
      y: e.evt.layerY
    });

    this.setState({
      isDrawing: true,
      shapes: newShapes
    });
    onChangeShapes(newShapes);
  };

  handleOnRemove = (index) => {
    this.setState({
      shapes: this.props.shapes.filter((_, i) => i !== index)
    });
  };

  handleMouseMove= (e) => {
    const { isDrawing, isDrawingMode } = this.state;
    const { shapes, onChangeShapes } = this.props;

    if (!isDrawingMode) {
      return;
    }

    if (isDrawing) {
      const mouseX = e.evt.layerX;
      const mouseY = e.evt.layerY;

      const currShapeIndex = shapes.length - 1;
      const currShape = shapes[currShapeIndex];
      const newWidth = mouseX - currShape.x;
      const newHeight = mouseY - currShape.y;

      const newShapesList = shapes.slice();
      newShapesList[currShapeIndex] = {
        height: newHeight,
        width: newWidth,
        x: currShape.x,
        y: currShape.y
      };

      this.setState({
        shapes: newShapesList,
      });
      onChangeShapes(newShapesList);
    }
  };

  handleOnImageLoad = ({ target: { offsetHeight, offsetWidth } }) => {
    const resizeHandle = this.resize;
    this.setState({
      dimensions: {
        height: offsetHeight,
        width: offsetWidth
      }});
    resizeHandle.addEventListener('mousedown', this.initialiseResize, false);
  };

  initialiseResize = () => {
    console.log('This: ', this);
    window.addEventListener('mousemove', this.startResizing, false);
    window.addEventListener('mouseup', this.stopResizing, false);
  };

  startResizing = (e) => {
    const box = this.image;
    const { maxImageHeight, maxImageWidth, disableDrag } = this.props;

    disableDrag();

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
    const { enableDrag } = this.props;
    enableDrag();
    window.removeEventListener('mousemove', this.startResizing, false);
    window.removeEventListener('mouseup', this.stopResizing, false);
  };

  render() {
    const { dimensions: { height, width }, isDrawing, isDrawingMode } = this.state;
    const { imageUrl, hotspotColor, outlineColor, classes, maxImageWidth, maxImageHeight, shapes } = this.props;

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
          onClick={this.handleClick}
          onContentMouseMove={this.handleMouseMove}
          width={width}
        >
          <Layer>
            {shapes.map((shape, index) => (
              <Rectangle
                isDrawing={isDrawing}
                isDrawingMode={isDrawingMode}
                height={shape.height}
                hotspotColor={hotspotColor}
                index={index}
                key={index}
                onRemove={this.handleOnRemove}
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

const styles = theme => ({
  base: {
    position: 'relative'
  },
  stage: {
    left: 0,
    top: 0,
    position: 'absolute'
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
    width: '10px',
  }
});

Drawable.propTypes = {
  classes: PropTypes.object.isRequired,
  disableDrag:PropTypes.func.isRequired,
  enableDrag:PropTypes.func.isRequired,
  imageUrl:PropTypes.string.isRequired,
  hotspotColor:PropTypes.string.isRequired,
  maxImageHeight:PropTypes.number.isRequired,
  maxImageWidth:PropTypes.number.isRequired,
  onChangeShapes:PropTypes.func.isRequired,
  outlineColor:PropTypes.string.isRequired,
  shapes:PropTypes.shape([]).isRequired,
};

export default withStyles(styles)(Drawable);
