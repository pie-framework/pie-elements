import {
  generateValidationMessage,
  normalizeIndex,
  updateResponseOrChoices,
  buildTiles,
} from '../utils';

describe('utils', () => {
  describe('generateValidationMessage', () => {
    it('should return a validation message string', () => {
      const message = generateValidationMessage();
      expect(typeof message).toBe('string');
    });

    it('should contain validation requirements heading', () => {
      const message = generateValidationMessage();
      expect(message).toContain('Validation requirements:');
    });

    it('should mention minimum token requirement', () => {
      const message = generateValidationMessage();
      expect(message).toContain('There should be at least 3 tokens.');
    });

    it('should mention tokens should not be empty', () => {
      const message = generateValidationMessage();
      expect(message).toContain('The tokens should not be empty and should be unique.');
    });

    it('should mention correct ordering requirement', () => {
      const message = generateValidationMessage();
      expect(message).toContain('The correct ordering should not be identical to the initial ordering.');
    });
  });

  describe('normalizeIndex', () => {
    const ordering = {
      response: [{ id: 'r1' }, { id: 'r2' }, { id: 'r3' }],
      choices: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }],
    };

    it('should return correct index for target type', () => {
      const tile = { id: 'r2', type: 'target' };
      const index = normalizeIndex(tile, ordering);
      expect(index).toBe(1);
    });

    it('should return correct index for choice type', () => {
      const tile = { id: 'c3', type: 'choice' };
      const index = normalizeIndex(tile, ordering);
      expect(index).toBe(2);
    });

    it('should return -1 for unknown type', () => {
      const tile = { id: 'x1', type: 'unknown' };
      const index = normalizeIndex(tile, ordering);
      expect(index).toBe(-1);
    });

    it('should return -1 when tile not found in response', () => {
      const tile = { id: 'r99', type: 'target' };
      const index = normalizeIndex(tile, ordering);
      expect(index).toBe(-1);
    });

    it('should return -1 when tile not found in choices', () => {
      const tile = { id: 'c99', type: 'choice' };
      const index = normalizeIndex(tile, ordering);
      expect(index).toBe(-1);
    });

    it('should return correct index for first element', () => {
      const tile = { id: 'r1', type: 'target' };
      const index = normalizeIndex(tile, ordering);
      expect(index).toBe(0);
    });
  });

  describe('updateResponseOrChoices', () => {
    describe('moving within response (target to target)', () => {
      it('should move item within response array', () => {
        const response = [{ id: 'r1' }, { id: 'r2' }, { id: 'r3' }];
        const choices = [{ id: 'c1' }, { id: 'c2' }];
        const from = { type: 'target', index: 0, id: 'r1' };
        const to = { type: 'target', index: 2, id: 'r3' };

        const result = updateResponseOrChoices(response, choices, from, to);

        expect(result.response).toEqual([{ id: 'r2' }, { id: 'r3' }, { id: 'r1' }]);
        expect(result.choices).toEqual(choices);
      });

      it('should move item to beginning of response', () => {
        const response = [{ id: 'r1' }, { id: 'r2' }, { id: 'r3' }];
        const choices = [{ id: 'c1' }];
        const from = { type: 'target', index: 2, id: 'r3' };
        const to = { type: 'target', index: 0, id: 'r1' };

        const result = updateResponseOrChoices(response, choices, from, to);

        expect(result.response).toEqual([{ id: 'r3' }, { id: 'r1' }, { id: 'r2' }]);
      });

      it('should move item to end of response', () => {
        const response = [{ id: 'r1' }, { id: 'r2' }, { id: 'r3' }];
        const choices = [{ id: 'c1' }];
        const from = { type: 'target', index: 0, id: 'r1' };
        const to = { type: 'target', index: 2, id: 'r3' };

        const result = updateResponseOrChoices(response, choices, from, to);

        expect(result.response[result.response.length - 1]).toEqual({ id: 'r1' });
      });
    });

    describe('moving within choices (choice to choice)', () => {
      it('should move item within choices array', () => {
        const response = [{ id: 'r1' }];
        const choices = [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }];
        const from = { type: 'choice', index: 0, id: 'c1' };
        const to = { type: 'choice', index: 2, id: 'c3' };

        const result = updateResponseOrChoices(response, choices, from, to);

        expect(result.choices).toEqual([{ id: 'c2' }, { id: 'c3' }, { id: 'c1' }]);
        expect(result.response).toEqual(response);
      });

      it('should handle moving to beginning of choices', () => {
        const response = [{ id: 'r1' }];
        const choices = [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }];
        const from = { type: 'choice', index: 2, id: 'c3' };
        const to = { type: 'choice', index: 0, id: 'c1' };

        const result = updateResponseOrChoices(response, choices, from, to);

        expect(result.choices[0]).toEqual({ id: 'c3' });
      });
    });

    describe('mixed type movements', () => {
      it('should return unchanged arrays when moving from choice to target', () => {
        const response = [{ id: 'r1' }];
        const choices = [{ id: 'c1' }];
        const from = { type: 'choice', index: 0, id: 'c1' };
        const to = { type: 'target', index: 0, id: 'r1' };

        const result = updateResponseOrChoices(response, choices, from, to);

        expect(result.response).toEqual(response);
        expect(result.choices).toEqual(choices);
      });

      it('should return unchanged arrays when moving from target to choice', () => {
        const response = [{ id: 'r1' }];
        const choices = [{ id: 'c1' }];
        const from = { type: 'target', index: 0, id: 'r1' };
        const to = { type: 'choice', index: 0, id: 'c1' };

        const result = updateResponseOrChoices(response, choices, from, to);

        expect(result.response).toEqual(response);
        expect(result.choices).toEqual(choices);
      });
    });

    describe('edge cases', () => {
      it('should handle single item arrays', () => {
        const response = [{ id: 'r1' }];
        const choices = [{ id: 'c1' }];
        const from = { type: 'target', index: 0, id: 'r1' };
        const to = { type: 'target', index: 0, id: 'r1' };

        const result = updateResponseOrChoices(response, choices, from, to);

        expect(result.response).toHaveLength(1);
      });
    });
  });

  describe('buildTiles', () => {
    it('should create tiles from choices and response', () => {
      const choices = [
        { id: 'c1', label: 'Choice 1' },
        { id: 'c2', label: 'Choice 2' },
      ];
      const response = [{ id: 'c1' }, { id: 'c2' }];

      const tiles = buildTiles(choices, response);

      expect(tiles).toHaveLength(4); // 2 choices + 2 targets
    });

    it('should mark choice tiles as editable and draggable', () => {
      const choices = [{ id: 'c1', label: 'Choice 1' }];
      const response = [{ id: 'c1' }];

      const tiles = buildTiles(choices, response);
      const choiceTile = tiles.find((t) => t.type === 'choice');

      expect(choiceTile).toMatchObject({
        type: 'choice',
        editable: true,
        draggable: true,
        droppable: false,
      });
    });

    it('should mark target tiles as draggable but not editable', () => {
      const choices = [{ id: 'c1', label: 'Choice 1' }];
      const response = [{ id: 'c1' }];

      const tiles = buildTiles(choices, response);
      const targetTile = tiles.find((t) => t.type === 'target');

      expect(targetTile).toMatchObject({
        type: 'target',
        editable: false,
        draggable: true,
      });
    });

    it('should match target tiles with corresponding choices by id', () => {
      const choices = [
        { id: 'c1', label: 'Choice 1' },
        { id: 'c2', label: 'Choice 2' },
      ];
      const response = [{ id: 'c2' }, { id: 'c1' }];

      const tiles = buildTiles(choices, response);
      const targetTiles = tiles.filter((t) => t.type === 'target');

      expect(targetTiles[0]).toMatchObject({
        id: 'c2',
        label: 'Choice 2',
      });
      expect(targetTiles[1]).toMatchObject({
        id: 'c1',
        label: 'Choice 1',
      });
    });

    it('should assign correct index to target tiles', () => {
      const choices = [{ id: 'c1', label: 'Choice 1' }];
      const response = [{ id: 'c1' }];

      const tiles = buildTiles(choices, response);
      const targetTile = tiles.find((t) => t.type === 'target');

      expect(targetTile.index).toBe(0);
    });

    it('should handle response with null or undefined ids', () => {
      const choices = [
        { id: 'c1', label: 'Choice 1' },
        { id: 'c2', label: 'Choice 2' },
      ];
      const response = [{ id: null }, { id: undefined }, { id: 'c1' }];

      const tiles = buildTiles(choices, response);
      const targetTiles = tiles.filter((t) => t.type === 'target');

      expect(targetTiles).toHaveLength(3);
      expect(targetTiles[2].id).toBe('c1');
    });

    it('should preserve choice properties in choice tiles', () => {
      const choices = [
        { id: 'c1', label: 'Choice 1', customProp: 'value' },
      ];
      const response = [];

      const tiles = buildTiles(choices, response);
      const choiceTile = tiles.find((t) => t.type === 'choice');

      expect(choiceTile.customProp).toBe('value');
      expect(choiceTile.label).toBe('Choice 1');
    });

    it('should preserve choice properties in target tiles', () => {
      const choices = [
        { id: 'c1', label: 'Choice 1', customProp: 'value' },
      ];
      const response = [{ id: 'c1' }];

      const tiles = buildTiles(choices, response);
      const targetTile = tiles.find((t) => t.type === 'target');

      expect(targetTile.customProp).toBe('value');
      expect(targetTile.label).toBe('Choice 1');
    });

    it('should handle empty choices array', () => {
      const choices = [];
      const response = [];

      const tiles = buildTiles(choices, response);

      expect(tiles).toEqual([]);
    });

    it('should handle empty response array', () => {
      const choices = [{ id: 'c1', label: 'Choice 1' }];
      const response = [];

      const tiles = buildTiles(choices, response);

      expect(tiles).toHaveLength(1);
      expect(tiles[0].type).toBe('choice');
    });

    it('should maintain order of choices in choice tiles', () => {
      const choices = [
        { id: 'c1', label: 'First' },
        { id: 'c2', label: 'Second' },
        { id: 'c3', label: 'Third' },
      ];
      const response = [];

      const tiles = buildTiles(choices, response);
      const choiceTiles = tiles.filter((t) => t.type === 'choice');

      expect(choiceTiles.map((t) => t.label)).toEqual(['First', 'Second', 'Third']);
    });

    it('should place choice tiles before target tiles', () => {
      const choices = [
        { id: 'c1', label: 'Choice 1' },
        { id: 'c2', label: 'Choice 2' },
      ];
      const response = [{ id: 'c1' }];

      const tiles = buildTiles(choices, response);

      expect(tiles[0].type).toBe('choice');
      expect(tiles[1].type).toBe('choice');
      expect(tiles[2].type).toBe('target');
    });
  });
});
