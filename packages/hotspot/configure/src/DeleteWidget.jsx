import React from 'react';
import PropTypes from 'prop-types';
import { Group } from 'react-konva';
import { faDelete } from './icons';
import Image from './image';
import { calculate } from './utils';

const DeleteWidget = ({ height, id, width, x, y, points, outlineColor, handleWidgetClick }) => {
  let positionX, positionY;
  // if points exist we have an irregular form (polygon) and position should be computed
  if (points) {
    const { x, y } = calculate(points);
    positionX = x;
    positionY = y;
  } else {
    positionX = x + width - 20; // 10 pixels to the left
    positionY = y + height - 20; // 10 pixels above
  }

  return (
    <Group onClick={() => handleWidgetClick(id)}>
      <Image width={20} height={20} x={positionX} y={positionY} src={faDelete} />
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
  points: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ),
  outlineColor: PropTypes.string.isRequired,
};

export default DeleteWidget;
