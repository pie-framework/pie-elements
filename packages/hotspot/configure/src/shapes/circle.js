export default class CircleShape {
  static create(shapes, e) {
    const newShapes = [...shapes];
    const highestId = Math.max(...newShapes.map((shape) => parseInt(shape.id)), 0);
    const newCircle = {
      id: `${highestId + 1}`,
      radius: 0,
      x: e.evt.layerX,
      y: e.evt.layerY,
      group: 'circles',
      index: newShapes.length,
    };

    newShapes.push(newCircle);

    return {
      newShapes,
      isDrawing: true,
      isDrawingShapeId: newCircle.id,
    };
  }

  static finalizeCreation(state, props) {
    const currentShapeIndex = state.shapes.findIndex((shape) => shape.id === state.isDrawingShapeId);

    if (currentShapeIndex !== -1) {
      const currentShape = state.shapes[currentShapeIndex];
      const updatedShapes = [...props.shapes];

      // Check if the shape is a valid circle (has more than 0 radius) before finalizing
      if (currentShape.radius > 0) {
        updatedShapes.push(currentShape);

        return {
          isDrawing: false,
          stateShapes: false,
          isDrawingShapeId: undefined,
          shapes: updatedShapes,
        };
      }
    }

    // Return current state if not drawing a circle
    return state;
  }

  static handleMouseMove(state, e) {
    const { isDrawing, isDrawingShapeId, shapes } = state;

    if (isDrawing) {
      const tempShapes = [...shapes];
      const resizingShapeIndex = tempShapes.findIndex((shape) => shape.id === isDrawingShapeId);

      if (resizingShapeIndex !== -1) {
        const resizingShape = tempShapes[resizingShapeIndex];

        // Diagrammatically in a 2D plane, the radius of a circle would be the distance from the center to the edge
        // Therefore you can use the formula of euclidian distance sqrt((x2 - x1)² + (y2 - y1)²)
        resizingShape.radius = Math.sqrt(
          Math.pow(e.evt.layerX - resizingShape.x, 2) + Math.pow(e.evt.layerY - resizingShape.y, 2),
        );

        return {
          shapes: tempShapes,
        };
      }
    }

    return state;
  }
}
