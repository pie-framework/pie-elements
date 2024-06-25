import {
    mod as mathjsMod,
    number as mathjsNumber,
    fraction as mathjsFraction,
    abs as mathjsAbs,
    smaller as mathjsSmaller,
    smallerEq as mathjsSmallerEq,
    multiply as mathjsMultiply,
    equal as mathjsEqual,
    divide as mathjsDivide,
    larger as mathjsLarger,
    largerEq as mathjsLargerEq,
    add as mathjsAdd,
    subtract as mathjsSubtract,
} from 'mathjs';
import uniqWith from 'lodash/uniqWith';
import isObject from 'lodash/isObject';
import isNumber from 'lodash/isNumber';

// All these functions are duplicated in  src/number-line/graph/tick-utils

/*This will store the possible decimal tick values*/
const decimalTickValues = [0.001, 0.01, 0.02, 0.04, 0.05, 0.1, 0.125, 0.2, 0.25, 0.5];

/*This will store the possible fraction tick values*/
const fractionTickValues = [
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
const labelMultiplier = {
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

const fractionRange = (start, end, interval) => {
    const m = mathjsMod(mathjsAbs(start), mathjsAbs(interval));
    if (!mathjsEqual(m, 0)) {
        throw new Error('start point must be divisible by interval');
    }

    if (mathjsEqual(start, end)) {
        return [];
    }

    const e = mathjsSubtract(end, mathjsMod(end, mathjsAbs(interval)));

    const direction = mathjsLarger(interval, 0) ? 'positive' : 'negative';

    if (direction === 'negative' && mathjsLargerEq(end, start)) {
        throw new Error('start must be > than end when doing a negative decrement');
    }
    if (direction === 'positive' && mathjsSmallerEq(end, start)) {
        throw new Error('start must be < end when doing increments');
    }
    const compareFn = direction === 'positive' ? mathjsSmallerEq : mathjsEqual(e, end) ? mathjsLargerEq : mathjsLarger;
    const out = [];

    let next = start;
    while (compareFn(next, e)) {
        out.push(next);
        next = mathjsAdd(next, interval);
    }
    return out;
};

const zbrErrorMessage = (start, end) =>
    `Can only do a positive or negative range, but got: start: ${start} and end:${end}`;

const zeroBasedRange = (start, end, interval) => {
    start = mathjsFraction(start);
    end = mathjsFraction(end);
    interval = mathjsFraction(interval);

    const length = mathjsAbs(mathjsSubtract(end, start));

    if (mathjsLarger(length, mathjsAbs(end))) {
        throw new Error(zbrErrorMessage(start, end));
    }
    const a = {
        start: mathjsAbs(start),
        end: mathjsAbs(end),
        interval: mathjsAbs(interval),
        multiplier: mathjsSmaller(interval, 0) ? -1 : 1,
    };

    const m = mathjsMod(a.start, a.interval);
    const s = mathjsLarger(m, 0) ? mathjsAdd(mathjsSubtract(a.start, m), a.interval) : a.start;

    const r = fractionRange(s, a.end, a.interval);
    const out = a.multiplier === -1 ? r.map((v) => mathjsMultiply(v, -1)) : r;

    if (mathjsSmaller(interval, 0)) {
        out.reverse();
    }
    return out;
};

const fmin = (a, b) => {
    a = mathjsFraction(a);
    b = mathjsFraction(b);
    return mathjsSmaller(a, b) ? a : b;
};

const fmax = (a, b) => {
    a = mathjsFraction(a);
    b = mathjsFraction(b);
    return mathjsLarger(a, b) ? a : b;
};
/**
 * the lodash range was causing too much variance in the rounding errors
 * such that it was hard to round the numbers.
 * This is a more simplistic version but makes rounding work.
 */
const simpleRange = (start, end, interval) => {
    start = mathjsFraction(start);
    end = mathjsFraction(end);
    interval = mathjsFraction(interval);

    const positiveRange = mathjsLarger(end, 0) ? zeroBasedRange(fmax(0, start), end, interval) : [];

    const negativeRange = mathjsSmaller(start, 0) ? zeroBasedRange(fmin(0, end), start, mathjsMultiply(interval, -1)) : [];
    let together = negativeRange.concat(positiveRange);

    const out = uniqWith(together, mathjsEqual);
    return out;
};

const closeTo = (a, b, precision) => {
    precision = precision || 2;
    const expectedDiff = Math.pow(10, -precision) / 2;
    const receivedDiff = Math.abs(a - b);
    return receivedDiff < expectedDiff;
};

const limit = (v, min, max) => {
    if (mathjsSmaller(fraction(v), fraction(min))) {
        return min;
    }

    if (mathjsLarger(fraction(v), fraction(max))) {
        return max;
    }

    return v;
};

const isMultiple = (multiple, src) => {
    const mod = mathjsMod(multiple, src);
    return mathjsEqual(mod, 0);
};

/**
 * Accepts a fraction object {n,d,s} or number.
 * @param {*} v
 * @return mathjs.fraction
 */
const fraction = (v) => {
    if (isObject(v)) {
        return mathjsFraction(v.n * v.s, v.d);
    } else if (isNumber(v)) {
        return mathjsFraction(v);
    }
};

const normalizeTicks = (domain, width, ticks, opts) => {
    const useLimit = opts ? opts.limit !== false : true;
    const minorLimits = getMinorLimits(domain, width);

    const minor = useLimit ? limit(fraction(ticks.minor), minorLimits.min, minorLimits.max) : fraction(ticks.minor);
    const major = useLimit ? limit(fraction(ticks.major), minor, mathjsMultiply(minor, 20)) : fraction(ticks.major);

    const isMajorMultiple = isMultiple(major, minor);

    if (!isMajorMultiple) {
        const multiplier = mathjsDivide(major, minor);
        const multiplyBy = multiplier <= 2 ? 2 : Math.round(multiplier);

        // major must be a multiple of minor
        return {minor, major: mathjsMultiply(minor, multiplyBy)};
    }

    return {major, minor};
};

/**
 * Build ticks as an array of mathjs Fractions
 */
const buildTickDataAsFractions = (domain, width, ticks, opts) => {
    ticks = normalizeTicks(domain, width, ticks, opts);
    const rng = simpleRange(domain.min, domain.max, ticks.minor);

    const o = rng
        .filter((x) => mathjsSmallerEq(x, mathjsFraction(domain.max)))
        .map((x) => {
            let type = 'minor';
            const modulo = mathjsMod(x, ticks.major);

            if (closeTo(mathjsNumber(modulo), 0)) {
                type = 'major';
            }

            return {x, type};
        });

    return o;
};

const buildTickData = (domain, width, ticks, opts) => {
    const result = buildTickDataAsFractions(domain, width, ticks, opts);

    const out = result.map((o) => (opts.fraction ? o : {...o, x: mathjsNumber(o.x) || 0}));

    return out;
};

/*
 * Function to get tick interval limits based on min, max and width entered by the user.
 * @param domain object containing max and min value.
 * @param width number represents width of number line.
 * */
export const getMinorLimits = (domain, width) => {
    const end = domain.max - domain.min;
    const min = mathjsNumber(mathjsMultiply(10, mathjsDivide(mathjsFraction(end), width)));
    const max = mathjsNumber(mathjsMultiply(20, min));
    return {
        min: min,
        max: max,
    };
};

/*
 * This function will generate label interval values for provided tick interval value.
 * @param minor number representing tick interval value.
 * @param domain object containing min and max values.
 * @param width number representing width of number line.
 * @return out object containing three arrays 1. fraction values, 2. decimal values,
 * */
export const generateMajorValuesForMinor = (minor, domain, width) => {
    let out = {decimal: [], fraction: []};
    let fraction = mathjsFraction(mathjsNumber(mathjsNumber(minor)));
    let n = fraction.n;
    let d = fraction.d;
    if (n >= 1 && d === 1) {
        for (let i = 1; i <= 10; i++) {
            let num = mathjsNumber(mathjsMultiply(n, i));
            //Here we check if this major value can plot at least 2 points on number line.
            let ticksData = {minor: minor, major: num};
            let output = buildTickData(domain, width, ticksData, {fraction: undefined});
            if (output.filter((x) => x.type === 'major').length > 1) {
                out.fraction.push(num.toString());
                out.decimal.push(num);
            }
        }
    } else {
        for (const multiplierKey in labelMultiplier[d]) {
            let num = mathjsMultiply(mathjsFraction(n, d), labelMultiplier[d][multiplierKey]);
            //Here we check if this major value can plot at least 2 points on number line.
            let ticksData = {minor: minor, major: mathjsNumber(num)};
            let output = buildTickData(domain, width, ticksData, {fraction: undefined});
            if (output.filter((x) => x.type === 'major').length > 1) {
                if (num.d !== 1) {
                    out.fraction.push(num.n + '/' + num.d);
                } else {
                    out.fraction.push(num.n.toString());
                }
                out.decimal.push(mathjsNumber(num));
            }
        }
    }
    return out;
};

/*
 * This function will generate tick interval values based on min and max limits of ticks.
 * @param minorLimits object containing min and max values
 * @return out object containing three arrays 1. fraction values, 2. decimal values,
 * */
export const generateMinorValues = (minorLimits) => {
    let out = {fraction: [], decimal: []};
    decimalTickValues.forEach((value) => {
        if (value >= minorLimits.min && value <= minorLimits.max) {
            out.decimal.push(value);
        }
    });
    fractionTickValues.forEach((value) => {
        let decimalValue = mathjsNumber(mathjsFraction(value));
        if (decimalValue >= minorLimits.min && decimalValue <= minorLimits.max) {
            out.fraction.push(value);
        }
    });
    return out;
};
