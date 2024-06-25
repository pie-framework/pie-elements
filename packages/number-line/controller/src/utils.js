import {
  number as mathjsNumber,
  fraction as mathjsFraction,
  ceil as mathjsCeil,
  floor as mathjsFloor
} from 'mathjs';
import { generateMajorValuesForMinor, generateMinorValues, getMinorLimits } from './tickUtils';

/*
 * This function is duplicated in configure/main.js
 * This function will update major value whenever minor value is changed or tick type is changed
 * @param graph object containing domain, ticks and width value
 * @return graph object with updated ticks values
 * */
const updateMajorValue = (graph) => {
  const { domain, ticks, width } = graph;
  const majorValues = generateMajorValuesForMinor(ticks.minor, domain, width);
  if (majorValues.decimal.indexOf(ticks.major) === -1) {
    let currIndex = 0;
    if (ticks.tickIntervalType === 'Integer') {
      currIndex = majorValues.decimal.length > 4 ? 4 : majorValues.decimal.length - 1;
    } else {
      currIndex = majorValues.decimal.length - 1;
    }
    ticks.major = majorValues.decimal[currIndex];
  }
  graph.fraction = ticks.tickIntervalType === 'Fraction' && ticks.major < 1;
  return { ...graph, ticks };
};

/*
 * This function is duplicated in configure/main.js
 * This function will reload ticks data whenever graph object is changed and also sets required tick object
 * for rendering Ticks Components.
 * @param graph object containing domain, ticks and width value
 * @return graph object with updated ticks values
 * */

export const reloadTicksData = (graph) => {
  const { domain, ticks = {}, width } = graph;
  //Set tick interval type if not present for legacy number line models depending upon minor value
  if (!ticks.tickIntervalType) {
    if (ticks.minor > 0.5) {
      ticks.tickIntervalType = 'Integer';
    } else {
      ticks.tickIntervalType = 'Decimal';
    }
  }
  // This section will calculate minor and major values array and assign respective value
  // to different tick types object
  const minorLimits = getMinorLimits(domain, width);
  if (minorLimits.min >= 1) {
    /*
     * In this scenario only integer tick will be enabled
     * */
    ticks.tickIntervalType = 'Integer';
    ticks.minor =
      ticks.minor < 1
        ? mathjsNumber(mathjsCeil(minorLimits.min))
        : ticks.minor >= mathjsNumber(mathjsCeil(minorLimits.min)) &&
          ticks.minor <= mathjsNumber(mathjsFloor(minorLimits.max))
        ? ticks.minor
        : mathjsNumber(mathjsCeil(minorLimits.min));
    ticks.integerTick = ticks.minor;
    const minorValues = { decimal: [], fraction: [] };
    ticks.fractionTick = '0';
    ticks.decimalTick = 0;
  } else if (minorLimits.min >= 0 && minorLimits.max < 1) {
    /*
     * In this scenario only decimal or fraction tick will be enabled
     * */
    if (ticks.tickIntervalType === 'Integer') {
      ticks.tickIntervalType = 'Fraction';
    }
    const minorValues = generateMinorValues(minorLimits);
    let minValue = mathjsNumber(mathjsFraction(minorValues.fraction[0]));
    let maxValue = mathjsNumber(mathjsFraction(minorValues.fraction[minorValues.fraction.length - 1]));
    if (ticks.minor < minValue || ticks.minor > maxValue) {
      switch (ticks.tickIntervalType) {
        case 'Fraction':
          ticks.minor = mathjsNumber(mathjsFraction(minorValues.fraction[minorValues.fraction.length - 1]));
          ticks.fractionTick = minorValues.fraction[minorValues.fraction.length - 1];
          ticks.decimalTick = minorValues.decimal[0];
          break;
        case 'Decimal':
        case 'Integer':
          ticks.minor = minorValues.decimal[minorValues.decimal.length - 1];
          ticks.decimalTick = minorValues.decimal[minorValues.decimal.length - 1];
          ticks.fractionTick = minorValues.fraction[0];
      }
    } else {
      switch (ticks.tickIntervalType) {
        case 'Fraction':
          let fraction = mathjsFraction(mathjsNumber(ticks.minor));
          ticks.fractionTick = fraction.n + '/' + fraction.d;
          ticks.decimalTick = ticks.decimalTick ? ticks.decimalTick : minorValues.decimal[0];
          break;
        case 'Decimal':
        case 'Integer':
          ticks.decimalTick = ticks.minor;
          ticks.fractionTick = ticks.fractionTick ? ticks.fractionTick : minorValues.fraction[0];
      }
    }
    ticks.integerTick = 1;
  } else if (minorLimits.min < 1 && minorLimits.max >= 1) {
    /*
     * In this scenario all integer, decimal or fraction tick will be enabled
     * */
    const minorValues = generateMinorValues(minorLimits);
    if (!(ticks.minor >= minorLimits.min && ticks.minor <= minorLimits.max)) {
      if (minorLimits.min > 0.5) {
        ticks.tickIntervalType = 'Integer';
      }
      switch (ticks.tickIntervalType) {
        case 'Integer':
          ticks.minor = mathjsNumber(mathjsCeil(minorLimits.min));
          ticks.integerTick = ticks.minor;
          ticks.decimalTick = minorLimits.min > 0.5 ? 0 : minorValues.decimal[0];
          ticks.fractionTick = minorLimits.min > 0.5 ? '0' : minorValues.fraction[0];
          break;
        case 'Decimal':
          ticks.minor = minorValues.decimal[0];
          ticks.integerTick = 1;
          ticks.decimalTick = ticks.minor;
          ticks.fractionTick = minorValues.fraction[0];
          break;
        case 'Fraction':
          ticks.minor = mathjsNumber(mathjsFraction(minorValues.fraction[0]));
          ticks.integerTick = 1;
          ticks.decimalTick = minorValues.decimal[0];
          ticks.fractionTick = minorValues.fraction[0];
      }
    } else {
      switch (ticks.tickIntervalType) {
        case 'Integer':
          ticks.integerTick = ticks.minor;
          ticks.decimalTick = minorLimits.min > 0.5 ? 0 : minorValues.decimal[0];
          ticks.fractionTick = minorLimits.min > 0.5 ? '0' : minorValues.fraction[0];
          break;
        case 'Decimal':
          ticks.integerTick = 1;
          ticks.decimalTick = ticks.minor;
          ticks.fractionTick = minorValues.fraction[0];
          break;
        case 'Fraction':
          ticks.integerTick = 1;
          ticks.decimalTick = minorValues.decimal[0];
          let fraction = mathjsFraction(mathjsNumber(ticks.minor));
          ticks.fractionTick = fraction.n + '/' + fraction.d;
      }
    }
  }
  return updateMajorValue({ ...graph, ticks });
};
