import cloneDeep from 'lodash/cloneDeep';

const updateImageDimensions = (initialDim, nextDim, keepAspectRatio, resizeType) => {
  // if we want to keep image aspect ratio
  if (keepAspectRatio) {
    const imageAspectRatio = initialDim.width / initialDim.height;

    if (resizeType === 'height') {
      // if we want to change image height => we update the width accordingly
      return {
        width: nextDim.height * imageAspectRatio,
        height: nextDim.height
      }
    }

    // if we want to change image width => we update the height accordingly
    return {
      width: nextDim.width,
      height: nextDim.width / imageAspectRatio
    }
  }

  // if we don't want to keep aspect ratio, we just update both values
  return {
    width: nextDim.width,
    height: nextDim.height
  }
};

// referenceInitialValue = the initial value of the Stage
// referenceNextValue = the next value of the Stage
// currentValue = the value that has to be re-sized influenced by the changes that were made on the Stage
const getDelta = (referenceInitialValue, referenceNextValue, currentValue) => (referenceNextValue / referenceInitialValue) * currentValue;

const getUpdatedRectangle = (initialDim, nextDim, shape) => ({
  ...shape,
  width: getDelta(initialDim.width, nextDim.width, shape.width),
  height: getDelta(initialDim.height, nextDim.height, shape.height),
  x: getDelta(initialDim.width, nextDim.width, shape.x),
  y: getDelta(initialDim.height, nextDim.height, shape.y),
});

const getUpdatedCircle = (initialDim, nextDim, shape) => ({
  ...shape,
  width: getDelta(initialDim.width, nextDim.width, shape.width),
  height: getDelta(initialDim.height, nextDim.height, shape.height),
  x: getDelta(initialDim.width, nextDim.width, shape.x),
  y: getDelta(initialDim.height, nextDim.height, shape.y),
});

const getUpdatedPlygon = (initialDim, nextDim, shape) => ({
  ...shape,
  points: shape.points.map(point => ({
    x: getDelta(initialDim.width, nextDim.width, point.x),
    y: getDelta(initialDim.height, nextDim.height, point.y),
  }))
});

// initialDim = the initial dimensions: { width, height } of the Stage
// nextDim = the next dimensions: { width, height } of the Stage
// shapes = array of shapes that have to be re-sized and re-positioned
const getUpdatedShapes = (initialDim, nextDim, shapes) => {
  return shapes.map(shape => {
    if (shape.group === 'rectangles') {
      return getUpdatedRectangle(initialDim, nextDim, shape);
    }

    if (shape.group === 'polygons') {
      return getUpdatedPlygon(initialDim, nextDim, shape);
    }

    if (shape.group === 'circles') {
      return getUpdatedCircle(initialDim, nextDim, shape);
    }
  });
};

// converts shapes map to shapes array
// example:
// from: { rectangles: [r1], polygons: [p1, p2]}
// to: [{ ...r1, group: 'rectangles' }, { ...p1, group: 'polygons' }, { ...p2, group: 'polygons' }]
// if a shape has index defined, keep it, otherwise initialize it
// index is used for the UNDO function
const getAllShapes = (shapesMap) => {
  shapesMap = shapesMap || {};
  const shapesArray = [];
  const shapesKeys = Object.keys(shapesMap);

  return shapesKeys.length
    ? shapesKeys.reduce((acc, currentShapeKey) =>
        acc.concat(
          shapesMap[currentShapeKey]
            ? shapesMap[currentShapeKey].map((shape, index) => ({
              ...shape,
              group: currentShapeKey,
              index: shape.index || acc.length + index
            }))
            : []),
      shapesArray)
    : shapesArray;
};

// converts shapes array to shapes map
// is the reverse of getAllShapes function
// example:
// from: [{ ...r1, group: 'rectangles' }, { ...p1, group: 'polygons' }, { ...p2, group: 'polygons' }]
// to: { rectangles: [r1], polygons: [p1, p2]}
const groupShapes = (shapesArray) => {
  shapesArray = shapesArray || [];
  const shapesMap = {
    rectangles: [],
    polygons: [],
    circles: []
  };

  if (shapesArray.length) {
    return shapesArray.reduce((acc, { group, ...shapeProps }) => {
      acc[group] = [...(acc[group] || []), shapeProps];
      return acc;
    }, shapesMap);
  }

  return cloneDeep(shapesMap);
};


export { updateImageDimensions, getUpdatedShapes, getAllShapes, groupShapes, getUpdatedRectangle, getUpdatedPlygon };
