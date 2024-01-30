import isEqual from 'lodash/isEqual';

const VALID_GRID_VALUES = [
  0.01, 0.02, 0.04, 0.05, 0.0625, 0.1, 0.125, 0.2, 0.25, 0.5, 1, 2, 3, 4, 5, 8, 10, 12, 15, 20, 40, 50, 64, 100, 500,
  1000,
];

// same as VALID_GRID_VALUES but next values are excluded: 0.04, 0.0625, 0.125, 3, 4, 8, 12, 15, 40, 64
const PREFERRED_VALID_GRID_VALUES = [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100, 500, 1000];

export const VALID_LABEL_VALUES = {
  0.01: [0, 0.01, 0.02, 0.04, 0.05, 0.1],
  0.02: [0, 0.02, 0.04, 0.1],
  0.04: [0, 0.04, 0.08, 0.16, 0.2],
  0.05: [0, 0.05, 0.1, 0.2, 0.25],
  0.0625: [0, 0.0625, 0.125, 0.25, 0.5],
  0.1: [0, 0.1, 0.2, 0.4, 0.5, 1],
  0.125: [0, 0.125, 0.25, 0.5, 1],
  0.2: [0, 0.2, 0.5, 0.1],
  0.25: [0, 0.25, 0.5, 1, 2],
  0.5: [0, 0.5, 1, 2],
  1: [0, 1, 2, 4, 5, 10],
  2: [0, 2, 4, 8, 10],
  3: [0, 3, 6, 12, 15],
  4: [0, 4, 8, 16, 20],
  5: [0, 5, 10, 20, 25],
  8: [0, 8, 16, 32, 40, 64],
  10: [0, 10, 20, 40, 50, 100],
  12: [0, 12, 24],
  15: [0, 15, 30, 60],
  20: [0, 20, 40, 80, 100],
  40: [0, 40, 80, 160, 200],
  50: [0, 50, 100, 200, 250],
  64: [0, 64, 128],
  100: [0, 100, 200, 400, 500],
  500: [0, 500, 1000, 2500],
  1000: [0, 1000, 2000, 4000, 5000],
};

export const getGridValues = (axis, size, prefferedValues = false) => {
  const minValue = (10 * (axis.max - axis.min)) / size;
  const maxValue = minValue * 10;

  // if preferred values should be used enforce all values to be used if the axis step
  // is included in all supported values and not included in preferred values
  const useAllValues =
    prefferedValues && !PREFERRED_VALID_GRID_VALUES.includes(axis.step) && VALID_GRID_VALUES.includes(axis.step);
  const values = !prefferedValues || useAllValues ? VALID_GRID_VALUES : PREFERRED_VALID_GRID_VALUES;

  return values.filter((value) => value >= minValue && value <= maxValue);
};

export const getLabelValues = (value) => VALID_LABEL_VALUES[value] || [];

export const applyConstraints = (axis, size, oldGridValues, oldLabelValues) => {
  const gridValues = getGridValues(axis, size);
  let labelValues = getLabelValues(axis.step);

  if (!isEqual(oldGridValues, gridValues) && !gridValues.includes(axis.step)) {
    const preferredValues = getGridValues(axis, size, true);
    const lowestValue = preferredValues[0] || 1;

    axis.step = lowestValue;
    labelValues = getLabelValues(lowestValue);

    if (!labelValues.includes(axis.labelStep)) {
      axis.labelStep = lowestValue;
    }

    return { gridValues, labelValues };
  }

  if (!isEqual(oldLabelValues, labelValues) && !labelValues.includes(axis.labelStep)) {
    axis.labelStep = axis.step;
  }

  return { gridValues, labelValues };
};

// also used in pie-lib/graphing/utils as 'getTickValues'
const getPlotablePoints = (prop) => {
  const tickValues = [];
  let tickVal = 0;

  while (tickVal >= prop.min && tickValues.indexOf(tickVal) < 0) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal - prop.step) * 10000) / 10000;
  }

  tickVal = Math.round(prop.step * 10000) / 10000;

  while (tickVal <= prop.max && tickValues.indexOf(tickVal) < 0) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal + prop.step) * 10000) / 10000;
  }

  // return only ticks that are inside the min-max interval
  if (tickValues) {
    return tickValues.filter((tV) => tV >= prop.min && tV <= prop.max);
  }

  return [];
};

export const filterPlotableMarks = (domain, range, answers) => {
  const domainValues = getPlotablePoints(domain);
  const rangeValues = getPlotablePoints(range);

  const isPointPlotable = (x, y) => domainValues.includes(x) && rangeValues.includes(y);

  return Object.entries(answers || {}).reduce((newAnswers, [key, answer]) => {
    newAnswers[key] = {
      ...answer,
      marks: (answer.marks || []).filter((mark) => {
        if (mark.type === 'point') {
          return isPointPlotable(mark.x, mark.y);
        }

        if (mark.type === 'polygon') {
          return !mark.points.find((point) => !isPointPlotable(point.x, point.y));
        }

        const from = mark.from || mark.root;
        const to = mark.to || mark.edge;

        return mark.building
          ? isPointPlotable(from.x, from.y)
          : isPointPlotable(from.x, from.y) && isPointPlotable(to.x, to.y);
      }),
    };

    return newAnswers;
  }, {});
};
