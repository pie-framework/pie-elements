import { isResponseCorrect } from '../utils';

describe('isResponseCorrect', () => {
  let question;

  beforeEach(() => {
    question = {
      partA: {
        choiceMode: 'radio',
        allowFeedback: true,
        choices: [
          {
            value: 'yellow',
            label: 'Yellow',
            correct: true,
            feedback: {
              type: 'custom',
              value: 'foo'
            }
          },
          {
            value: 'green',
            label: 'Green',
            feedback: {
              type: 'default'
            }
          },
        ],
        choicePrefix: 'numbers',
        prompt: `prompt partA`,
      }
    };
  });

  const returnsIsResponseCorrect = (session) => {
    it(`response is not correct if session is ${JSON.stringify(session)}`, () => {
      expect(isResponseCorrect(question.partA, 'partA', session)).toEqual(false);
    });
  };

  returnsIsResponseCorrect(undefined);
  returnsIsResponseCorrect(null);
  returnsIsResponseCorrect({});

  it('response is correct if session is defined', () => {
    expect(isResponseCorrect(
      question.partA,
      'partA',
      { value: { partA: { value: ['yellow'] } } })).toEqual(true);
  });
});
