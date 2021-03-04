import * as mod from '../tick-utils';
import * as math from 'mathjs';
import { AssertionError } from 'assert';
import isObject from 'lodash/isObject';

const domain = (min, max) => ({ min, max });
const ticks = (minor, major) => ({ minor, major });
const fs = f => (isObject(f) ? `${f.n * f.s}/${f.d}` : fs(math.fraction(f)));
const tickString = ticks =>
  `minor:${fs(ticks.minor)}, major: ${fs(ticks.major)}`;
const pf = f => `${f.n * f.s}/${f.d}`;
const f = (n, d) =>
  math.fraction.apply(math, [n, d].filter(v => v !== undefined));

describe('ticks', () => {
  describe('normalizeTicks', () => {
    const assertNormalize = (domain, ticks, expected) => {
      it(`${domain.min}<->${domain.max}, ${tickString(ticks)} => ${tickString(
        expected
      )}`, () => {
        const result = mod.normalizeTicks(domain, ticks);
        expect(result).toMatchObject(expected);
      });
    };

    assertNormalize(domain(0, 100), ticks(1, 10), ticks(f(1, 1), f(10, 1)));
    assertNormalize(domain(-2, 1), ticks(0.2, 0.4), ticks(f(1, 5), f(2, 5)));
    assertNormalize(domain(-2, 1), ticks(0.2, 0.5), ticks(f(1, 5), f(2, 5)));
  });

  describe('fractionRange', () => {
    const assertFr = (start, end, interval, expected) => {
      it(`${pf(start)}<->${pf(end)} (${pf(interval)}) == ${expected.map(
        pf
      )}`, () => {
        const result = mod.fractionRange(start, end, interval);
        //f(0, 1), f(6, 1), f(4, 1));
        expect(result).toEqual(expected); //[f(0, 1), f(4, 1)]);
      });
    };
    assertFr(f(-1, 2), f(-2.3), f(-1, 2), [
      f(-1, 2),
      f(-1),
      f(-3, 2),
      f(-4, 2)
    ]);
    assertFr(f(0), f(-2), f(-1), [f(0), f(-1), f(-2)]);
    assertFr(f(0), f(-23, 10), f(-0.4), [
      f(0),
      f(-4, 10),
      f(-8, 10),
      f(-6, 5),
      f(-8, 5),
      f(-2)
    ]);
    assertFr(f(0), f(-1.99), f(-1), [f(0), f(-1)]);
    assertFr(f(0), f(-2), f(-1), [f(0), f(-1), f(-2)]);
    assertFr(f(0), f(-6), f(-4), [f(0), f(-4)]);
    assertFr(f(0), f(-10), f(-8), [f(0), f(-8)]);
    assertFr(f(-4), f(-5.3), f(-1), [f(-4), f(-5)]);
    assertFr(f(-4), f(-4.3), f(-1), [f(-4)]);
  });
  describe('zeroBasedRange', () => {
    const assertZbr = (start, end, interval, expected) => {
      it(`${start}, ${end}, ${interval} = ${expected}`, () => {
        const result = mod.zeroBasedRange(start, end, interval);
        expect(result).toEqual(expected);
      });
    };

    const assertZbrError = (start, end, interval) => {
      it(`throws error for ${start}, ${end}, ${interval}`, () => {
        expect(() => mod.zeroBasedRange(start, end, interval)).toThrow(
          mod.zbrErrorMessage(start, end)
        );
      });
    };
    assertZbrError(-1, 2, 1);
    assertZbrError(-0.01, 2, 1);
    assertZbrError(-1, 0.001, 1);
    assertZbrError(-100, 100, 1);
    assertZbr(1.2, 2.3, 0.5, [f(3, 2), f(2, 1)]);
    assertZbr(-1.2, -2.3, -0.5, [f(-2, 1), f(-3, 2)]);
    assertZbr(1, 6, 4, [f(4)]);
    assertZbr(-1, -10, -8, [f(-8)]);
    assertZbr(0, -10, -8, [f(-8), f(0)]);
  });

  describe('simpleRange', () => {
    const assertSimpleRange = (start, end, interval, expected) => {
      it(`${start}, ${end}, ${interval} => ${expected}`, () => {
        const result = mod.simpleRange(start, end, interval);
        expect(result).toMatchObject(expected);
      });
    };
    assertSimpleRange(1, 10, 8, [f(8)]);
    assertSimpleRange(-10, -1, 8, [f(-8, 1)]);
    assertSimpleRange(-10, 10, 8, [f(-8, 1), f(0), f(8, 1)]);

    assertSimpleRange(-1, f(4, 3), f(1, 3), [
      f(-1, 1),
      f(-2, 3),
      f(-1, 3),
      f(0, 1),
      f(1, 3),
      f(2, 3),
      f(1, 1),
      f(4, 3)
    ]);

    assertSimpleRange(-1, 1, f(1, 2), [
      f(-1, 1),
      f(-1, 2),
      f(0, 1),
      f(1, 2),
      f(1, 1)
    ]);
  });

  const tt = (x, type) => ({ x, type });
  describe('buildTickData', () => {
    const assertTicks = (min, max, minor, major, opts, expected) => {
      expected = expected === undefined ? opts : expected;

      it(`${min}<->${max}, ${minor},${major} `, () => {
        //...
        const result = mod.buildTickData(
          { min, max },
          { minor, major },
          { limit: opts.limit }
        );

        // console.log('result', result);
        Object.keys(expected).forEach(i => {
          const a = expected[i];
          const index = parseInt(i, 10);
          const s = result.slice(index, index + a.length);
          expect(s).toEqual(a);
        });
      });
    };

    assertTicks(
      -5.3,
      -4,
      1,
      2,
      { limit: false },
      {
        0: [tt(-5, 'minor'), tt(-4, 'major')]
      }
    );
    assertTicks(-5.3, 5, 1, 2, {
      0: [tt(-5, 'minor'), tt(-4, 'major')]
    });
    assertTicks(
      1.2,
      2.3,
      0.5,
      1.5,
      { limit: false },
      {
        0: [tt(1.5, 'major')]
      }
    );

    assertTicks(-2.4, 1, 0.9, 1.8, {
      0: [tt(-1.8, 'major')]
    });
    assertTicks(-2, 1, 0.9, 1.8, {
      0: [tt(-1.8, 'major')]
    });

    assertTicks(1, 10, 1, 2, {
      0: [tt(1, 'minor'), tt(2, 'major'), tt(3, 'minor'), tt(4, 'major')]
    });

    assertTicks(-2, 1, 0.5, 1, {
      0: [
        tt(-2, 'major'),
        tt(-1.5, 'minor'),
        tt(-1, 'major'),
        tt(-0.5, 'minor')
      ]
    });

    assertTicks(-2, 1, 0.1, 0.2, {
      0: [tt(-2, 'major'), tt(-1.9, 'minor'), tt(-1.8, 'major')],
      20: [tt(0, 'major')],
      28: [tt(0.8, 'major')] //, tt(0.9, 'minor'), tt(1, 'max')]
    });

    assertTicks(
      -10,
      10,
      4,
      8,
      { limit: false },
      {
        0: [
          tt(-8, 'major'),
          tt(-4, 'minor'),
          tt(0, 'major'),
          tt(4, 'minor'),
          tt(8, 'major')
        ]
      }
    );

    assertTicks(-100, 10, 8, 16, {
      0: [tt(-96, 'major'), tt(-88, 'minor'), tt(-80, 'major')]
    });

    assertTicks(0, 100, 1, 10, {
      0: [tt(0, 'major')],
      90: [tt(90, 'major')],
      100: [tt(100, 'major')]
    });

    //limited to 100/3 + 200/3
    assertTicks(0, 100, 50, 50, {
      0: [
        tt(0, 'major'),
        tt(33.333333333333336, 'minor'),
        tt(66.666666666666666, 'major')
      ]
    });
  });

  describe('fractionSnapTo', () => {
    const assertSnapTo = (min, max, interval, value, expected) => {
      it(`snaps ${value} to ${expected} with domain ${min}<->${max} with interval: ${interval} `, () => {
        const result = mod.fractionSnapTo(
          math.fraction(min),
          math.fraction(max),
          math.fraction(interval),
          math.fraction(value)
        );
        // console.log('result:', result);
        expect(result).toEqual(math.fraction(expected));
      });
    };
    describe('with -10, 10, 0.1', () => {
      const a = assertSnapTo.bind(null, -10, 10, 0.1);
      a(-0.05, -0.1);
      a(-0.04, 0);
      a(-0.01, 0);
      a(0, 0);
      a(0.01, 0);
      a(0.02, 0);
      a(0.03, 0);
      a(0.04, 0);
      a(0.05, 0.1);
      a(-5.9, -5.9);
      a(-9.8, -9.8);
      a(-9.7, -9.7);
    });

    describe('with -10, -5, 0.5', () => {
      const a = assertSnapTo.bind(null, -10, -5, 0.5);
      a(-5.6, -5.5);
      a(-5.9, -6.0);
      a(-9.8, -10);
      a(-9.7, -9.5);
    });

    describe('with 0, 10, 0.25', () => {
      const a = assertSnapTo.bind(null, 0, 10, 0.25);
      a(1, 1);
      a(1.2, 1.25);
      a(0.2, 0.25);
      a(5.2, 5.25);
      a(5.2, 5.25);
      a(5.124, 5);
    });

    describe('with 0, 10, 1', () => {
      const a = assertSnapTo.bind(null, 0, 10, 1);
      a(0, 0);
      a(10, 10);
      a(100, 10);
      a(1, 1);
      a(1.2, 1);
      a(0.2, 0);
      a(5.2, 5);
      a(5.001, 5);
    });
  });
  describe('snapTo', () => {
    const assertSnapTo = (min, max, interval, value, expected) => {
      it(`snaps ${value} to ${expected} with domain ${min}<->${max} with interval: ${interval} `, () => {
        const result = mod.snapTo(min, max, interval, value);
        expect(result).toEqual(expected);
      });
    };

    describe('with -10, -5, 0.5', () => {
      const a = assertSnapTo.bind(null, -10, -5, 0.5);
      a(-5.6, -5.5);
      a(-9.8, -10);
      a(-9.7, -9.5);
    });

    describe('with 0, 10, 0.25', () => {
      const a = assertSnapTo.bind(null, 0, 10, 0.25);
      a(1, 1);
      a(1.2, 1.25);
      a(0.2, 0.25);
      a(5.2, 5.25);
      a(5.125, 5.25);
      a(5.124, 5);
    });

    describe('with 0, 10, 1', () => {
      const a = assertSnapTo.bind(null, 0, 10, 1);
      a(0, 0);
      a(10, 10);
      a(100, 10);
      a(1, 1);
      a(1.2, 1);
      a(0.2, 0);
      a(5.2, 5);
      a(5.001, 5);
    });
  });
});
