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

    return state;
  }

  static handleMouseMove(state, e) {
    const { isDrawing, isDrawingShapeId, shapes } = state;

    if (isDrawing) {
      const tempShapes = [...shapes];
      const resizingShapeIndex = tempShapes.findIndex((shape) => shape.id === isDrawingShapeId);

      if (resizingShapeIndex !== -1) {
        const resizingShape = tempShapes[resizingShapeIndex];

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
