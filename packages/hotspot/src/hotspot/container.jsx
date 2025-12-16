import React from 'react';
import PropTypes from 'prop-types';
import { Layer, Stage } from 'react-konva';
import { styled } from '@mui/material/styles';

import Rectangle from './rectangle';
import Polygon from './polygon';
import Circle from './circle';

const BaseContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: 'relative',
  background: theme.palette.common.white,
  border: `${theme.spacing(1)} solid ${theme.palette.common.white}`,
  width: 'fit-content',
}));

const ImageContainer = styled('div')({
  position: 'relative',
  width: 'fit-content',
});

const Image = styled('img')({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
});

const StyledStage = styled(Stage)({
  left: 0,
  top: 0,
  position: 'absolute',
});

export class Container extends React.Component {
  isSelected(shape) {
    const selectedShape = this.props.session.answers.filter((answer) => answer.id === shape.id)[0];
    return !!selectedShape;
  }

  correctness = (isCorrect, isChecked) => (isCorrect ? isChecked : !isChecked);

  getEvaluateText = (isCorrect, selected) => {
    if (selected && isCorrect) {
      return 'Correctly\nselected';
    }

    if (selected && !isCorrect) {
      return 'Should not have\nbeen selected';
    }

    if (!selected && isCorrect) {
      return 'Should have\nbeen selected';
    }

    return null;
  };

  render() {
    const {
      dimensions: { width: withProp, height: heightProp },
      disabled,
      hotspotColor,
      hoverOutlineColor,
      selectedHotspotColor,
      imageUrl,
      isEvaluateMode,
      outlineColor,
      onSelectChoice,
      shapes: { rectangles = [], polygons = [], circles = [] },
      scale: SCALE,
      strokeWidth,
      showCorrect,
    } = this.props;

    const width = withProp * SCALE;
    const height = heightProp * SCALE;

    return (
      <BaseContainer style={{ padding: strokeWidth / 2 }}>
        {imageUrl ? (
          <ImageContainer>
            <Image
              alt="hotspot-image"
              height="auto"
              src={imageUrl}
              style={{ width, height, maxWidth: width, maxHeight: height }}
            />
          </ImageContainer>
        ) : null}

        <StyledStage
          height={height + strokeWidth}
          width={width + strokeWidth}
          x={strokeWidth / 2}
          y={strokeWidth / 2}
        >
          <Layer>
            {rectangles.map((shape) => {
              const selected = this.isSelected(shape);
              const isCorrect = isEvaluateMode ? this.correctness(shape.correct, selected) : undefined;
              const evaluateText = isEvaluateMode ? this.getEvaluateText(shape.correct, selected) : null;
              const markAsCorrect = !!(isEvaluateMode && showCorrect && shape.correct);

              return (
                <Rectangle
                  scale={SCALE}
                  isEvaluateMode={isEvaluateMode}
                  isCorrect={isCorrect}
                  evaluateText={evaluateText}
                  disabled={disabled}
                  selected={selected}
                  height={shape.height}
                  hotspotColor={hotspotColor}
                  hoverOutlineColor={hoverOutlineColor}
                  selectedHotspotColor={selectedHotspotColor}
                  id={shape.id}
                  key={shape.id}
                  onClick={onSelectChoice}
                  outlineColor={outlineColor}
                  width={shape.width}
                  x={shape.x}
                  y={shape.y}
                  strokeWidth={strokeWidth}
                  markAsCorrect={markAsCorrect}
                  showCorrectEnabled={showCorrect}
                />
              );
            })}
            {polygons.map((polygon) => {
              const selected = this.isSelected(polygon);
              const isCorrect = isEvaluateMode ? this.correctness(polygon.correct, selected) : undefined;
              const evaluateText = isEvaluateMode ? this.getEvaluateText(polygon.correct, selected) : null;
              const markAsCorrect = !!(isEvaluateMode && showCorrect && polygon.correct);

              return (
                <Polygon
                  scale={SCALE}
                  isEvaluateMode={isEvaluateMode}
                  isCorrect={!!isCorrect}
                  evaluateText={evaluateText}
                  disabled={disabled}
                  selected={selected}
                  hotspotColor={hotspotColor}
                  id={polygon.id}
                  key={polygon.id}
                  onClick={onSelectChoice}
                  outlineColor={outlineColor}
                  points={polygon.points}
                  strokeWidth={strokeWidth}
                  markAsCorrect={markAsCorrect}
                  selectedHotspotColor={selectedHotspotColor}
                  hoverOutlineColor={hoverOutlineColor}
                  showCorrectEnabled={showCorrect}
                />
              );
            })}
            {circles.map((shape) => {
              const selected = this.isSelected(shape);
              const isCorrect = isEvaluateMode ? this.correctness(shape.correct, selected) : undefined;
              const evaluateText = isEvaluateMode ? this.getEvaluateText(shape.correct, selected) : null;
              const markAsCorrect = !!(isEvaluateMode && showCorrect && shape.correct);

              return (
                <Circle
                  scale={SCALE}
                  isEvaluateMode={isEvaluateMode}
                  isCorrect={isCorrect}
                  evaluateText={evaluateText}
                  disabled={disabled}
                  selected={selected}
                  radius={shape.radius}
                  hotspotColor={hotspotColor}
                  id={shape.id}
                  key={shape.id}
                  onClick={onSelectChoice}
                  outlineColor={outlineColor}
                  x={shape.x}
                  y={shape.y}
                  strokeWidth={strokeWidth}
                  markAsCorrect={markAsCorrect}
                  selectedHotspotColor={selectedHotspotColor}
                  hoverOutlineColor={hoverOutlineColor}
                  showCorrectEnabled={showCorrect}
                />
              );
            })}
          </Layer>
        </StyledStage>
      </BaseContainer>
    );
  }
}

Container.propTypes = {
  dimensions: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  hotspotColor: PropTypes.string.isRequired,
  hoverOutlineColor: PropTypes.string,
  imageUrl: PropTypes.string.isRequired,
  isEvaluateMode: PropTypes.bool.isRequired,
  onSelectChoice: PropTypes.func.isRequired,
  outlineColor: PropTypes.string.isRequired,
  selectedHotspotColor: PropTypes.string,
  session: PropTypes.object.isRequired,
  shapes: PropTypes.object.isRequired,
  strokeWidth: PropTypes.number,
  scale: PropTypes.number,
  showCorrect: PropTypes.bool,
};

Container.defaultProps = {
  scale: 1,
};

export default Container;
