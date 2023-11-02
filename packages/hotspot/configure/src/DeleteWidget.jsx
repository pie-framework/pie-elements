import React from 'react';
import PropTypes from 'prop-types';
import { Group } from 'react-konva';
import { faDelete } from './icons';
import Image from './image';

function calculate(polygonPoints) {
  let minX = polygonPoints[0].x;
  let minY = polygonPoints[0].y;
  let maxX = polygonPoints[0].x;
  let maxY = polygonPoints[0].y;

  polygonPoints.forEach((point) => {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  });

  // Find a suitable position for the text element within the polygon
  let textX, textY;

  for (let x = minX; x <= maxX - 20; x++) {
    for (let y = maxY - 20; y > minY; y--) {
      // Check if the text element's position (x, y) is within the polygon
      if (isPointInsidePolygon(polygonPoints, x, y)) {
        textX = x - 10;
        textY = y;
        break;
      }
    }
  }

  return { x: textX, y: textY };
}

function isPointInsidePolygon(polygon, x, y) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

const DeleteWidget = ({ height, id, width, x, y, points, outlineColor, handleWidgetClick }) => {
  let positionX, positionY;
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
