import { getAnswersCorrectness } from '../utils-correctness';

const rhomb = 'rhomb';
const trapeze = 'trapeze';
const hexagon = 'hexagon';

const answer1 = {
  containerIndex: 0 ,
  id: 1,
  value: rhomb
};
const answer2 = {
  containerIndex: 0 ,
  id: 2,
  value: rhomb
};
const answer3 = {
  containerIndex: 0 ,
  id: 3,
  value: trapeze
};

const answer4 = {
  containerIndex: 1 ,
  id: 4,
  value: hexagon,
};

describe('utils', () => {
  let validResponses;

  beforeEach(() => {
    validResponses = {
      validResponse: {
        value: [
          { images: [rhomb] },
          { images: [rhomb, trapeze] }
        ]
      }
    };
  });

  describe('correctness', () => {
    it('marks correct answers as correct', () => {
      const result = getAnswersCorrectness(
        [answer1, {
          ...answer3,
          containerIndex: 1
        }],
        validResponses
      );
      expect(result).toEqual([{
        ...answer1,
        isCorrect: true
      },{
        ...answer3,
        isCorrect: true,
        containerIndex: 1
      }]);
    });

    it('marks incorrect answers as incorrect', () => {
      const result = getAnswersCorrectness(
        [answer1, answer3],
        validResponses
      );
      expect(result).toEqual([{
        ...answer1,
        isCorrect: true
      },{
        ...answer3,
        isCorrect: false
      }]);
    });

    it('marks duplicates as incorrect', () => {
      const result = getAnswersCorrectness(
        [answer1, answer2],
        validResponses
      );
      expect(result).toEqual([{
        ...answer1,
        isCorrect: true
      },{
        ...answer2,
        isCorrect: false
      }]);
    });

    it('marks duplicates and incorrect as incorrect', () => {
      const result = getAnswersCorrectness(
        [answer1, answer2, answer3],
        validResponses
      );
      expect(result).toEqual([{
        ...answer1,
        isCorrect: true
      },{
        ...answer2,
        isCorrect: false
      },{
        ...answer3,
        isCorrect: false
      }]);
    });

    describe('alternate correct answers', () => {
      describe('handles one option', () => {
        it('marks correct answers as correct', () => {
          const result = getAnswersCorrectness(
            [answer1, answer4],
            {
              ...validResponses,
              altResponses: [{
                value: [
                  { images: [rhomb] },
                  { images: [hexagon] }
                ]
              }]
            }
          );
          expect(result).toEqual([{
            ...answer1,
            isCorrect: true
          },{
            ...answer4,
            isCorrect: true
          }]);
        });

        it('marks incorrect answers as incorrect', () => {
          const result = getAnswersCorrectness(
            [answer1, answer4],
            {
              ...validResponses,
              altResponses: [{
                value: [
                  { images: [hexagon] },
                  { images: [rhomb] },
                ]
              }]
            }
          );
          expect(result).toEqual([{
            ...answer1,
            isCorrect: false
          },{
            ...answer4,
            isCorrect: false
          }]);
        });
      });

      describe('handles multiple options', () => {
        it('marks correct answers as correct', () => {
          const result = getAnswersCorrectness(
            [answer1, answer4],
            {
              ...validResponses,
              altResponses: [{
                value: [
                  { images: [hexagon] },
                  { images: [rhomb] },
                ]
              }, {
                value: [
                  { images: [rhomb] },
                  { images: [hexagon] },
                ]
              }]
            }
          );
          expect(result).toEqual([{
            ...answer1,
            isCorrect: true
          },{
            ...answer4,
            isCorrect: true
          }]);
        });

        it('marks incorrect answers as incorrect', () => {
          const result = getAnswersCorrectness(
            [answer1, answer4],
            {
              ...validResponses,
              altResponses: [{
                value: [
                  { images: [hexagon] },
                  { images: [rhomb] },
                ]
              }, {
                value: [
                  { images: [hexagon] },
                  { images: [hexagon] },
                ]
              }]
            }
          );
          expect(result).toEqual([{
            ...answer1,
            isCorrect: false
          },{
            ...answer4,
            isCorrect: true
          }]);
        });
      });
    });
  });
});
