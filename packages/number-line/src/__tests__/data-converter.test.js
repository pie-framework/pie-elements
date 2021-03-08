import * as converter from '../data-converter';

describe('data-converter', () => {
  describe('switchGraphLine', () => {
    it('does not switch if not needed', () => {
      const line = {
        type: 'line',
        leftPoint: 'empty',
        rightPoint: 'full',
        position: {
          left: -2,
          right: -1
        }
      };

      const result = converter.switchGraphLine(line);
      expect(result).toEqual(line);
    });

    it('switches', () => {
      const line = {
        type: 'line',
        leftPoint: 'empty',
        rightPoint: 'full',
        position: {
          left: 0,
          right: -1
        }
      };

      const result = converter.switchGraphLine(line);
      expect(result).toEqual({
        type: 'line',
        leftPoint: 'full',
        rightPoint: 'empty',
        position: {
          left: -1,
          right: 0
        }
      });
    });
  });

  describe('format', () => {
    const graph = {
      point: {
        position: 1,
        type: 'point',
        pointType: 'full'
      },
      ray: {
        position: 1,
        direction: 'positive',
        pointType: 'full',
        type: 'ray'
      },
      line: {
        type: 'line',
        leftPoint: 'full',
        rightPoint: 'empty',
        position: {
          left: 0,
          right: 1
        }
      }
    };

    const session = {
      line: {
        type: 'line',
        leftPoint: 'full',
        rightPoint: 'empty',
        domainPosition: 0,
        size: 1
      },
      point: {
        type: 'point',
        domainPosition: 1,
        pointType: 'full'
      },
      ray: {
        type: 'ray',
        domainPosition: 1,
        direction: 'positive',
        pointType: 'full'
      }
    };

    describe('toSessionFormat', () => {
      let toSessionFormat;

      beforeEach(() => {
        toSessionFormat = converter.toSessionFormat;
      });

      it('converts line', () => {
        expect(toSessionFormat(graph.line)).toEqual(session.line);
      });

      it('converts point', () => {
        expect(toSessionFormat(graph.point)).toEqual(session.point);
      });

      it('converts ray', () => {
        expect(toSessionFormat(graph.ray)).toEqual(session.ray);
      });
    });

    describe('toGraphFormat', () => {
      let toGraphFormat;

      beforeEach(() => {
        toGraphFormat = converter.toGraphFormat;
      });

      it('converts line', () => {
        expect(toGraphFormat(session.line)).toEqual(graph.line);
      });

      it('converts point', () => {
        expect(toGraphFormat(session.point)).toEqual(graph.point);
      });

      it('converts ray', () => {
        expect(toGraphFormat(session.ray)).toEqual(graph.ray);
      });
    });
  });
});
