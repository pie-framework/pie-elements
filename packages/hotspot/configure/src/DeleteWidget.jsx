import React from 'react';
import PropTypes from 'prop-types';
import { Group } from 'react-konva';
import { faDelete } from './icons';
import ImageComponent from './image-konva';
import { calculate } from './utils';

const DeleteWidget = ({ height, id, width, x, y, points, isCircle, radius, handleWidgetClick }) => {
  let positionX, positionY;
  const offset = 20;

  if (isCircle) {
    // For circles, position the delete icon above the circle
    positionX = x + radius - offset;
    positionY = y;
  } else if (points) {
    // For polygons, compute position based on points
    const calculated = calculate(points);
    positionX = calculated.x;
    positionY = calculated.y;
  } else {
    // For rectangles
    positionX = x + width - offset;
    positionY = y + height - offset;
  }

  return (
    <Group onClick={() => handleWidgetClick(id)}>
      <ImageComponent x={positionX} y={positionY} src={faDelete} />
    </Group>
  );
};

DeleteWidget.propTypes = {
  id: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  handleWidgetClick: PropTypes.func.isRequired,
  radius: PropTypes.number,
  isCircle: PropTypes.bool,
  points: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ),
};

export default DeleteWidget;
