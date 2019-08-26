import { model } from '../index';

const prompt = (id, relatedAnswer) => ({
  id,
  title: `Prompt ${id}`,
  relatedAnswer
});

const answer = (id) => ({
  id,
  title: `Answer ${id}`
});

describe('controller', () => {
  let question, session, env;

  beforeEach(() => {
    question = {
      id: '1',
      element: 'match-list',
      prompts: [prompt(1, 1), prompt(2, 2)],
      answers: [answer(3), answer(4), answer(5)],
    };
  });

  describe('model', () => {
    describe('model - with updateSession', () => {
      it('calls updateSession', async () => {
        session = { id: '1', element: 'match-list' };
        env = { mode: 'gather' };
        const updateSession = jest.fn().mockResolvedValue();
        await model(question, session, env, updateSession);
        expect(updateSession).toHaveBeenCalledWith('1', 'match-list', {
          shuffledValues: expect.arrayContaining([1, 2], [3, 4, 5, 6])
        });
      });
    });
  });
});
