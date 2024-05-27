import * as math from 'mathjs';
import uniqWith from 'lodash/uniqWith';
import isObject from 'lodash/isObject';
import isNumber from 'lodash/isNumber';
import { tickUtils } from '../../index';

/*This will store the possible decimal tick values*/
export const decimalTickValues = [0.001, 0.01, 0.02, 0.04, 0.05, 0.1, 0.125, 0.2, 0.25, 0.5];

/*This will store the possible fraction tick values*/
export const fractionTickValues = [
  '1/1000',
  '1/100',
  '1/64',
  '1/50',
  '1/32',
  '1/25',
  '1/20',
  '1/16',
  '1/15',
  '1/12',
  '1/10',
  '1/9',
  '1/8',
  '1/7',
  '1/6',
  '1/5',
  '1/4',
  '1/3',
  '1/2',
];

/*This const will store possible multiplier for label interval that needs to be multiplied
with tick interval with denominator represented with object key.*/
export const labelMultiplier = {
  1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  2: [1, 2, 4, 6, 8, 10],
  3: [1, 3, 6, 9],
  4: [1, 2, 4, 8],
  5: [1, 5, 10],
  6: [1, 2, 3, 6],
  7: [1, 7],
  8: [1, 2, 4, 8],
  9: [1, 3, 9],
  10: [1, 2, 5, 10],
  12: [1, 2, 3, 4, 6],
  15: [1, 3, 5],
  16: [1, 2, 4, 8],
  20: [1, 2, 4, 5, 10],
  25: [1, 5],
  32: [1, 2, 4, 8],
  50: [1, 2, 5, 10],
  64: [1, 2, 4, 8],
  100: [1, 2, 4, 5, 10],
  1000: [1, 2, 4, 5, 8, 10],
};

export const fractionSnapTo = (min, max, interval, value) => {
  value = fmax(fmin(value, max), min);
  const mod = value.mod(interval);
  let v;

  const half = interval.div(2);
  if (math.largerEq(math.abs(mod), half)) {
    const d = interval.sub(math.abs(mod));
    const fn = math.largerEq(value, 0) ? 'add' : 'sub';
    v = value[fn](d);
  } else {
    const fn2 = math.largerEq(value, 0) ? 'sub' : 'add';
    v = value[fn2](math.abs(mod));
  }
  return v;
};

export const snapTo = (min, max, interval, value) => {
  const out = fractionSnapTo(math.fraction(min), math.fraction(max), math.fraction(interval), math.fraction(value));
  return math.number(out);
};

export const fractionRange = (start, end, interval) => {
  const m = math.mod(math.abs(start), math.abs(interval));
  if (!math.equal(m, 0)) {
    throw new Error('start point must be divisible by interval');
  }

  if (math.equal(start, end)) {
    return [];
  }

  const e = math.subtract(end, math.mod(end, math.abs(interval)));

  const direction = math.larger(interval, 0) ? 'positive' : 'negative';

  if (direction === 'negative' && math.largerEq(end, start)) {
    throw new Error('start must be > than end when doing a negative decrement');
  }
  if (direction === 'positive' && math.smallerEq(end, start)) {
    throw new Error('start must be < end when doing increments');
  }
  const compareFn = direction === 'positive' ? math.smallerEq : math.equal(e, end) ? math.largerEq : math.larger;
  const out = [];

  let next = start;
  while (compareFn(next, e)) {
    out.push(next);
    next = math.add(next, interval);
  }
  return out;
};

export const zbrErrorMessage = (start, end) =>
  `Can only do a positive or negative range, but got: start: ${start} and end:${end}`;

export const zeroBasedRange = (start, end, interval) => {
  start = math.fraction(start);
  end = math.fraction(end);
  interval = math.fraction(interval);

  const length = math.abs(math.subtract(end, start));

  if (math.larger(length, math.abs(end))) {
    throw new Error(zbrErrorMessage(start, end));
  }
  const a = {
    start: math.abs(start),
    end: math.abs(end),
    interval: math.abs(interval),
    multiplier: math.smaller(interval, 0) ? -1 : 1,
  };

  const m = math.mod(a.start, a.interval);
  const s = math.larger(m, 0) ? math.add(math.subtract(a.start, m), a.interval) : a.start;

  const r = fractionRange(s, a.end, a.interval);
  const out = a.multiplier === -1 ? r.map((v) => math.multiply(v, -1)) : r;

  if (math.smaller(interval, 0)) {
    out.reverse();
  }
  return out;
};

const fmin = (a, b) => {
  a = math.fraction(a);
  b = math.fraction(b);
  return math.smaller(a, b) ? a : b;
};

const fmax = (a, b) => {
  a = math.fraction(a);
  b = math.fraction(b);
  return math.larger(a, b) ? a : b;
};
/**
 * the lodash range was causing too much variance in the rounding errors
 * such that it was hard to round the numbers.
 * This is a more simplistic version but makes rounding work.
 */
export const simpleRange = (start, end, interval) => {
  start = math.fraction(start);
  end = math.fraction(end);
  interval = math.fraction(interval);

  const positiveRange = math.larger(end, 0) ? zeroBasedRange(fmax(0, start), end, interval) : [];

  const negativeRange = math.smaller(start, 0) ? zeroBasedRange(fmin(0, end), start, math.multiply(interval, -1)) : [];
  let together = negativeRange.concat(positiveRange);

  const out = uniqWith(together, math.equal);
  return out;
};

export const closeTo = (a, b, precision) => {
  precision = precision || 2;
  const expectedDiff = Math.pow(10, -precision) / 2;
  const receivedDiff = Math.abs(a - b);
  return receivedDiff < expectedDiff;
};

const limit = (v, min, max) => {
  if (math.smaller(fraction(v), fraction(min))) {
    return min;
  }

  if (math.larger(fraction(v), fraction(max))) {
    return max;
  }

  return v;
};

/*
 * Function to get tick interval limits based on min, max and width entered by the user.
 * @param domain object containing max and min value.
 * @param width number represents width of number line.
 * */
export const getMinorLimits = (domain, width) => {
  const end = domain.max - domain.min;
  const min = math.number(math.multiply(10, math.divide(math.fraction(end), width)));
  const max = math.number(math.multiply(20, min));
  return {
    min: min,
    max: max,
  };
};

export const isMultiple = (multiple, src) => {
  const mod = math.mod(multiple, src);
  return math.equal(mod, 0);
};

/**
 * Accepts a fraction object {n,d,s} or number.
 * @param {*} v
 * @return mathjs.fraction
 */
export const fraction = (v) => {
  if (isObject(v)) {
    return math.fraction(v.n * v.s, v.d);
  } else if (isNumber(v)) {
    return math.fraction(v);
  }
};

export const normalizeTicks = (domain, width, ticks, opts) => {
  const useLimit = opts ? opts.limit !== false : true;
  const minorLimits = getMinorLimits(domain, width);

  const minor = useLimit ? limit(fraction(ticks.minor), minorLimits.min, minorLimits.max) : fraction(ticks.minor);
  const major = useLimit ? limit(fraction(ticks.major), minor, math.multiply(minor, 20)) : fraction(ticks.major);

  const isMajorMultiple = isMultiple(major, minor);

  if (!isMajorMultiple) {
    const multiplier = math.divide(major, minor);
    const multiplyBy = multiplier <= 2 ? 2 : Math.round(multiplier);

    // major must be a multiple of minor
    return { minor, major: math.multiply(minor, multiplyBy) };
  }

  return { major, minor };
};

/**
 * Build ticks as an array of mathjs Fractions
 */
export const buildTickDataAsFractions = (domain, width, ticks, opts) => {
  ticks = normalizeTicks(domain, width, ticks, opts);
  const rng = simpleRange(domain.min, domain.max, ticks.minor);

  const o = rng
    .filter((x) => math.smallerEq(x, math.fraction(domain.max)))
    .map((x) => {
      let type = 'minor';
      const modulo = math.mod(x, ticks.major);

      if (closeTo(math.number(modulo), 0)) {
        type = 'major';
      }

      return { x, type };
    });

  return o;
};

/*
 * This function will generate tick interval values based on min and max limits of ticks.
 * @param minorLimits object containing min and max values
 * @return out object containing three arrays 1. fraction values, 2. decimal values,
 * */
export const generateMinorValues = (minorLimits) => {
  let out = { fraction: [], decimal: [] };
  decimalTickValues.forEach((value) => {
    if (value >= minorLimits.min && value <= minorLimits.max) {
      out.decimal.push(value);
    }
  });
  fractionTickValues.forEach((value) => {
    let decimalValue = math.number(math.fraction(value));
    if (decimalValue >= minorLimits.min && decimalValue <= minorLimits.max) {
      out.fraction.push(value);
    }
  });
  return out;
};

/*
 * This function will generate label interval values for provided tick interval value.
 * @param minor number representing tick interval value.
 * @param domain object containing min and max values.
 * @param width number representing width of number line.
 * @return out object containing three arrays 1. fraction values, 2. decimal values,
 * */
export const generateMajorValuesForMinor = (minor, domain, width) => {
  let out = { decimal: [], fraction: [] };
  let fraction = math.fraction(math.number(math.number(minor)));
  let n = fraction.n;
  let d = fraction.d;
  if (n >= 1 && d === 1) {
    for (let i = 1; i <= 10; i++) {
      let num = math.number(math.multiply(n, i));
      //Here we check if this major value can plot at least 2 points on number line.
      let ticksData = { minor: minor, major: num };
      let output = tickUtils.buildTickData(domain, width, ticksData, { fraction: undefined });
      if (output.filter((x) => x.type === 'major').length > 1) {
        out.fraction.push(num.toString());
        out.decimal.push(num);
      }
    }
  } else {
    for (const multiplierKey in labelMultiplier[d]) {
      let num = math.multiply(math.fraction(n, d), labelMultiplier[d][multiplierKey]);
      //Here we check if this major value can plot at least 2 points on number line.
      let ticksData = { minor: minor, major: math.number(num) };
      let output = tickUtils.buildTickData(domain, width, ticksData, { fraction: undefined });
      if (output.filter((x) => x.type === 'major').length > 1) {
        if (num.d !== 1) {
          out.fraction.push(num.n + '/' + num.d);
        } else {
          out.fraction.push(num.n.toString());
        }
        out.decimal.push(math.number(num));
      }
    }
  }
  return out;
};

export const buildTickData = (domain, width, ticks, opts) => {
  const result = buildTickDataAsFractions(domain, width, ticks, opts);

  const out = result.map((o) => (opts.fraction ? o : { ...o, x: math.number(o.x) || 0 }));

  return out;
};

export const snapElements = (domain, ticks, elements) => {
  return elements.map((e) => {
    const size = Number.isFinite(e.size) ? snapTo(0, e.size, ticks.minor, e.size) : undefined;
    const domainPosition = snapTo(domain.min, domain.max, ticks.minor, e.domainPosition);
    const out = { ...e, domainPosition };

    if (Number.isFinite(size)) {
      out.size = size;
    }

    return out;
  });
};

export const testSharedFunction = (param) =>{
  return 'test' + param;
};
