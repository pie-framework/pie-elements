import { buildCategories } from '../builder';

describe('builder', () => {
  describe('buildCategories', () => {
    let categories;
    let choices;
    let correctResponse;

    beforeEach(() => {
      categories = [{ id: '1' }];

      choices = [{ id: '1', content: 'content' }];

      correctResponse = [{ category: '1', choices: ['1'] }];
    });

    it('adds choices from the correct response', () => {
      const result = buildCategories(categories, choices, correctResponse);

      expect(result).toEqual([
        {
          id: '1',
          choices: [
            {
              id: '1',
              content: 'content'
            }
          ]
        }
      ]);
    });
  });
});
