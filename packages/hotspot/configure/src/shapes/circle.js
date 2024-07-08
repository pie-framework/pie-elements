export class CircleShape {
  static name = 'circle'

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
      shapes: newShapes,
      isDrawing: true,
      isDrawingShapeId: newCircle.id,
    };
  }

  static finalizeCreation(state, props) {
    const currentShapeIndex = state.shapes.findIndex((shape) => shape.id === state.isDrawingShapeId);

    if (currentShapeIndex !== -1) {
      const currentShape = state.shapes[currentShapeIndex];

      // Check if the shape is a valid circle (has more than 0 radius) before finalizing
      if (currentShape.radius > 0) {
        return {
          ...state,
          isDrawing: false,
          stateShapes: false,
          isDrawingShapeId: undefined,
        };
      } else {
        return {
          ...state,
          isDrawing: false,
          stateShapes: false,
          isDrawingShapeId: undefined,
          shapes: state.shapes.filter((shape) => shape.id !== state.isDrawingShapeId),
        };
      }
    }

    return {
      ...state,
      isDrawing: false,
      stateShapes: false,
      isDrawingShapeId: undefined,
    };
  }

  static handleMouseMove(state, e) {
    const { isDrawing, isDrawingShapeId, shapes } = state;

    if (isDrawing) {
      const tempShapes = [...shapes];
      const resizingShapeIndex = tempShapes.findIndex((shape) => shape.id === isDrawingShapeId);

      if (resizingShapeIndex !== -1) {
        const resizingShape = tempShapes[resizingShapeIndex];

        // Calculate radius based on mouse position
        const dx = e.evt.layerX - resizingShape.x;
        const dy = e.evt.layerY - resizingShape.y;
        resizingShape.radius = Math.sqrt(dx * dx + dy * dy);

        return {
          shapes: tempShapes,
        };
      }
    }

    return state;
  }
}
