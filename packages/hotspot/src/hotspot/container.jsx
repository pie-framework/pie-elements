import React from 'react';
import PropTypes from 'prop-types';
import { Layer, Stage } from 'react-konva';
import { withStyles } from '@material-ui/core/styles';
import { color } from '@pie-lib/render-ui';

import Rectangle from './rectangle';
import Polygon from './polygon';

export class Container extends React.Component {
  isSelected(shape) {
    const selectedShape = this.props.session.answers.filter(answer => answer.id === shape.id)[0];
    return !!selectedShape;
  }

  correctness = (isCorrect, isChecked) => isCorrect ? isChecked : !isChecked;

  render() {
    const {
      classes,
      dimensions: { width, height },
      disabled,
      hotspotColor,
      imageUrl,
      isEvaluateMode,
      outlineColor,
      onSelectChoice,
      shapes: { rectangles, polygons },
      strokeWidth
    } = this.props;

    return (
      <div
        className={classes.base}
        style={{ padding: strokeWidth / 2 }}
      >
        {imageUrl ? (
          <div className={classes.imageContainer}>
            <img
              className={classes.image}
              height="auto"
              src={imageUrl}
              style={{ width, height, maxWidth: width, maxHeight: height }}
            />
          </div>
        ) : null}

        <Stage
          className={classes.stage}
          height={height + strokeWidth}
          width={width + strokeWidth}
          x={strokeWidth / 2}
          y={strokeWidth / 2}
        >
          <Layer>
            {rectangles.map((shape) => {
              const selected = this.isSelected(shape);
              const isCorrect = isEvaluateMode ? this.correctness(shape.correct, selected) : undefined;

              return (
                <Rectangle
                  isEvaluateMode={isEvaluateMode}
                  isCorrect={isCorrect}
                  disabled={disabled}
                  selected={selected}
                  height={shape.height}
                  hotspotColor={hotspotColor}
                  id={shape.id}
                  key={shape.id}
                  onClick={onSelectChoice}
                  outlineColor={outlineColor}
                  width={shape.width}
                  x={shape.x}
                  y={shape.y}
                  strokeWidth={strokeWidth}
                />
              )
            })}
            {polygons.map((polygon) => {
              const selected = this.isSelected(polygon);
              const isCorrect = isEvaluateMode ? this.correctness(polygon.correct, selected) : undefined;

              return (
                <Polygon
                  isEvaluateMode={isEvaluateMode}
                  isCorrect={!!isCorrect}
                  disabled={disabled}
                  selected={selected}
                  hotspotColor={hotspotColor}
                  id={polygon.id}
                  key={polygon.id}
                  onClick={onSelectChoice}
                  outlineColor={outlineColor}
                  points={polygon.points}
                  strokeWidth={strokeWidth}
                />
              )
            })}
          </Layer>
        </Stage>
      </div>
    );
  }
}

const styles = theme => ({
  base: {
    marginTop: theme.spacing.unit * 3,
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
  stage: {
    left: 0,
    top: 0,
    position: 'absolute'
  },
  resize: {
    borderBottom: `1px solid ${color.disabled()}`,
    borderRight: `1px solid ${color.disabled()}`,
    bottom: '-10px',
    cursor: 'se-resize',
    height: '10px',
    position: 'absolute',
    right: '-10px',
    width: '10px',
  }
});

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  dimensions: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  hotspotColor:PropTypes.string.isRequired,
  imageUrl:PropTypes.string.isRequired,
  isEvaluateMode:PropTypes.bool.isRequired,
  onSelectChoice:PropTypes.func.isRequired,
  outlineColor:PropTypes.string.isRequired,
  session:PropTypes.object.isRequired,
  shapes:PropTypes.object.isRequired,
  strokeWidth: PropTypes.number
};

export default withStyles(styles)(Container);
