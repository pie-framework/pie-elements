import { flattenCorrect, score, pairwiseCombinationScore } from '../scoring';
import _ from 'lodash';

describe('pairwiseCombinationScore', () => {
  const assertScore = correctResponse => (answer, expectedScore) => {
    it(`${expectedScore} for ${
      typeof answer === 'string' ? answer : JSON.stringify(answer)
    }`, () => {
      const c = correctResponse.split('');
      const a = typeof answer === 'string' ? answer.split('') : answer;
      const result = pairwiseCombinationScore(c, a);
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
    const assertAAB = assertScore('AAB');
    assertAAB('', 0);
    assertAAB('A', 0);
    assertAAB('AA', 0.33);
    assertAAB('AAC', 0.33);
    assertAAB('AAB', 1);
    assertAAB('BAA', 0.33);
    assertAAB('ABA', 0.67);
    assertAAB('ABAB', 0);
  });

  describe('correct response: ABC', () => {
    const assertABC = assertScore('ABC');
    assertABC('ABC', 1);
    assertABC('BCA', 0.33);
    assertABC('CAB', 0.33);
    assertABC('CBA', 0);
    assertABC('ACB', 0.67);
    assertABC('A', 0);
    assertABC('B', 0);
    assertABC('C', 0);
    assertABC('AB', 0.33);
    assertABC('BC', 0.33);
    assertABC('AC', 0.33);
    assertABC('CA', 0);
    assertABC('CB', 0);
    assertABC('BA', 0);
    assertABC('', 0);
    assertABC('ABCD', 0);
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
    assertABCD('AB', 0.17);
  });
});

const correctResponse = ['c1', 'c2', 'c3', 'c4'];
describe('score', () => {
  let baseQuestion = {
    correctResponse: correctResponse
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
    assertScore([], 0);
    assertScore(['c1'], 0);
    assertScore(['c1', 'c2'], 0.17);
    assertScore(['c1', 'c2', 'c3'], 0.5);
    assertScore(['c1', 'c2', 'c3', 'c4'], 1);
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
