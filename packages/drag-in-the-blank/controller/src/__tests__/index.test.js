import { model } from '../index';

const choice = (v, id) => ({ value: v, id });

describe('controller', () => {
  let question, session, env;

  beforeEach(() => {
    question = {
      id: '1',
      element: 'drag-in-the-blank',
      choices: [
        choice('<div>6</div>', '0'),
        choice('<div>9</div>', '1')
      ],
    };
  });

  describe('model', () => {
    describe('model - with updateSession', () => {
      it('calls updateSession', async () => {
        session = { id: '1', element: 'drag-in-the-blank' };
        env = { mode: 'gather' };
        const updateSession = jest.fn().mockResolvedValue();
        await model(question, session, env, updateSession);
        expect(updateSession).toHaveBeenCalledWith('1', 'drag-in-the-blank', {
          shuffledValues: expect.arrayContaining(['0', '1'])
        });
      });
    });
  });
});
