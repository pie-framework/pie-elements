import { getCorrectness, model } from '../index';

const token = (start, end, text, correct) => ({ start, end, text, correct });

describe('getCorrectness', () => {
  const assert = (tokens, selected, expected) => {
    //set tokens to be correct if not set
    tokens = tokens.map(
      t => (t.correct !== undefined ? t : { ...t, correct: true })
    );

    it(`${tokens}, ${selected} => ${expected}`, () => {
      const c = getCorrectness(tokens, selected);
      expect(c).toEqual(expected);
    });
  };
  assert([token(0, 1, 'a')], [token(0, 1, 'a')], 'correct');
  assert(
    [token(0, 1, 'a'), token(1, 2, 'b', false)],
    [token(1, 2, 'b')],
    'incorrect'
  );
  assert([token(0, 1, 'a')], [], 'incorrect');
  assert([token(0, 1, 'a')], [token(1, 2, 'b')], 'incorrect');
  assert(
    [token(0, 1, 'a'), token(1, 2, 'b')],
    [token(0, 1, 'a')],
    'partially-correct'
  );
  assert(
    [token(0, 1, 'a'), token(1, 2, 'b')],
    [token(1, 2, 'b')],
    'partially-correct'
  );
});
