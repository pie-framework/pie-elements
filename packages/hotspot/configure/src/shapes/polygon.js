export default class PolygonShape {
  static create(shapes, e) {
    console.log('polygon create');
    const newShapes = [...shapes];
    const newPolygon = {
      id: 'newPolygon',
      points: [{ x: e.evt.layerX, y: e.evt.layerY }],
      group: 'polygons',
      index: newShapes.length,
    };

    newShapes.push(newPolygon);

    return {
      shapes: newShapes,
      isDrawing: true,
      isDrawingShapeId: newPolygon.id,
    };
  }

  static addPoint(state, e, onPolygonComplete) {
    console.log('add point is called');
    // Number of pixels allowed to determine if the first point was clicked
    const clickDelta = 5;

    const shapesCopy = JSON.parse(JSON.stringify(state.shapes));
    const currentShapeIndex = shapesCopy.findIndex((shape) => shape.id === state.isDrawingShapeId);

    if (currentShapeIndex !== -1) {
      const currentShape = shapesCopy[currentShapeIndex];
      if (currentShape.points && Array.isArray(currentShape.points)) {
        const firstPoint = currentShape.points[0];

        console.log(clickDelta);
        // If click is close enough to the first point (within clickDelta pixels), close the polygon
        if (
          Math.abs(firstPoint.x - e.evt.layerX) <= clickDelta &&
          Math.abs(firstPoint.y - e.evt.layerY) <= clickDelta
        ) {
          onPolygonComplete(shapesCopy);
          return {
            isDrawingShapeId: undefined,
          };
        }

        currentShape.points.push({ x: e.evt.layerX, y: e.evt.layerY });
        shapesCopy[currentShapeIndex] = currentShape;

        return {
          shapes: shapesCopy,
        };
      }
    }
    return state;
  }

  static finalizeCreation(state, props) {
    console.log('polygon finalizeCreation');
    const { shapes } = state;
    const { onUpdateShapes } = props;
    const tempShapes = [...shapes];

    const polygonIndex = tempShapes.findIndex((shape) => shape.id === state.isDrawingShapeId);

    if (polygonIndex !== -1 && tempShapes[polygonIndex].points.length > 2) {
      const completedPolygon = tempShapes[polygonIndex];
      // Replace the temporary `newPolygon` ID with some unique ID
      completedPolygon.id = `polygon-${new Date().getTime()}`;
      onUpdateShapes(tempShapes);

      return {
        isDrawing: false,
        shapes: tempShapes,
        isDrawingShapeId: undefined,
      };
    }

    return state;
  }

  // No need to update anything on mouse move,
  // but it's here if you need to add any logic later.
  static handleMouseMove(state, e) {
    return state;
  }
}
