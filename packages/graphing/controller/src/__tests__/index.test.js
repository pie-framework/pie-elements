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
  eliminateDuplicates,
  unMapMarks,
  dichotomous,
  partial,
  getScore,
  outcome,
  createCorrectResponseSession
} from '../index';

jest.mock('@pie-lib/graphing-utils', () => ({
    sinY: jest.fn(),
    buildDataPoints: (min, max, root, edge) => ([min, root, edge, max]),
    getAmplitudeAndFreq: () => ({
      amplitude: 0,
      freq: 1
    }),
    parabolaFromTwoPoints: jest.fn(),
    FREQ_DIVIDER: 0
  }
));

describe('controller', () => {
});

describe('equalPoint', () => {
  const assert = (pointA, pointB, expected) => {
    it(`${pointA.x},${pointA.y} & ${pointB.x},${pointB.y} ${expected ? 'are' : 'are not'} equal`, () => {
      const result = equalPoint(pointA, pointB);

      expect(result).toEqual(expected);
    });
  };

  assert({ x: 0, y: 0 }, { x: 0, y: 0 }, true);
  assert({ x: 0, y: 0 }, { x: 1, y: 0 }, false);
});

describe('equalSegment', () => {
  const assert = (s1, s2, expected) => {
    it(`[(${s1.from.x},${s1.from.y}), (${s1.to.x},${s1.to.y})], [(${s2.from.x},${s2.from.y}), (${s2.to.x},${s2.to.y})] ${expected ? 'are' : 'are not'} equal`, () => {
      const result = equalSegment(s1, s2);

      expect(result).toEqual(expected);
    });
  };

  assert({ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, { from: { x: 1, y: 0 }, to: { x: 0, y: 0 } }, true);
  assert({ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, true);
  assert({ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, { from: { x: 10, y: 0 }, to: { x: 1, y: 0 } }, false);
});

describe('equalVector', () => {
  const assert = (v1, v2, expected) => {
    it(`[(${v1.from.x},${v1.from.y}), (${v1.to.x},${v1.to.y})], [(${v2.from.x},${v2.from.y}), (${v2.to.x},${v2.to.y})] ${expected ? 'are' : 'are not'} equal`, () => {
      const result = equalVector(v1, v2);

      expect(result).toEqual(expected);
    });
  };

  assert({ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, { from: { x: 1, y: 0 }, to: { x: 0, y: 0 } }, false);
  assert({ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, true);
  assert({ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, { from: { x: 10, y: 0 }, to: { x: 1, y: 0 } }, false);
});

describe('equalLine', () => {
  const assert = (l1, l2, expected) => {
    it(`[(${l1.from.x},${l1.from.y}), (${l1.to.x},${l1.to.y})], [(${l2.from.x},${l2.from.y}), (${l2.to.x},${l2.to.y})] ${expected ? 'are' : 'are not'} equal`, () => {
      const result = equalLine(l1, l2);

      expect(result).toEqual(expected);
    });
  };

  assert({ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, { from: { x: 1, y: 0 }, to: { x: 0, y: 0 } }, true);
  assert({ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, { from: { x: 3, y: 0 }, to: { x: 1, y: 0 } }, true);
  assert({ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, { from: { x: 10, y: 10 }, to: { x: 1, y: 0 } }, false);
});

describe('equalRay', () => {
  const assert = (r1, r2, expected) => {
    it(`[(${r1.from.x},${r1.from.y}), (${r1.to.x},${r1.to.y})], [(${r2.from.x},${r2.from.y}), (${r2.to.x},${r2.to.y})] ${expected ? 'are' : 'are not'} equal`, () => {
      const result = equalRay(r1, r2);

      expect(result).toEqual(expected);
    });
  };

  assert({ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, { from: { x: 0, y: 0 }, to: { x: 10, y: 0 } }, true);
  assert({ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, { from: { x: 3, y: 0 }, to: { x: 1, y: 0 } }, false);
  assert({ from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, { from: { x: 10, y: 10 }, to: { x: 1, y: 0 } }, false);
});

describe('equalPolygon', () => {
  const assert = (pointsA, pointsB, expected) => {
    it(`[${pointsA.forEach(p => `(${p.x}, ${p.y})`)}], [${pointsB.forEach(p => `(${p.x}, ${p.y})`)}] ${expected ? 'are' : 'are not'} equal`, () => {
      const result = equalPolygon(pointsA, pointsB);

      expect(result).toEqual(expected);
    });
  };

  assert(
    [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
    [{ x: 1, y: 1 }, { x: 0, y: 0 }, { x: 2, y: 2 }],
    true
  );

  assert(
    [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
    [{ x: 1, y: 1 }, { x: 0, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 0 }, { x: 2, y: 2 }],
    true
  );

  assert(
    [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
    [{ x: 1, y: 1 }, { x: 0, y: 0 }, { x: 2, y: 2 }, { x: 3, y: 0 }, { x: 2, y: 2 }],
    false
  );
});

describe('equalCircle', () => {
  const assert = (c1, c2, expected) => {
    it(`[(${c1.root.x},${c1.root.y}), (${c1.edge.x},${c1.edge.y})], [(${c2.root.x},${c2.root.y}), (${c2.edge.x},${c2.edge.y})] ${expected ? 'are' : 'are not'} equal`, () => {
      const result = equalCircle(c1, c2);

      expect(result).toEqual(expected);
    });
  };

  assert({ root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } }, { root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } }, true);
  assert({ root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } }, { root: { x: 0, y: 0 }, edge: { x: -1, y: 0 } }, true);
  assert({ root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } }, { root: { x: 0, y: 0 }, edge: { x: 0, y: -1 } }, true);
  assert({ root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } }, { root: { x: 0, y: 0 }, edge: { x: 0, y: 1 } }, true);
  assert({ root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } }, { root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } }, false);
});

describe('equalSine', () => {
  const assert = (sine1, sine2, expected) => {
    it(`[(${sine1.root.x},${sine1.root.y}), (${sine1.edge.x},${sine1.edge.y})], [(${sine2.root.x},${sine2.root.y}), (${sine2.edge.x},${sine2.edge.y})] ${expected ? 'are' : 'are not'} equal`, () => {
      const result = equalSine(sine1, sine2);

      expect(result).toEqual(expected);
    });
  };

  assert({ root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } }, { root: { x: 2, y: 0 }, edge: { x: 1, y: 1 } }, true);
  // TODO
});

describe('equalParabola', () => {
  const assert = (p1, p2, expected) => {
    it(`[(${p1.root.x},${p1.root.y}), (${p1.edge.x},${p1.edge.y})], [(${p2.root.x},${p2.root.y}), (${p2.edge.x},${p2.edge.y})] ${expected ? 'are' : 'are not'} equal`, () => {
      const result = equalParabola(p1, p2);

      expect(result).toEqual(expected);
    });
  };

  assert({ root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } }, { root: { x: 2, y: 0 }, edge: { x: 1, y: 1 } }, false);
  // TODO
});

describe('eliminateDuplicates', () => {
  const assert = (marks, expected, type) => {
    it(type, () => {
      const result = eliminateDuplicates(marks, expected);

      expect(result).toEqual(expected);
    });
  };

  assert(
    [{ type: 'point', x: 0, y: 0 }, { type: 'point', x: 0, y: 0 }],
    {
      point: [{ type: 'point', x: 0, y: 0 }],
      segment: [],
      line: [],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    },
    'point'
  );

  assert(
    [{ type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }, {
      type: 'segment',
      to: { x: 0, y: 0 },
      from: { x: 1, y: 1 }
    }],
    {
      point: [],
      segment: [{ type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
      line: [],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    },
    'segment'
  );

  assert(
    [
      { type: 'vector', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
      { type: 'vector', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
      { type: 'vector', from: { x: 0, y: 0 }, to: { x: 12, y: 1 } }
    ],
    {
      point: [],
      segment: [],
      line: [],
      ray: [],
      vector: [{ type: 'vector', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }, {
        type: 'vector',
        from: { x: 0, y: 0 },
        to: { x: 12, y: 1 }
      }],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    },
    'vector'
  );

  assert(
    [
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 12, y: 0 } },
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 12, y: 1 } }
    ],
    {
      point: [],
      segment: [],
      line: [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, {
        type: 'line',
        from: { x: 0, y: 0 },
        to: { x: 12, y: 1 }
      }],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    },
    'line'
  );

  assert(
    [
      { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } },
      { type: 'ray', from: { x: 0, y: 0 }, to: { x: 12, y: 0 } },
      { type: 'ray', from: { x: 0, y: 0 }, to: { x: 2, y: 0 } }
    ],
    {
      point: [],
      segment: [],
      line: [],
      ray: [{ type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }, {
        type: 'ray',
        from: { x: 0, y: 0 },
        to: { x: 12, y: 0 }
      }],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    },
    'ray'
  );

  assert(
    [
      { type: 'polygon', points: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }] },
      { type: 'polygon', points: [{ x: 1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }] },
      { type: 'polygon', points: [{ x: 1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }] }
    ],
    {
      point: [],
      segment: [],
      line: [],
      ray: [],
      vector: [],
      polygon: [{ type: 'polygon', points: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }] }, {
        type: 'polygon',
        points: [{ x: 1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }]
      }],
      circle: [],
      sine: [],
      parabola: []
    },
    'polygon'
  );

  assert(
    [
      { type: 'circle', root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } },
      { type: 'circle', root: { x: 0, y: 0 }, edge: { x: 0, y: 1 } },
      { type: 'circle', root: { x: 0, y: 0 }, edge: { x: -1, y: 0 } }
    ],
    {
      point: [],
      segment: [],
      line: [],
      ray: [],
      vector: [],
      polygon: [],
      circle: [{ type: 'circle', root: { x: 0, y: 0 }, edge: { x: 1, y: 0 } }],
      sine: [],
      parabola: []
    },
    'circle'
  );

  // TODO
  assert(
    [
      { type: 'sine', root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
      { type: 'sine', root: { x: 2, y: 0 }, edge: { x: 1, y: 1 } },
      { type: 'sine', root: { x: 2, y: 0 }, edge: { x: 3, y: 1 } },
    ],
    {
      point: [],
      segment: [],
      line: [],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [{ type: 'sine', root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } }],
      parabola: []
    },
    'sine'
  );

  // TODO
  assert(
    [
      { type: 'parabola', root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } },
      { type: 'parabola', root: { x: 2, y: 0 }, edge: { x: 1, y: 1 } },
    ],
    {
      point: [],
      segment: [],
      line: [],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: [{ type: 'parabola', root: { x: 0, y: 0 }, edge: { x: 1, y: 1 } }, {
        type: 'parabola',
        root: { x: 2, y: 0 },
        edge: { x: 1, y: 1 }
      }]
    },
    'parabola'
  );

  const assertInvalidMarks = (marks) => {
    it(`returns proper result if marks are ${JSON.stringify(marks)}`, () => {
      const result = eliminateDuplicates(undefined);

      expect(result).toEqual({
        point: [],
        segment: [],
        line: [],
        ray: [],
        vector: [],
        polygon: [],
        circle: [],
        sine: [],
        parabola: []
      })
    });
  };

  assertInvalidMarks(undefined);
  assertInvalidMarks(null);
  assertInvalidMarks({});

  it('removes the marks that don\'t have a valid type', () => {
    const result = eliminateDuplicates([
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 12, y: 1 } },
      { type: 'typeThatDoesNotExist' }
    ]);


    expect(result).toEqual({
      point: [],
      segment: [],
      line: [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, {
        type: 'line',
        from: { x: 0, y: 0 },
        to: { x: 12, y: 1 }
      }],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    })
  });

  it('removes the marks that don\'t have a type', () => {
    const result = eliminateDuplicates([
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
      { type: 'line', from: { x: 0, y: 0 }, to: { x: 12, y: 1 } },
      { something: 'Something' }
    ]);


    expect(result).toEqual({
      point: [],
      segment: [],
      line: [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, {
        type: 'line',
        from: { x: 0, y: 0 },
        to: { x: 12, y: 1 }
      }],
      ray: [],
      vector: [],
      polygon: [],
      circle: [],
      sine: [],
      parabola: []
    })
  });

  // exceptions
  const assertMarks = (mark) => {
    it(`removes the ${JSON.stringify(mark)} marks`, () => {
      const result = eliminateDuplicates([
        { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
        mark,
        { type: 'line', from: { x: 0, y: 0 }, to: { x: 12, y: 1 } }
      ]);


      expect(result).toEqual({
        point: [],
        segment: [],
        line: [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }, {
          type: 'line',
          from: { x: 0, y: 0 },
          to: { x: 12, y: 1 }
        }],
        ray: [],
        vector: [],
        polygon: [],
        circle: [],
        sine: [],
        parabola: []
      })
    });
  };

  assertMarks(undefined);
  assertMarks(null);
  assertMarks({});
});

describe('unMapMarks', () => {
  const assert = (marks, expected) => {
    it('unmapps object', () => {
      const result = unMapMarks(marks);

      expect(result).toEqual(expected);
    });
  };

  assert({
    point: [{ x: 1, y: 1, type: 'point' }, { x: 2, y: 2, type: 'point' }],
    segment: [{ type: 'segment', from: { x: 1, y: 1 }, to: { x: 1, y: 1 } }]
  }, [{ x: 1, y: 1, type: 'point' }, { x: 2, y: 2, type: 'point' }, {
    type: 'segment',
    from: { x: 1, y: 1 },
    to: { x: 1, y: 1 }
  }]);
  assert({
    point: [{ x: 1, y: 1, type: 'point' }],
    segment: []
  }, [{ x: 1, y: 1, type: 'point' }]);
  assert({
    point: [{ x: 1, y: 1, type: 'point' }],
    segment: [{ type: 'segment', from: { x: 1, y: 1 }, to: { x: 1, y: 1 } }]
  }, [{ x: 1, y: 1, type: 'point' }, { type: 'segment', from: { x: 1, y: 1 }, to: { x: 1, y: 1 } }]);

  const assertInvalidMarks = (marks) => {
    it(`return empty array if marks are ${JSON.stringify(marks)}`, () => {
      const result = unMapMarks(undefined);

      expect(result).toEqual([]);
    });
  };

  assertInvalidMarks(undefined);
  assertInvalidMarks(null);
  assertInvalidMarks({});
});

describe('dichotomous', () => {
  const assert = (answers, correctedMarks, expected) => {
    it('returns correct values', () => {
      const result = dichotomous(answers, correctedMarks);

      expect(result).toEqual(expected);
    });
  };

  const answers = {
    a1: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ],
    },
    a2: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { x: 3, y: 3, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ],
    }
  };

  assert(
    answers,
    {
      a1: {
        point: [{ x: 1, y: 1, correctness: 'correct' }, { x: 2, y: 2, correctness: 'correct' }],
        segment: [{ from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }]
      },
      a2: {
        point: [{ x: 1, y: 1, correctness: 'correct' }, { x: 2, y: 2, correctness: 'correct' }, {
          x: 3,
          y: 3,
          correctness: 'incorrect'
        }],
        segment: [{ from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }]
      }
    },
    {
      correctMarks: [{ x: 1, y: 1, correctness: 'correct' }, { x: 2, y: 2, correctness: 'correct' }, {
        from: {
          x: 1,
          y: 1
        }, to: { x: 2, y: 2 }, correctness: 'correct'
      }],
      score: 1
    });
  assert(
    answers,
    {
      a1: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          { x: 3, y: 3, correctness: 'incorrect' }],
        segment: [{ from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }]
      },
      a2: {
        point: [],
        segment: []
      }
    },
    {
      correctMarks: [
        { x: 1, y: 1, correctness: 'correct' },
        { x: 2, y: 2, correctness: 'correct' },
        { x: 3, y: 3, correctness: 'incorrect' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
      ],
      score: 0
    });
  assert(
    answers,
    {
      a1: {
        point: [],
        segment: []
      },
      a2: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          { x: 3, y: 3, correctness: 'incorrect' }],
        segment: [{ from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }]
      },
    },
    {
      correctMarks: [],
      score: 0
    });

  const assertInvalidAnswers = (answers) => {
    it(`${JSON.stringify(answers)} answers`, () => {
      const result = dichotomous(answers, {
        correctAnswer: {
          point: [{ type: 'point', x: 0, y: 0 }],
          segment: [{ type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
          line: [],
          ray: [{ type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }],
          vector: [],
          polygon: [],
          circle: [],
          sine: [],
          parabola: []
        },
        alternate1: {
          point: [{ type: 'point', x: 0, y: 0 }],
          segment: [{ type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
          line: [],
          ray: [{ type: 'ray', from: { x: 0, y: 0 }, to: { x: 2, y: 20 } }],
          vector: [],
          polygon: [],
          circle: [],
          sine: [],
          parabola: []
        }
      });

      expect(result).toEqual({
        correctMarks: [
          { type: 'point', x: 0, y: 0 },
          { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
          { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }],
        score: 0
      })
    });
  };

  assertInvalidAnswers(undefined);
  assertInvalidAnswers(null);
  assertInvalidAnswers({});


  const assertInvalidMarksWithCorrectnessValues = (marks) => {
    it(`${JSON.stringify(marks)} correctedMarks`, () => {
      const result = dichotomous({
        correctAnswer: {
          marks: [
            { type: 'point', x: 0, y: 0 },
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
            { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
            ],
          name: 'Correct Answer'
        },
        alternateAnswer1: {
          marks: [
            { type: 'point', x: 0, y: 0 },
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
            { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
          ],
          name: 'Alternate Answer 1'
        }
      }, marks);


      expect(result).toEqual({
        correctMarks: [],
        score: 0
      })
    });
  };

  assertInvalidMarksWithCorrectnessValues(undefined);
  assertInvalidMarksWithCorrectnessValues(null);
  assertInvalidMarksWithCorrectnessValues({});
});

describe('partial', () => {
  const assert = (answers, correctedMarks, expected) => {
    it('returns correct values', () => {
      const result = partial(answers, correctedMarks);

      expect(result).toEqual(expected);
    });
  };

  const answers = {
    a1: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ],
    },
    a2: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { x: 3, y: 3, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ],
    }
  };

  assert(
    answers,
    {
      a1: {
        point: [{ x: 1, y: 1, correctness: 'correct' }, { x: 2, y: 2, correctness: 'correct' }],
        segment: [{ from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }]
      },
      a2: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          { x: 3, y: 3, correctness: 'incorrect' }],
        segment: [{ from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }]
      }
    },
    {
      correctMarks: [
        { x: 1, y: 1, correctness: 'correct' },
        { x: 2, y: 2, correctness: 'correct' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }],
      score: 1
    });

  assert(
    answers,
    {
      a1: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          { x: 3, y: 3, correctness: 'incorrect' }],
        segment: [{ from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }]
      },
      a2: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          { x: 3, y: 3, correctness: 'correct' }],
        segment: [{ from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }]
      }
    },
    {
      correctMarks: [
        { x: 1, y: 1, correctness: 'correct' },
        { x: 2, y: 2, correctness: 'correct' },
        { x: 3, y: 3, correctness: 'correct' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
      ],
      score: 1
    });

  assert(
    answers,
    {
      a1: {
        point: [
          { x: 0, y: 0, correctness: 'incorrect' },
          { x: 4, y: 4, correctness: 'incorrect' },
          { x: 3, y: 3, correctness: 'incorrect' }],
        segment: [{ from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }]
      },
      a2: {
        point: [
          { x: 1, y: 1, correctness: 'correct' },
          { x: 2, y: 2, correctness: 'correct' },
          { x: 4, y: 4, correctness: 'incorrect' }],
        segment: [{ from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }]
      }
    },
    {
      correctMarks: [
        { x: 1, y: 1, correctness: 'correct' },
        { x: 2, y: 2, correctness: 'correct' },
        { x: 4, y: 4, correctness: 'incorrect' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, correctness: 'correct' }
      ],
      score: 0.75
    });

  const assertInvalidAnswers = (answers) => {
    it(`${JSON.stringify(answers)} answers`, () => {
      const result = partial(answers, {
        correctAnswer: {
          point: [{ type: 'point', x: 0, y: 0 }],
          segment: [{ type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
          line: [],
          ray: [{ type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }],
          vector: [],
          polygon: [],
          circle: [],
          sine: [],
          parabola: []
        },
        alternate1: {
          point: [{ type: 'point', x: 0, y: 0 }],
          segment: [{ type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
          line: [],
          ray: [{ type: 'ray', from: { x: 0, y: 0 }, to: { x: 2, y: 20 } }],
          vector: [],
          polygon: [],
          circle: [],
          sine: [],
          parabola: []
        }
      });

      expect(result).toEqual({
        correctMarks: [
          { type: 'point', x: 0, y: 0 },
          { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
          { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }],
        score: 0
      })
    });
  };

  assertInvalidAnswers(undefined);
  assertInvalidAnswers(null);
  assertInvalidAnswers({});


  const assertInvalidMarksWithCorrectnessValues = (marks) => {
    it(`${JSON.stringify(marks)} correctedMarks`, () => {
      const result = partial({
        correctAnswer: {
          marks: [
            { type: 'point', x: 0, y: 0 },
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
            { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
          ],
          name: 'Correct Answer'
        },
        alternateAnswer1: {
          marks: [
            { type: 'point', x: 0, y: 0 },
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
            { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
          ],
          name: 'Alternate Answer 1'
        }
      }, marks);


      expect(result).toEqual({
        correctMarks: [],
        score: 0
      })
    });
  };

  assertInvalidMarksWithCorrectnessValues(undefined);
  assertInvalidMarksWithCorrectnessValues(null);
  assertInvalidMarksWithCorrectnessValues({});

  it('correctedMarks has invalid format', () => {
    const result = partial({
      correctAnswer: {
        marks: [
          { type: 'point', x: 0, y: 0 },
          { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
          { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
        ],
        name: 'Correct Answer'
      },
      alternateAnswer1: {
        marks: [
          { type: 'point', x: 0, y: 0 },
          { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
          { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
        ],
        name: 'Alternate Answer 1'
      }
    }, {
      correctAnswer: {
        point: [{ type: 'point', x: 0, y: 0 }],
        segment: [{ type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }],
        line: [],
        ray: [{ type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }],
        vector: [],
        polygon: [],
        circle: [],
        sine: [],
        parabola: []
      },
    });


    expect(result).toEqual({
      correctMarks: [
        { type: 'point', x: 0, y: 0 },
        { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
        { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
      ],
      score: 1
    })
  });

  const assertMarksSetInvalidFormat = (set) => {
    it(`correctedMarks correctAnswer has invalid format: ${JSON.stringify(set)}`, () => {
      const result = partial({
        correctAnswer: {
          marks: [
            { type: 'point', x: 0, y: 0 },
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
            { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
          ],
          name: 'Correct Answer'
        },
        alternateAnswer1: {
          marks: [
            { type: 'point', x: 0, y: 0 },
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
            { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
          ],
          name: 'Alternate Answer 1'
        }
      }, {
        correctAnswer: set,
      });


      expect(result).toEqual({
        correctMarks: [],
        score: 0
      })
    });
  };

  assertMarksSetInvalidFormat(undefined);
  assertMarksSetInvalidFormat(null);
  assertMarksSetInvalidFormat({});

  const assertMarksSetPropertyInvalidFormat = (set) => {
    it(`correctedMarks correctAnswer property has invalid format: ${JSON.stringify(set)}`, () => {
      const result = partial({
        correctAnswer: {
          marks: [
            { type: 'point', x: 0, y: 0 },
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
            { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
          ],
          name: 'Correct Answer'
        },
        alternateAnswer1: {
          marks: [
            { type: 'point', x: 0, y: 0 },
            { type: 'segment', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
            { type: 'ray', from: { x: 0, y: 0 }, to: { x: 1, y: 10 } }
          ],
          name: 'Alternate Answer 1'
        }
      }, {
        correctAnswer: {
          point: set
        },
      });


      expect(result).toEqual({
        correctMarks: [],
        score: 0
      })
    });
  };

  assertMarksSetPropertyInvalidFormat(undefined);
  assertMarksSetPropertyInvalidFormat(null);
  assertMarksSetPropertyInvalidFormat({});
});

describe('getScore', () => {
  const assert = (question, session, expected) => {
    it('returns correct values', () => {
      const result = getScore(question, session);

      expect(result).toEqual(expected);
    });
  };
  const assertSessionNotSet = (question, session) => {
    it(`returns score: 0 if session is ${JSON.stringify(session)}`, () => {
      const result = getScore(question, session);

      expect(result.score).toEqual(0);
    });
  };

  const answers = {
    a1: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ],
    },
    a2: {
      marks: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { x: 3, y: 3, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ],
    }
  };
  const question = { answers };

  assertSessionNotSet(question, undefined);
  assertSessionNotSet(question, null);
  assertSessionNotSet(question, {});

  assert(
    { ...question, scoringType: 'dichotomous' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    {
      correctMarks: [
        { x: 1, y: 1, type: 'point', correctness: 'correct' },
        { x: 2, y: 2, type: 'point', correctness: 'correct' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment', correctness: 'correct' }
      ],
      score: 1
    }
  );
  assert(
    { ...question, scoringType: 'partial' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    {
      correctMarks: [
        { x: 1, y: 1, type: 'point', correctness: 'correct' },
        { x: 2, y: 2, type: 'point', correctness: 'correct' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment', correctness: 'correct' }
      ],
      score: 1
    }
  );


  assert(
    { ...question, scoringType: 'dichotomous' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { x: 3, y: 3, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    {
      correctMarks: [
        { x: 1, y: 1, type: 'point', correctness: 'correct' },
        { x: 2, y: 2, type: 'point', correctness: 'correct' },
        { x: 3, y: 3, type: 'point', correctness: 'correct' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment', correctness: 'correct' }
      ],
      score: 1
    }
  );
  assert(
    { ...question, scoringType: 'partial' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 2, y: 2, type: 'point' },
        { x: 3, y: 3, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    {
      correctMarks: [
        { x: 1, y: 1, type: 'point', correctness: 'correct' },
        { x: 2, y: 2, type: 'point', correctness: 'correct' },
        { x: 3, y: 3, type: 'point', correctness: 'correct' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment', correctness: 'correct' }
      ],
      score: 1
    }
  );


  assert(
    { ...question, scoringType: 'dichotomous' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 4, y: 4, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    {
      correctMarks: [
        { x: 1, y: 1, type: 'point', correctness: 'correct' },
        { x: 4, y: 4, type: 'point', correctness: 'incorrect' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment', correctness: 'correct' }
      ],
      score: 0
    }
  );
  assert(
    { ...question, scoringType: 'partial' },
    {
      answer: [
        { x: 1, y: 1, type: 'point' },
        { x: 4, y: 4, type: 'point' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment' }
      ]
    },
    {
      correctMarks: [
        { x: 1, y: 1, type: 'point', correctness: 'correct' },
        { x: 4, y: 4, type: 'point', correctness: 'incorrect' },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, type: 'segment', correctness: 'correct' }
      ],
      score: 0.67
    }
  );


  const assertInvalidQuestionAnswers = answers => {
    it(`question.answers = ${JSON.stringify(answers)}`, () => {
      const result = getScore({ answers }, {});

      expect(result).toEqual({});
    });
  };

  assertInvalidQuestionAnswers(undefined);
  assertInvalidQuestionAnswers(null);
  assertInvalidQuestionAnswers({});

  const assertInvalidQuestion = question => {
    it(`question = ${JSON.stringify(question)}`, () => {
      const result = getScore(question, {});

      expect(result).toEqual({});
    });
  };

  assertInvalidQuestion(undefined);
  assertInvalidQuestion(null);
  assertInvalidQuestion({});

  const assertInvalidFormatQuestionAnswers = answers => {
    it(`question.answers = ${JSON.stringify(answers)}`, () => {
      const result = getScore({ answers }, {});

      expect(result).toEqual({
        correctMarks: [],
        score: 0
      });
    });
  };

  assertInvalidFormatQuestionAnswers({
    correctAnswer: undefined
  });

});

describe('outcome', () => {
  const assertOutcome = session => {
    it(`returns score: 0 and empty: true if session is ${JSON.stringify(session)}`, async () => {
      const o = await outcome({}, session, { mode: 'evaluate ' });

      expect(o).toEqual({ score: 0, empty: true });
    });
  };

  assertOutcome(undefined);
  assertOutcome(null);
  assertOutcome({});
});

describe('createCorrectResponseSession', () => {
  const question = {
    toolbarTools: [
      'point',
      'circle',
      'polygon',
      'segment',
      'ray',
      'vector',
      'line',
      'sine',
      'parabola',
      'label'
    ],
    answers: {
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
      }
    },
    backgroundMarks: [],
    prompt: 'Here goes item stem!',
    rationale: 'Rationale goes here!',
    scoringType: 'partial scoring',
  };

  it('returns correct response if role is instructor and mode is gather', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'gather',
      role: 'instructor'
    });

    expect(sess).toEqual({
      answer: [
        {
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
        }
      ],
      id: '1'
    });
  });

  it('returns correct response if role is instructor and mode is view', async () => {
    const sess = await createCorrectResponseSession(question, {
      mode: 'view',
      role: 'instructor'
    });

    expect(sess).toEqual({
      answer: [
        {
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
        }
      ],
      id: '1'
    });
  });

  it('returns null if mode is evaluate', async () => {
    const noResult = await createCorrectResponseSession(question, { mode: 'evaluate', role: 'instructor' });

    expect(noResult).toBeNull();
  });

  it('returns null if role is student', async () => {
    const noResult = await createCorrectResponseSession(question, { mode: 'gather', role: 'student' });

    expect(noResult).toBeNull();
  });
});
