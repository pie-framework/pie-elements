import {
  equalPoint,
  equalSegment,
  equalVector,
  equalLine,
  equalRay,
  equalPolygon,
  equalCircle,
  equalSine,
  equalParabola,
  constructSegmentsFromPoints,
  removeDuplicateSegments,
  removeInvalidSegments,
  sortedAnswers,
} from '../utils';

// p = point, n = -
// eg.: A(0, -6) => p0_n6
// eg.: A(-10, -6) => pn10_n6
const pn10_n10 = { x: -10, y: -10 };
const pn6_9 = { x: -6, y: 9 };
const pn4_18d5 = { x: -4, y: 18.5 };
const pn4_0 = { x: -4, y: 0 };
const pn2_28 = { x: -2, y: 28 };
const pn1_n1 = { x: -1, y: -1 };
const pn1_2 = { x: -1, y: 2 };
const pn1_70 = { x: -1, y: 70 };
const pn1_0 = { x: -1, y: 0 };
const p0_n20 = { x: 0, y: -20 };
const p0_n10 = { x: 0, y: -10 };
const p0_n1 = { x: 0, y: -1 };
const p0_0 = { x: 0, y: 0 };
const p0_1 = { x: 0, y: 1 };
const p1_0 = { x: 1, y: 0 };
const p1_1 = { x: 1, y: 1 };
const p1_10 = { x: 1, y: 10 };
const p2_3 = { x: 2, y: 3 };
const p3_0 = { x: 3, y: 0 };
const p6_n9 = { x: 6, y: -9 };
const p10_n10 = { x: 10, y: -10 };
const p10_n1 = { x: 10, y: -1 };
const p10_0 = { x: 10, y: 0 };
const p10_10 = { x: 10, y: 10 };
const p10_134 = { x: 10, y: 134 };
const p11_11 = { x: 11, y: 11 };
const p12_0 = { x: 12, y: 0 };
const p12_1 = { x: 12, y: 1 };
const p20_20 = { x: 20, y: 20 };
const p22_22 = { x: 22, y: 22 };
const p30_0 = { x: 30, y: 0 };

describe('equalPoint', () => {
  test.each([
    [p0_0, p0_0, true],
    [p10_10, p10_10, true],
    [p2_3, p1_10, false],
    [p0_0, p1_0, false],
  ])('%j, %j => %s', (pointA, pointB, expected) => {
    const result = equalPoint(pointA, pointB);

    expect(result).toEqual(expected);
  });
});

describe('equalSegment', () => {
  test.each([
    [{ from: p0_0, to: p1_0 }, { from: p0_0, to: p1_0 }, true],
    [{ from: p0_0, to: p1_0 }, { from: p1_0, to: p0_0 }, true],
    [{ from: p0_0, to: p1_0 }, { from: p10_0, to: p1_0 }, false],
    [{ from: p0_n10, to: p22_22 }, { from: p22_22, to: p0_n10 }, true],
    [{ from: p0_n10, to: p22_22 }, { from: p22_22, to: p0_n1 }, false],
  ])('%j, %j => %s', (s1, s2, expected) => {
    const result = equalSegment(s1, s2);

    expect(result).toEqual(expected);
  });
});

describe('equalVector', () => {
  test.each([
    [{ from: p0_0, to: p1_0 }, { from: p0_0, to: p1_0 }, true],
    [{ from: p0_0, to: p1_0 }, { from: p1_0, to: p0_0 }, false],
    [{ from: p0_0, to: p1_0 }, { from: p10_0, to: p1_0 }, false],
    [{ from: p0_n10, to: p22_22 }, { from: p0_n10, to: p22_22 }, true],
    [{ from: p0_n10, to: p22_22 }, { from: p22_22, to: p0_n10 }, false],
    [{ from: p0_n10, to: p22_22 }, { from: p22_22, to: p0_n1 }, false],
  ])('%j, %j => %s', (v1, v2, expected) => {
    const result = equalVector(v1, v2);

    expect(result).toEqual(expected);
  });
});

describe('equalLine', () => {
  test.each([
    // Y axis 0
    // A(0, 0), B(1, 0); AB & BA
    // same segment, 2 points in common
    [{ from: p0_0, to: p1_0 }, { from: p1_0, to: p0_0 }, true],

    // A(0, 0), B(1, 0), C(3, 0); AB & CB
    // same line, only one point in common
    [{ from: p0_0, to: p1_0 }, { from: p3_0, to: p1_0 }, true],

    // A(0, 0), B(1, 0), C(30, 0), D(10, 0); AB & CD
    // same line, pno point in common
    [{ from: p0_0, to: p1_0 }, { from: p3_0, to: p1_0 }, true],

    // A(0, 0), B(1, 0), C(30, 0), D(10, 0); AB & CD
    // same line, pno point in common
    [{ from: p0_0, to: p1_0 }, { from: p30_0, to: p10_0 }, true],

    // parallel lines on Y axis
    // A(-4, 0), B(1, 0), C(-1, -1), D(10, -1)
    [{ from: pn4_0, to: p1_0 }, { from: pn1_n1, to: p10_n1 }, false],

    // X axis 0
    // A(0, 0), B(0, 1); AB & BA
    // same segment, 2 points in common
    [{ from: p0_0, to: p0_1 }, { from: p0_1, to: p0_0 }, true],

    // A(0, 0), B(0, 1), C(0, -10); AB & BC
    // same line, only one point in common
    [{ from: p0_0, to: p0_1 }, { from: p0_1, to: p0_n10 }, true],

    // A(0, 0), B(0, 1), C(0, -20), D(0, -10); AB & CD
    // same line, pno point in common
    [{ from: p0_0, to: p0_1 }, { from: p0_n20, to: p0_n10 }, true],

    // parallel lines on X axis
    // A(-1, 2), B(-1, -70), C(10, -10), D(10, 134)
    [{ from: pn1_2, to: pn1_70 }, { from: p10_n10, to: p10_134 }, false],

    // A(-10, -10), B(-6, 9), C(10, -10), D(10, 134)
    [{ from: pn10_n10, to: pn6_9 }, { from: p10_n10, to: p10_134 }, false],

    // A(-10, -10), B(-6, 9), C(10, 10), D(6, -9)
    [{ from: pn10_n10, to: pn6_9 }, { from: p10_n10, to: p6_n9 }, false],

    // A(-10, -10), B(-6, 9), C(-6, 9), D(-2, 28)
    [{ from: pn10_n10, to: pn6_9 }, { from: pn6_9, to: pn2_28 }, true],

    // A(-10, -10), B(-6, 9), C(-4, 18.5), D(-2, 28)
    [{ from: pn10_n10, to: pn6_9 }, { from: pn4_18d5, to: pn2_28 }, true],

    // A(-10, -10), B(-6, 9), C(-4, 18.5), D(-2, 28)
    [{ from: pn10_n10, to: pn6_9 }, { from: pn2_28, to: pn4_18d5 }, true],

    // A(0, 0), B(1, 0), C(12, 0), D(12, 1); AB & AC
    [{ from: p0_0, to: p1_0 }, { from: p0_0, to: p12_0 }, true],

    // A(0, 0), B(1, 0), C(12, 0), D(12, 1); AB & AD
    [{ from: p0_0, to: p1_0 }, { from: p0_0, to: p12_1 }, false],

    // A(0, 0), B(1, 0), C(12, 0), D(12, 1); AC & AD
    [{ from: p0_0, to: p12_0 }, { from: p0_0, to: p12_1 }, false],

    // A(-10, -10), B(0, 0), C(20, 20), D(11, 11)
    [{ from: pn10_n10, to: p0_0 }, { from: p20_20, to: p11_11 }, true],

    // A(-10, -10), B(0, 0), C(-1, -1), D(22, 22)
    [{ from: pn10_n10, to: p0_0 }, { from: pn1_n1, to: p22_22 }, true],

    // A(-10, -10), B(0, 0), C(-1, -1), D(22, 23)
    [
      { from: pn10_n10, to: p0_0 },
      { from: pn1_n1, to: { x: 22, y: 23 } },
      false,
    ],

    [{ from: p0_0, to: p1_0 }, { from: p10_10, to: p1_0 }, false],
  ])('%j, %j => %s', (l1, l2, expected) => {
    const result = equalLine(l1, l2);

    expect(result).toEqual(expected);
  });
});

describe('equalRay', () => {
  test.each([
    [{ from: p0_0, to: p1_0 }, { from: p0_0, to: p1_0 }, true],
    [{ from: p0_0, to: p1_0 }, { from: p0_0, to: p10_0 }, true],
    [{ from: p0_1, to: p0_0 }, { from: p0_1, to: p0_n10 }, true],
    [{ from: p0_0, to: p1_0 }, { from: p3_0, to: p1_0 }, false],
    [{ from: p0_0, to: p1_0 }, { from: p10_0, to: p1_0 }, false],
    [{ from: p0_0, to: p1_0 }, { from: p1_0, to: p0_0 }, false],
    [{ from: p0_0, to: p1_0 }, { from: p10_0, to: p1_0 }, false],
    [{ from: p0_0, to: p0_1 }, { from: p0_1, to: p0_0 }, false],
  ])('%j, %j => %s', (r1, r2, expected) => {
    const result = equalRay(r1, r2);

    expect(result).toEqual(expected);
  });
});

describe('equalPolygon', () => {
  const assert = (pointsA, pointsB, expected) => {
    it(`[${JSON.stringify(pointsA)}], [${JSON.stringify(pointsB)}] ${
      expected ? 'are' : 'are not'
      } equal`, () => {
        const result = equalPolygon({ points: pointsA }, { points: pointsB });

        expect(result).toEqual(expected);
      });
  };

  const A = { x: 0, y: 0 };
  const B = { x: 0, y: 2 };
  const C = { x: 2, y: 2 };
  const D = { x: 2, y: 0 };
  const E = { x: 2, y: 1 };

  test.each([
    [[A, B, C], [A, B, C], true],
    [[A, B, C], [A, C, B], true],
    [[A, B, C], [B, A, C], true],
    [[A, B, C], [B, C, A], true],
    [[A, B, C], [C, B, A], true],
    [[A, B, C], [C, A, B], true],
    [[A, B, C], [C, A, B, A], false],
    [[A, B, C], [C, A, B, E], false],
    [[A, B, C], [C, A, B, C, A, C], true],
    [[A, B, C], [A, B, C, D, E], false],
    [[A, B, C, D], [A, B, C, D], true],
    [[A, B, C, D], [D, C, B, A], true],
    [[A, B, C, D], [A, B, C, D, C, B, A, B, C, D], true],
    [[A, B, C, D], [A, A, B, B, C, C, C, D, D, D, D], true],
    [[A, B, C, D], [A, B, C, D, A, B, C, D, A, B, C], false],
    [[A, B, C, D], [A, B, C, D, A, B, C, D, A, B, C, D], true],
    [[A, B, C, D], [A, B, C, D, A, B, C, D, A, B, C, C], false],
    [[A, B, C, D], [A, C, B, D], false],
    [[A, B, C, D], [A, D, B, C], false],
    [[A, B, C, D], [A, D, B, C, A], false],
    [[A, B, C, D], [A, B, C, A, D, D], false],
    [[A, B, C, D], [A, D, B, C, A, D, D], false],
    [[A, B, C, D], [A, D, B, C, A, D, D], false],
    // ABCDA = ADCBA = BCDAB = BADCB = CDABC = CBADC = DABCD = DCBAD (polygon 1),
    [[A, B, C, D], [A, D, C, B, A], true],
    [[A, B, C, D], [B, C, D, A, B], true],
    [[A, B, C, D], [B, A, D, C, B], true],
    [[A, B, C, D], [C, D, A, B, C], true],
    [[A, B, C, D], [C, B, A, D, C], true],
    [[A, B, C, D], [D, A, B, C, D], true],
    [[A, B, C, D], [D, C, B, A, D], true],
    // diff ACBDA = ADBCA = BCADB = BDABC = CBDAC = CADBC = DACBD = DBCAD (polygon 2)
    [[A, B, C, D], [A, C, B, D, A], false],
    [[A, B, C, D], [A, D, B, C, A], false],
    [[A, B, C, D], [B, C, A, D, B], false],
    [[A, B, C, D], [B, D, A, B, C], false],
    [[A, B, C, D], [C, B, D, A, C], false],
    [[A, B, C, D], [C, A, D, B, C], false],
    [[A, B, C, D], [D, A, C, B, D], false],
    [[A, B, C, D], [D, B, C, A, D], false],
    // diff ACDBA = ABDCA = BDCAB = BACDB = CDBAC = CABDC = DBACD = DCABD (polygon 3)
    [[A, B, C, D], [A, C, B, D, A], false],
    [[A, B, C, D], [A, B, D, C, A], false],
    [[A, B, C, D], [B, D, C, A, B], false],
    [[A, B, C, D], [B, A, C, D, B], false],
    [[A, B, C, D], [C, D, B, A, C], false],
    [[A, B, C, D], [C, A, B, D, C], false],
    [[A, B, C, D], [D, B, A, C, D], false],
    [[A, B, C, D], [D, C, A, B, D], false],
  ])('points1 = %j, points2 = %j => %s', (points1, points2, expected) => {
    const result = equalPolygon({ points: points1 }, { points: points2 });

    expect(result).toEqual(expected);
  });

  assert(
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
    [
      { x: 1, y: 1 },
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      { x: 3, y: 0 },
      { x: 2, y: 2 },
    ],
    false
  );
});

describe('equalCircle', () => {
  test.each([
    [{ root: p0_0, edge: p1_0 }, { root: p0_0, edge: p1_0 }, true],
    [{ root: p0_0, edge: p1_0 }, { root: p0_0, edge: pn1_0 }, true],
    [{ root: p0_0, edge: p1_0 }, { root: p0_0, edge: p0_n1 }, true],
    [{ root: p0_0, edge: p1_0 }, { root: p0_0, edge: p0_1 }, true],
    [{ root: p0_0, edge: p1_0 }, { root: p0_0, edge: p1_1 }, false],
  ])('%j, %j => %s', (c1, c2, expected) => {
    const result = equalCircle(c1, c2);

    expect(result).toEqual(expected);
  });
});

describe('equalSine', () => {
  const assert = (sine1, sine2, expected) => {
    it(`[(${sine1.root.x},${sine1.root.y}), (${sine1.edge.x},${
      sine1.edge.y
      })], [(${sine2.root.x},${sine2.root.y}), (${sine2.edge.x},${
      sine2.edge.y
      })] ${expected ? 'are' : 'are not'} equal`, () => {
        const result = equalSine(sine1, sine2);

        expect(result).toEqual(expected);
      });
  };

  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
    { root: { x: 2, y: 0 }, edge: { x: 1, y: 1 } },
    true
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
    { root: { x: 1, y: 0 }, edge: { x: 1, y: 1 } },
    false
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
    { root: { x: 20, y: 0 }, edge: { x: 21, y: 1 } },
    true
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
    { root: { x: 21, y: 0 }, edge: { x: 21, y: 1 } },
    false
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 0, y: 0 } },
    { root: { x: 21, y: 0 }, edge: { x: 21, y: 1 } },
    false
  );
  assert(
    { root: { x: 0, y: 1 }, edge: { x: 1, y: 1 } },
    { root: { x: 24, y: 1 }, edge: { x: 25, y: 1 } },
    true
  );

  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: -0.6, y: 0 }, edge: { x: -0.9, y: -1.2 } },
    true
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: -2.4, y: 0 }, edge: { x: -2.7, y: 1.2 } },
    true
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: -2.4, y: 0 }, edge: { x: -2.1, y: -1.2 } },
    true
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: 0, y: 0 }, edge: { x: -0.3, y: 1.2 } },
    true
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: 3, y: 0 }, edge: { x: 3.3, y: 1.2 } },
    true
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: 3, y: 0 }, edge: { x: 2.7, y: -1.2 } },
    true
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: 0.9, y: 1.2 }, edge: { x: 0.6, y: 0 } },
    false
  );
  assert(
    { root: { x: 0.6, y: 0 }, edge: { x: 0.9, y: 1.2 } },
    { root: { x: 0.6, y: 0 }, edge: { x: 0.6, y: 0 } },
    false
  );

  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 2 } },
    { root: { x: 2, y: 0 }, edge: { x: 3, y: -2 } },
    true
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 2 } },
    { root: { x: -10, y: 0 }, edge: { x: -11, y: 2 } },
    true
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 2 } },
    { root: { x: -10, y: 0 }, edge: { x: -9, y: 2 } },
    false
  );
  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 2 } },
    { root: { x: -10, y: 0 }, edge: { x: -9, y: -2 } },
    true
  );
});

describe('equalParabola', () => {
  const assert = (p1, p2, expected) => {
    it(`[(${p1.root.x},${p1.root.y}), (${p1.edge.x},${p1.edge.y})], [(${
      p2.root.x
      },${p2.root.y}), (${p2.edge.x},${p2.edge.y})] ${
      expected ? 'are' : 'are not'
      } equal`, () => {
        const result = equalParabola(p1, p2);

        expect(result).toEqual(expected);
      });
  };

  assert(
    { root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
    { root: { x: 2, y: 0 }, edge: { x: 1, y: 1 } },
    false
  );

  // a * x^2 + b * x + c

  // a = 8, b = 4, c = 2
  assert(
    { root: { x: -0.25, y: 1.5 }, edge: { x: 0.25, y: 3.5 } },
    { root: { x: -0.25, y: 1.5 }, edge: { x: -0.75, y: 3.5 } },
    true
  );
  assert(
    { root: { x: -0.25, y: 1.5 }, edge: { x: 0.25, y: 3.5 } },
    { root: { x: -0.25, y: 1.5 }, edge: { x: -1, y: 6 } },
    true
  );
  assert(
    { root: { x: -0.25, y: 1.5 }, edge: { x: 0.25, y: 3.5 } },
    { root: { x: -0.25, y: 1.5 }, edge: { x: 1, y: 14 } },
    true
  );
  assert(
    { root: { x: -0.25, y: 1.5 }, edge: { x: 0.25, y: 3.5 } },
    { root: { x: -0.25, y: 1.5 }, edge: { x: 1.25, y: -19.5 } },
    false
  );

  // a = -8, b = -4, c = -2
  assert(
    { root: { x: -0.25, y: -1.5 }, edge: { x: 0.25, y: -3.5 } },
    { root: { x: -0.25, y: -1.5 }, edge: { x: -0.75, y: -3.5 } },
    true
  );
  assert(
    { root: { x: -0.25, y: -1.5 }, edge: { x: 0.25, y: -3.5 } },
    { root: { x: -0.25, y: -1.5 }, edge: { x: -1, y: -6 } },
    true
  );
  assert(
    { root: { x: -0.25, y: -1.5 }, edge: { x: 0.25, y: -3.5 } },
    { root: { x: -0.25, y: -1.5 }, edge: { x: 1, y: -14 } },
    true
  );
  assert(
    { root: { x: -0.25, y: -1.5 }, edge: { x: 0.25, y: -3.5 } },
    { root: { x: -0.25, y: -1.5 }, edge: { x: 1.25, y: 19.5 } },
    false
  );

  // a = 10, b = 0, c = -2
  assert(
    { root: { x: 0, y: -2 }, edge: { x: 0.5, y: 0.5 } },
    { root: { x: 0, y: -2 }, edge: { x: -0.5, y: 0.5 } },
    true
  );
  assert(
    { root: { x: 0, y: -2 }, edge: { x: 0.5, y: 0.5 } },
    { root: { x: 0, y: -2 }, edge: { x: -1, y: 8 } },
    true
  );
  assert(
    { root: { x: 0, y: -2 }, edge: { x: 0.5, y: 0.5 } },
    { root: { x: 0, y: -2 }, edge: { x: 1, y: 8 } },
    true
  );
  assert(
    { root: { x: 0, y: -2 }, edge: { x: 0.5, y: 0.5 } },
    { root: { x: 0, y: -2 }, edge: { x: 3, y: 89 } },
    false
  );

  // a = 10, b = -10, c = 0
  assert(
    { root: { x: 0.5, y: -2.5 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: -2.5 }, edge: { x: 1, y: 0 } },
    true
  );
  assert(
    { root: { x: 0.5, y: -2.5 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: -2.5 }, edge: { x: -1, y: 20 } },
    true
  );
  assert(
    { root: { x: 0.5, y: -2.5 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: -2.5 }, edge: { x: 1.25, y: 3.125 } },
    true
  );
  assert(
    { root: { x: 0.5, y: -2.5 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: -2.5 }, edge: { x: 3, y: 0 } },
    false
  );

  // a = -4, b = 4, c = 0
  assert(
    { root: { x: 0.5, y: 1 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: 1 }, edge: { x: 1, y: 0 } },
    true
  );
  assert(
    { root: { x: 0.5, y: 1 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: 1 }, edge: { x: -0.5, y: -3 } },
    true
  );
  assert(
    { root: { x: 0.5, y: 1 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: 1 }, edge: { x: 1.5, y: -3 } },
    true
  );
  assert(
    { root: { x: 0.5, y: 1 }, edge: { x: 0, y: 0 } },
    { root: { x: 0.5, y: 1 }, edge: { x: 3, y: 0 } },
    false
  );

  // a = -6, b = 4.5, c = 13.9
  assert(
    { root: { x: -3 / 8, y: 27 / 32 }, edge: { x: -0.75, y: 0 } },
    { root: { x: -3 / 8, y: 27 / 32 }, edge: { x: 0, y: 0 } },
    true
  );

  // a = -1, b = -9, c = 3
  assert(
    {
      root: { x: -4.5, y: 93 / 4 },
      edge: { x: -4.5 - Math.sqrt(93) / 2, y: 0 },
    },
    {
      root: { x: -4.5, y: 93 / 4 },
      edge: { x: Math.sqrt(93) / 2 - 4.5, y: 0 },
    },
    true
  );

  assert(
    {
      root: { x: -4.5, y: 93 / 4 },
      edge: { x: -4.5 - Math.sqrt(93) / 2, y: 0 },
    },
    { root: { x: -4.5, y: 93 / 4 }, edge: { x: -67.9, y: -3996.31 } },
    true
  );

  assert(
    {
      root: { x: -4.5, y: 93 / 4 },
      edge: { x: -4.5 - Math.sqrt(93) / 2, y: 0 },
    },
    { root: { x: -4.5, y: 93 / 4 }, edge: { x: -67.9, y: -3996.3000009 } },
    false
  );
});

describe('constructSegmentsFromPoints', () => {
  test.each([
    [
      [p0_0, p22_22],
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: p0_0 },
      ],
    ],
    [
      [p0_0, p22_22, pn1_n1],
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: pn1_n1 },
        { from: pn1_n1, to: p0_0 },
      ],
    ],
    [
      [p0_0, p22_22, pn1_n1, p1_0],
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: pn1_n1 },
        { from: pn1_n1, to: p1_0 },
        { from: p1_0, to: p0_0 },
      ],
    ],
    [
      [p0_0, p22_22, pn1_n1, p1_0, p30_0],
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: pn1_n1 },
        { from: pn1_n1, to: p1_0 },
        { from: p1_0, to: p30_0 },
        { from: p30_0, to: p0_0 },
      ],
    ],
    [undefined, []],
    [null, []],
    [[], []],
  ])('points: %j, segments: %j', (points, segments) => {
    expect(constructSegmentsFromPoints(points)).toEqual(segments);
  });
});

describe('removeDuplicateSegments', () => {
  test.each([
    [
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: p0_0 },
      ],
      [{ from: p0_0, to: p22_22 }],
    ],
    [
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: pn1_n1 },
        { from: p22_22, to: pn1_n1 },
        { from: pn1_n1, to: p0_0 },
        { from: pn1_n1, to: p0_0 },
        { from: p0_0, to: pn1_n1 },
      ],
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: pn1_n1 },
        { from: pn1_n1, to: p0_0 },
      ],
    ],
    [
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: p0_0 },
        { from: p22_22, to: pn1_n1 },
        { from: pn1_n1, to: p1_0 },
        { from: pn1_n1, to: p1_0 },
        { from: pn1_n1, to: p22_22 },
        { from: p1_0, to: pn1_n1 },
        { from: p1_0, to: p0_0 },
      ],
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: pn1_n1 },
        { from: pn1_n1, to: p1_0 },
        { from: p1_0, to: p0_0 },
      ],
    ],
    [
      [
        { from: p0_0, to: p22_22 },
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: p0_0 },
        { from: p22_22, to: pn1_n1 },
        { from: p22_22, to: pn1_n1 },
        { from: pn1_n1, to: p22_22 },
        { from: pn1_n1, to: p1_0 },
        { from: pn1_n1, to: p1_0 },
        { from: p1_0, to: pn1_n1 },
        { from: p1_0, to: p30_0 },
        { from: p1_0, to: p30_0 },
        { from: p30_0, to: p1_0 },
        { from: p30_0, to: p0_0 },
        { from: p30_0, to: p0_0 },
        { from: p0_0, to: p30_0 },
      ],
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: pn1_n1 },
        { from: pn1_n1, to: p1_0 },
        { from: p1_0, to: p30_0 },
        { from: p30_0, to: p0_0 },
      ],
    ],
    [undefined, []],
    [null, []],
    [[], []],
  ])(
    'segments: %j, segments without duplicates: %j',
    (segments, segmentsWithoutDuplicates) => {
      expect(removeDuplicateSegments(segments)).toEqual(
        segmentsWithoutDuplicates
      );
    }
  );
});

describe('removeInvalidSegments', () => {
  test.each([
    [
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: p0_0 },
      ],
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: p0_0 },
      ],
    ],
    [
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: pn1_n1 },
        { from: p22_22, to: p22_22 },
        { from: pn1_n1, to: p0_0 },
      ],
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: pn1_n1 },
        { from: pn1_n1, to: p0_0 },
      ],
    ],
    [
      [
        { from: p0_0, to: p22_22 },
        { from: p0_0, to: p0_0 },
        { from: p22_22, to: pn1_n1 },
        { from: p22_22, to: p22_22 },
        { from: pn1_n1, to: p1_0 },
        { from: pn1_n1, to: pn1_n1 },
        { from: p1_0, to: p30_0 },
        { from: p1_0, to: p1_0 },
        { from: p30_0, to: p0_0 },
        { from: p30_0, to: p30_0 },
      ],
      [
        { from: p0_0, to: p22_22 },
        { from: p22_22, to: pn1_n1 },
        { from: pn1_n1, to: p1_0 },
        { from: p1_0, to: p30_0 },
        { from: p30_0, to: p0_0 },
      ],
    ],
    [undefined, []],
    [null, []],
    [[], []],
  ])(
    'segments: %j, only valid segments: %j',
    (segments, segmentsWithoutDuplicates) => {
      expect(removeInvalidSegments(segments)).toEqual(
        segmentsWithoutDuplicates
      );
    }
  );
});

// test.each([])('', () => {});

describe('sortedAnswers', () => {


  it('sortedAnswers should return empty object for undefined answers array', () => {
    const answers = undefined;
    const result = {};
    expect(sortedAnswers(answers)).toEqual(result);
  })
});

it('sortedAnswers should return empty object for an empty answers array', () => {
  const answers = {};
  const result = {};
  expect(sortedAnswers(answers)).toEqual(result);
})

it('sortedAnswers should return an array of answers sorted alphabetically', () => {
  const answers = {
    correctAnswer: {
      name: 'Correct Answer',
      marks: [{
        type: 'point',
        x: 0,
        y: 0
      }]
    },
    aCorrectAnswer: {
      name: 'Correct Answer',
      marks: [{
        type: 'point',
        x: 0,
        y: 0
      }]
    },
    alternate1: {
      name: 'Alternate 1',
      marks: [{
        type: 'segment',
        from: { x: 0, y: 0 },
        to: { x: 1, y: 1 },
      },
      {
        type: 'point',
        x: 3,
        y: 3,
        label: 'Point',
        showLabel: true
      }]
    }
  };

  const result = {
    aCorrectAnswer: {
      name: 'Correct Answer',
      marks: [{
        type: 'point',
        x: 0,
        y: 0
      }]
    },
    alternate1: {
      name: 'Alternate 1',
      marks: [{
        type: 'segment',
        from: { x: 0, y: 0 },
        to: { x: 1, y: 1 },
      },
      {
        type: 'point',
        x: 3,
        y: 3,
        label: 'Point',
        showLabel: true
      }]
    },
    correctAnswer: {
      name: 'Correct Answer',
      marks: [{
        type: 'point',
        x: 0,
        y: 0
      }]
    },
  };

  expect(sortedAnswers(answers)).toEqual(result);
});
