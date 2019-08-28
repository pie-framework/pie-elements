import {
  flattenCorrect,
  score,
  pairwiseCombinationScore,
  illegalArgumentError
} from '../scoring';
import _ from 'lodash';

describe('pairwiseCombinationScore', () => {
  const assertScore = (correctResponse, opts) => (answer, expectedScore) => {
    it(`${expectedScore} for ${
      typeof answer === 'string' ? answer : JSON.stringify(answer)
    }`, () => {
      const c = correctResponse.split('');
      const a = typeof answer === 'string' ? answer.split('') : answer;
      const result = pairwiseCombinationScore(c, a, opts);
      expect(result).toEqual(expectedScore);
    });
  };

  describe('correct response: A', () => {
    const assertA = assertScore('A');
    assertA('A', 1);
    assertA('B', 0);
    assertA('C', 0);
    assertA({ foo: true }, 0);
    assertA([{ foo: true }, { bar: true }], 0);
    assertA('', 0);
  });

  describe('correct response: AB', () => {
    const assertAB = assertScore('AB');
    assertAB('A', 0);
    assertAB('B', 0);
    assertAB('C', 0);
    assertAB('', 0);
    assertAB('AB', 1);
    assertAB('BA', 0);
    assertAB('AC', 0);
  });

  describe('correct response: AAB', () => {
    it('throws an error because of duplicate in answer', () => {
      expect(() => pairwiseCombinationScore(['A', 'A'], ['A', 'A'])).toThrow(
        illegalArgumentError(['A', 'A'])
      );
    });
  });

  describe('correct response: ABC', () => {
    const assertABC = assertScore('ABC');
    assertABC('', 0);
    assertABC('A', 0);
    assertABC('AA', 0);
    assertABC('AB', 0.33);
    assertABC('AC', 0.33);
    assertABC('AAC', 0);
    assertABC('AAB', 0);
    assertABC('BAA', 0);
    assertABC('ABA', 0);
    assertABC('ABAB', 0);
    assertABC('ABC', 1);
    assertABC('ABC', 1);
    assertABC('BCA', 0.33);
    assertABC('CAB', 0.33);
    assertABC('CBA', 0);
    assertABC('ACB', 0.67);
    assertABC('B', 0);
    assertABC('C', 0);
    assertABC('AB', 0.33);
    assertABC('BC', 0.33);
    assertABC('AC', 0.33);
    assertABC('CA', 0);
    assertABC('CB', 0);
    assertABC('BA', 0);
    assertABC('ABCD', 0);
  });

  describe('correct response: ABCD - order must be complete', () => {
    const assertABCD = assertScore('ABCD', { orderMustBeComplete: true });
    assertABCD('ABC', 0);
    assertABCD('BCD', 0);
  });

  describe('correct response: ABCD', () => {
    const assertABCD = assertScore('ABCD');
    assertABCD('ABCD', 1);
    assertABCD('ABDC', 0.83);
    assertABCD('ABC', 0.5);
    assertABCD('CDAB', 0.33);
    assertABCD('CDBA', 0.17);
    assertABCD('DCBA', 0);
    assertABCD('DCAB', 0.17);
    assertABCD('ABAB', 0);
    assertABCD('AB', 0.17);
  });

  describe('custom override - allowDuplicates: true, orderMustBeComplete: false', () => {
    describe('correct response: AAB - dups, order incomplete', () => {
      const assertAAB = assertScore('AAB', {
        allowDuplicates: true
      });
      assertAAB('', 0);
      assertAAB('A', 0);
      assertAAB('AA', 0.33);
      assertAAB('AAC', 0.33);
      assertAAB('AAB', 1);
      assertAAB('BAA', 0.33);
      assertAAB('ABA', 0.67);
      assertAAB('ABAB', 0);
    });
  });
});

const correctResponse = ['c1', 'c2', 'c3', 'c4'];
const alternateResponses = [['c4', 'c3', 'c2', 'c1']];

describe('score', () => {
  let baseQuestion = {
    correctResponse: correctResponse,
    alternateResponses: alternateResponses
  };

  describe('partial scoring', () => {
    let question = _.merge(_.cloneDeep(baseQuestion), {
      partialScoring: true
    });

    const assertScore = (value, expectedScore) => {
      it(`${expectedScore} for: ${value}`, () => {
        const result = score(question, { value });

        expect(result).toEqual(expectedScore);
      });
    };

    const assertScoreSessionNotSet = (session) => {
      it(`returns 0 if session is: ${JSON.stringify(session)}`, () => {
        const result = score(question, session);

        expect(result).toEqual(0);
      });
    };

    assertScoreSessionNotSet(undefined);
    assertScoreSessionNotSet(null);
    assertScoreSessionNotSet({});

    // Main Correct Responses
    assertScore([], 0);
    assertScore(['c1'], 0);
    assertScore(['c1', 'c2'], 0.17);
    assertScore(['c1', 'c2', 'c3'], 0.5);
    assertScore(['c1', 'c2', 'c3', 'c4'], 1);

    // Alternate Correct Responses
    assertScore([], 0);
    assertScore(['c4'], 0);
    assertScore(['c4', 'c3'], 0.17);
    assertScore(['c4', 'c3', 'c2'], 0.5);
    assertScore(['c4', 'c3', 'c2', 'c1'], 1);
  });

});
describe('flattenCorrect', () => {
  describe('correctResponse is an array of identifiers', () => {
    let question = {
      correctResponse: correctResponse.map(v => ({ id: v }))
    };

    it('returns correctResponse field value', () => {
      expect(flattenCorrect(question)).toEqual(correctResponse);
    });
  });
});
