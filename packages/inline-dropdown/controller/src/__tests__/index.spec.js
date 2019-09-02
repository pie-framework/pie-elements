import { model } from '../index';

describe('inline-dropdown', () => {
  let result, question, session, env;

  beforeEach(() => {
    question = {
      lockChoiceOrder: false,
      choices: {
        '0': [
          {
            correct: false,
            value: '9719395',
            label: '20,000'
          },
          {
            correct: false,
            value: '9719396',
            label: '17,000'
          },
          {
            correct: false,
            value: '9719397',
            label: '16,100'
          },
          {
            correct: true,
            value: '9719398',
            label: '16,000'
          }
        ]
      },
      element: 'inline-dropdown-element',
      rationale: '',
      prompt:
        '<p>\n  <strong><span style="color: #000000; font-family: Arial;">El número 16,101</span></strong> <strong><span style="color: #000000; font-family: Arial;">redondeado al</span></strong> <strong><span style="color: #000000; font-family: Arial;">millar más cercano es&nbsp;______________.</span></strong>\n</p>\n<p>\n  <strong><span style="color: #000000;">&nbsp;</span></strong>\n</p>',
      scoringType: 'auto',
      teacherInstructions: true,
      studentInstructions: false,
      partialScoring: false,
      markup: '{{0}}',
      id: '2421310',
      alternateResponses: null
    };
  });

  describe('edge cases', () => {
    it('is ok is session is empty', async () => {
      session = {};
      env = { mode: 'evaluate' };
      const r = await model(question, {}, { mode: 'evaluate' });
      expect(r).toBeDefined();
    });
  });

  describe('model - with updateSession', () => {
    it('calls updateSession', async () => {
      session = { id: '1', element: 'inline-dropdown-element' };
      env = { mode: 'gather' };
      const updateSession = jest.fn().mockResolvedValue();
      await model(question, session, env, updateSession);
      expect(updateSession).toHaveBeenCalledWith('1', 'inline-dropdown-element', {
        shuffledValues: expect.arrayContaining(['9719395', '9719396', '9719397', '9719398'])
      });
    });
  });
});
