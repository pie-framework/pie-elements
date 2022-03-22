import * as math from 'mathjs';
import uniqWith from 'lodash/uniqWith';
import isObject from 'lodash/isObject';
import isNumber from 'lodash/isNumber';

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
  const out = fractionSnapTo(
    math.fraction(min),
    math.fraction(max),
    math.fraction(interval),
    math.fraction(value)
  );
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
  const compareFn =
    direction === 'positive'
      ? math.smallerEq
      : math.equal(e, end)
      ? math.largerEq
      : math.larger;
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
  const s = math.larger(m, 0)
    ? math.add(math.subtract(a.start, m), a.interval)
    : a.start;

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

  const positiveRange = math.larger(end, 0)
    ? zeroBasedRange(fmax(0, start), end, interval)
    : [];

  const negativeRange = math.smaller(start, 0)
    ? zeroBasedRange(fmin(0, end), start, math.multiply(interval, -1))
    : [];
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
  if (math.smaller(v, min)) {
    return min;
  }

  if (math.larger(v, max)) {
    return max;
  }

  return v;
};

export const minorLimits = (domain) => {
  const end = domain.max - domain.min;
  return {
    min: math.divide(math.fraction(end), 100),
    max: math.divide(math.fraction(end), 3),
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

export const normalizeTicks = (domain, ticks, opts) => {
  const l = opts ? opts.limit !== false : true;
  const end = fraction(domain.max - domain.min);
  const minor = l
    ? limit(fraction(ticks.minor), math.divide(end, 100), math.divide(end, 3))
    : math.fraction(ticks.minor);
  const major = l
    ? limit(fraction(ticks.major), minor, math.multiply(minor, 10))
    : math.fraction(ticks.major);

  const m = isMultiple(major, minor);

  if (!m) {
    return { minor, major: math.multiply(minor, 2) };
  }

  return { major, minor };
};

/**
 * Build ticks as an array of mathjs Fractions
 */
export const buildTickDataAsFractions = (domain, ticks, opts) => {
  ticks = normalizeTicks(domain, ticks, opts);
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

export const buildTickData = (domain, ticks, opts) => {
  const result = buildTickDataAsFractions(domain, ticks, opts);

  const out = result.map((o) => (opts.fraction ? o : { ...o, x: math.number(o.x) || 0 }));

  return out;
};

export const snapElements = (domain, ticks, elements) => {
  return elements.map((e) => {
    const size = Number.isFinite(e.size)
      ? snapTo(0, e.size, ticks.minor, e.size)
      : undefined;
    const domainPosition = snapTo(
      domain.min,
      domain.max,
      ticks.minor,
      e.domainPosition
    );
    const out = { ...e, domainPosition };

    if (Number.isFinite(size)) {
      out.size = size;
    }

    return out;
  });
};
