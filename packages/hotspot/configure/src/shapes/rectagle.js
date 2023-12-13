export default class RectangleShape {
  static create(shapes, e) {
    const newShapes = [...shapes];
    const highestId = Math.max(...newShapes.map((shape) => parseInt(shape.id)), 0) || 0;

    const newRectangle = {
      id: `newRectangle-${highestId + 1}`,
      height: 0,
      width: 0,
      x: e.evt.layerX,
      y: e.evt.layerY,
      group: 'rectangles',
      index: newShapes.length,
    };

    console.log({ newRectangle });

    newShapes.push(newRectangle);

    return {
      shapes: newShapes,
      isDrawing: true,
      isDrawingShapeId: newRectangle.id,
    };
  }

  static finalizeCreation(state, props) {
    const currentShapeIndex = state.shapes.findIndex((shape) => shape.id === state.isDrawingShapeId);
    const highestId = Math.max(...state.shapes.map((shape) => parseInt(shape.id) || 0), 0);
    console.log(state.shapes);
    console.log(highestId);

    if (currentShapeIndex !== -1) {
      const currentShape = state.shapes[currentShapeIndex];
      const updatedShapes = [...state.shapes].filter(
        (shape) => !shape.id || (shape.id && !`${shape.id}`.includes('newRectangle-')),
      );

      // Check if the shape is a valid rectangle (has more than 0 width and height) before finalizing
      if (currentShape.width > 0 && currentShape.height > 0) {
        updatedShapes.push({ ...currentShape, id: `${highestId + 1}` });

        console.log({ ...currentShape, id: `${highestId + 1}` });
        return {
          isDrawing: false,
          stateShapes: false,
          isDrawingShapeId: undefined,
          shapes: updatedShapes,
        };
      }
    }

    // Return current state if not drawing a rectangle
    return state;
  }

  static handleMouseMove(state, e) {
    const { isDrawing, isDrawingShapeId, shapes } = state;
    console.log({ isDrawing, isDrawingShapeId, shapes });

    if (isDrawing) {
      const tempShapes = [...shapes];
      const resizingShapeIndex = tempShapes.findIndex((shape) => shape.id === isDrawingShapeId);

      if (resizingShapeIndex !== -1) {
        const resizingShape = tempShapes[resizingShapeIndex];

        console.log('e:', e.evt.layerX, e.evt.layerY);
        console.log('resizingShape:', resizingShape.x, resizingShape.y);

        resizingShape.width = e.evt.layerX - resizingShape.x;
        resizingShape.height = e.evt.layerY - resizingShape.y;

        return {
          shapes: tempShapes,
        };
      }
    }

    return state;
  }
}
