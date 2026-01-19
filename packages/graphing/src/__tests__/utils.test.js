import { completeMark } from '../utils';

describe('utils', () => {
  describe('completeMark.point', () => {
    it('returns true for valid point with finite coordinates', () => {
      const point = { x: 5, y: 10 };
      expect(completeMark.point(point)).toBe(true);
    });

    it('returns true for point with negative coordinates', () => {
      const point = { x: -5, y: -10 };
      expect(completeMark.point(point)).toBe(true);
    });

    it('returns true for point with zero coordinates', () => {
      const point = { x: 0, y: 0 };
      expect(completeMark.point(point)).toBe(true);
    });

    it('returns false for null point', () => {
      expect(completeMark.point(null)).toBeFalsy();
    });

    it('returns false for undefined point', () => {
      expect(completeMark.point(undefined)).toBeFalsy();
    });

    it('returns false for point with NaN x coordinate', () => {
      const point = { x: NaN, y: 10 };
      expect(completeMark.point(point)).toBe(false);
    });

    it('returns false for point with NaN y coordinate', () => {
      const point = { x: 5, y: NaN };
      expect(completeMark.point(point)).toBe(false);
    });

    it('returns false for point with Infinity x coordinate', () => {
      const point = { x: Infinity, y: 10 };
      expect(completeMark.point(point)).toBe(false);
    });

    it('returns false for point with missing x coordinate', () => {
      const point = { y: 10 };
      expect(completeMark.point(point)).toBe(false);
    });

    it('returns false for point with missing y coordinate', () => {
      const point = { x: 5 };
      expect(completeMark.point(point)).toBe(false);
    });
  });

  describe('completeMark.line', () => {
    it('returns true for valid line with complete from and to points', () => {
      const line = {
        from: { x: 0, y: 0 },
        to: { x: 5, y: 5 },
      };
      expect(completeMark.line(line)).toBe(true);
    });

    it('returns false for line with incomplete from point', () => {
      const line = {
        from: { x: NaN, y: 0 },
        to: { x: 5, y: 5 },
      };
      expect(completeMark.line(line)).toBe(false);
    });

    it('returns false for line with incomplete to point', () => {
      const line = {
        from: { x: 0, y: 0 },
        to: { x: 5, y: NaN },
      };
      expect(completeMark.line(line)).toBe(false);
    });

    it('returns false for line with missing from point', () => {
      const line = {
        to: { x: 5, y: 5 },
      };
      expect(completeMark.line(line)).toBeFalsy();
    });

    it('returns false for line with missing to point', () => {
      const line = {
        from: { x: 0, y: 0 },
      };
      expect(completeMark.line(line)).toBeFalsy();
    });

    it('returns false for null line', () => {
      expect(completeMark.line(null)).toBeFalsy();
    });
  });

  describe('completeMark.ray', () => {
    it('returns true for valid ray with complete from and to points', () => {
      const ray = {
        from: { x: 1, y: 1 },
        to: { x: 10, y: 10 },
      };
      expect(completeMark.ray(ray)).toBe(true);
    });

    it('returns false for ray with incomplete points', () => {
      const ray = {
        from: { x: 1, y: Infinity },
        to: { x: 10, y: 10 },
      };
      expect(completeMark.ray(ray)).toBe(false);
    });
  });

  describe('completeMark.segment', () => {
    it('returns true for valid segment with complete from and to points', () => {
      const segment = {
        from: { x: 2, y: 3 },
        to: { x: 8, y: 9 },
      };
      expect(completeMark.segment(segment)).toBe(true);
    });

    it('returns false for segment with incomplete points', () => {
      const segment = {
        from: { x: 2, y: 3 },
        to: { x: 8 },
      };
      expect(completeMark.segment(segment)).toBe(false);
    });
  });

  describe('completeMark.vector', () => {
    it('returns true for valid vector with complete from and to points', () => {
      const vector = {
        from: { x: 0, y: 0 },
        to: { x: 3, y: 4 },
      };
      expect(completeMark.vector(vector)).toBe(true);
    });

    it('returns false for vector with incomplete points', () => {
      const vector = {
        from: { x: 0, y: 0 },
        to: { y: 4 },
      };
      expect(completeMark.vector(vector)).toBe(false);
    });
  });

  describe('completeMark.circle', () => {
    it('returns true for valid circle with complete root and edge points', () => {
      const circle = {
        root: { x: 5, y: 5 },
        edge: { x: 8, y: 5 },
      };
      expect(completeMark.circle(circle)).toBe(true);
    });

    it('returns false for circle with incomplete root point', () => {
      const circle = {
        root: { x: 5 },
        edge: { x: 8, y: 5 },
      };
      expect(completeMark.circle(circle)).toBe(false);
    });

    it('returns false for circle with incomplete edge point', () => {
      const circle = {
        root: { x: 5, y: 5 },
        edge: { x: NaN, y: 5 },
      };
      expect(completeMark.circle(circle)).toBe(false);
    });

    it('returns false for circle with missing root', () => {
      const circle = {
        edge: { x: 8, y: 5 },
      };
      expect(completeMark.circle(circle)).toBeFalsy();
    });

    it('returns false for null circle', () => {
      expect(completeMark.circle(null)).toBeFalsy();
    });
  });

  describe('completeMark.parabola', () => {
    it('returns true for valid parabola with complete root and edge points', () => {
      const parabola = {
        root: { x: 0, y: 0 },
        edge: { x: 2, y: 4 },
      };
      expect(completeMark.parabola(parabola)).toBe(true);
    });

    it('returns false for parabola with incomplete points', () => {
      const parabola = {
        root: { x: 0, y: 0 },
        edge: { x: 2 },
      };
      expect(completeMark.parabola(parabola)).toBe(false);
    });
  });

  describe('completeMark.sine', () => {
    it('returns true for valid sine with complete root and edge points', () => {
      const sine = {
        root: { x: 0, y: 0 },
        edge: { x: 1, y: 1 },
      };
      expect(completeMark.sine(sine)).toBe(true);
    });

    it('returns false for sine with incomplete points', () => {
      const sine = {
        root: { x: 0, y: NaN },
        edge: { x: 1, y: 1 },
      };
      expect(completeMark.sine(sine)).toBe(false);
    });
  });

  describe('completeMark.absolute', () => {
    it('returns true for valid absolute with complete root and edge points', () => {
      const absolute = {
        root: { x: 0, y: 0 },
        edge: { x: 2, y: 2 },
      };
      expect(completeMark.absolute(absolute)).toBe(true);
    });

    it('returns false for absolute with incomplete points', () => {
      const absolute = {
        root: { x: 0, y: 0 },
        edge: { x: Infinity, y: 2 },
      };
      expect(completeMark.absolute(absolute)).toBe(false);
    });
  });

  describe('completeMark.exponential', () => {
    it('returns true for valid exponential with complete root and edge points', () => {
      const exponential = {
        root: { x: 0, y: 1 },
        edge: { x: 1, y: 2.718 },
      };
      expect(completeMark.exponential(exponential)).toBe(true);
    });

    it('returns false for exponential with incomplete points', () => {
      const exponential = {
        root: { x: 0, y: 1 },
        edge: { y: 2.718 },
      };
      expect(completeMark.exponential(exponential)).toBe(false);
    });
  });

  describe('completeMark.polygon', () => {
    it('returns true for valid polygon with all complete points', () => {
      const polygon = {
        points: [
          { x: 0, y: 0 },
          { x: 5, y: 0 },
          { x: 5, y: 5 },
          { x: 0, y: 5 },
        ],
      };
      expect(completeMark.polygon(polygon)).toBe(true);
    });

    it('returns true for triangle with complete points', () => {
      const triangle = {
        points: [
          { x: 0, y: 0 },
          { x: 3, y: 4 },
          { x: 6, y: 0 },
        ],
      };
      expect(completeMark.polygon(triangle)).toBe(true);
    });

    it('returns false for polygon with one incomplete point', () => {
      const polygon = {
        points: [
          { x: 0, y: 0 },
          { x: 5, y: 0 },
          { x: 5, y: NaN },
          { x: 0, y: 5 },
        ],
      };
      expect(completeMark.polygon(polygon)).toBe(false);
    });

    it('returns false for polygon with missing points array', () => {
      const polygon = {};
      expect(completeMark.polygon(polygon)).toBeFalsy();
    });

    it('returns false for polygon with empty points array', () => {
      const polygon = {
        points: [],
      };
      expect(completeMark.polygon(polygon)).toBeFalsy();
    });

    it('returns false for polygon with null points', () => {
      const polygon = {
        points: null,
      };
      expect(completeMark.polygon(polygon)).toBeFalsy();
    });

    it('returns false for null polygon', () => {
      expect(completeMark.polygon(null)).toBeFalsy();
    });

    it('returns false for polygon with mix of complete and incomplete points', () => {
      const polygon = {
        points: [
          { x: 0, y: 0 },
          { x: 5, y: 0 },
          { x: Infinity, y: 5 },
        ],
      };
      expect(completeMark.polygon(polygon)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles decimal coordinates correctly', () => {
      const point = { x: 3.14159, y: 2.71828 };
      expect(completeMark.point(point)).toBe(true);
    });

    it('handles very large finite numbers', () => {
      const point = { x: 1e10, y: 1e10 };
      expect(completeMark.point(point)).toBe(true);
    });

    it('handles very small finite numbers', () => {
      const point = { x: 1e-10, y: 1e-10 };
      expect(completeMark.point(point)).toBe(true);
    });

    it('rejects string coordinates', () => {
      const point = { x: '5', y: '10' };
      expect(completeMark.point(point)).toBe(false);
    });
  });
});
