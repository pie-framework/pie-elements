import { model, outcome, scoreFromRule, partialScoring } from '../index';
import { isResponseCorrect } from '../utils';

jest.mock('../utils', () => ({
  isResponseCorrect: jest.fn()
}));

describe('controller', () => {
  let result, question, session, env;

  beforeEach(() => {
    question = {
      id: "1",
      element: "inline-dropdown",
      disabled: false,
      markup: "<div>\n  <img src=\"https://image.shutterstock.com/image-vector/cow-jumped-over-moon-traditional-260nw-1152899330.jpg\"></img>\n   <h5>Hey Diddle Diddle <i>by ?</i></h5>\n <p>1: Hey, diddle, diddle,</p>\n <p>2: The cat and the fiddle,</p>\n <p>3: The cow {{0}} over the moon;</p>\n <p>4: The little dog {{1}},</p>\n <p>5: To see such sport,</p>\n <p>6: And the dish ran away with the {{2}}.</p>\n</div>",
      value: { 0: "Climbed", 1: "", 2: "" },
      choices: {
        0: [
          { label: "Jumped", value: "Jumped", correct: true },
          { label: "Climbed", value: "Climbed", correct: false },
          { label: "Flew", value: "Flew", correct: false }
        ],
        1: [
          { label: "Laughed", value: "Laughed", correct: true },
          { label: "Cried", value: "Cried", correct: false },
          { label: "Sang", value: "Sang", correct: false }
        ],
        2: [
          { label: "Spoon", value: "Spoon", correct: true },
          { label: "Fork", value: "Fork", correct: false },
          { label: "Knife", value: "Knife", correct: false }
        ]
      },
      prompt: "Use the dropdowns to complete the sentence"
    };
  });

  describe('outcome', () => {
    it('returns score of 0 for wrong values', async () => {
      const result = await outcome(
        question,
        { value: { 0: 'Climbed' } },
        { mode: 'gather' }
      );
      expect(result.score).toEqual(0);
    });

    it('returns score of 0 for partially true answers', async () => {
      const result = await outcome(
        question,
        { value: { 0: 'Jumped' } },
        { mode: 'gather' }
      );
      expect(result.score).toEqual(0);
    });

    it('returns score of 1 for correct answers', async () => {
      const result = await outcome(
        question,
        { value: { 0: 'Jumped', 1: 'Laughed' } },
        { mode: 'gather' }
      );
      expect(result.score).toEqual(0);
    });

    describe('partial scoring', () => {

      it('with defaults', async () => {
        const result = await outcome(question, {}, {});
        expect(result.score).toEqual(0);
      });

      it('with defaults and correct', async () => {
        const result = await outcome(question, { value: { 0: 'Jumped', 1: 'Laughed', 2: 'Spoon' } }, {});
        expect(result.score).toEqual(1);
      });

      it('with env.partialScoring: true', async () => {
        const result = await outcome(question, { value: { 0: 'Jumped' } }, { partialScoring: true });
        expect(result.score).toEqual(0.33);
      });

      it('with env.partialScoring: true + config.partialScoring: true', async () => {
        const result = await outcome(
          { ...question, partialScoring: true },
          { value: { 0: 'Jumped', 1: 'Laughed' } },
          { partialScoring: true }
        );
        expect(result.score).toEqual(0.67);
      });

    });
  });

  describe('model', () => {
    describe('mode: gather', () => {
      beforeEach(async () => {
        session = {};
        env = { mode: 'gather' };
        result = await model({ ...question, lockChoiceOrder: true }, session, env);
      });

      it('returns disabled', () => {
        expect(result.disabled).toEqual(false);
      });

      it('returns mode', () => {
        expect(result.mode).toEqual('gather');
      });

      it('returns prompt', () => {
        expect(result.prompt).toEqual('Use the dropdowns to complete the sentence');
      });

      it('returns choices', () => {
        expect(result.choices).toEqual(
          expect.objectContaining({
            0: [
              { label: "Jumped", value: "Jumped" },
              { label: "Climbed", value: "Climbed" },
              { label: "Flew", value: "Flew" }
            ]
          })
        );
      });

      it('does not return responseCorrect', () => {
        expect(result.responseCorrect).toBe(undefined);
      });
    });

    describe('mode: view', () => {
      beforeEach(async () => {
        session = {};
        env = { mode: 'view' };
        result = await model(question, session, env);
      });

      it('returns disabled', () => {
        expect(result.disabled).toEqual(true);
      });
    });

    describe('mode: evaluate', () => {
      beforeEach(async () => {
        session = {};
        env = { mode: 'evaluate' };
        isResponseCorrect.mockReturnValue(false);
        result = await model({ ...question, lockChoiceOrder: true }, session, env);
        return result;
      });

      it('returns choices w/ correct', () => {
        expect(result.choices).toEqual(
          expect.objectContaining({
            0: [
              { label: "Jumped", value: "Jumped", correct: true },
              { label: "Climbed", value: "Climbed", correct: false },
              { label: "Flew", value: "Flew", correct: false }
            ]
          })
        );
      });

      it('returns is response correct', () => {
        expect(result.responseCorrect).toEqual(false);
      });
    });
  });
});
