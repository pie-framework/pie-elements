import { model } from '../index';

describe('inline-dropdown', () => {
  describe('edge cases', () => {
    it('is ok is session is empty', async () => {
      const d = {
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

      const r = await model(d, {}, { mode: 'evaluate' });
      expect(r).toBeDefined();
    });
  });
});
