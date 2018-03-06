import { model } from '../index';

describe('model', () => {


  let result;

  let question = {
    choices: [
      {
        value: 'a',
        label: 'a',
        correct: true,
        feedback: {
          type: 'custom',
          value: 'hooray'
        }
      },
      {
        value: 'b',
        label: 'b',
        correct: false,
        feedback: {
          type: 'default'
        }
      }
    ]
  }

  let session = {
    selectedChoice: 'a'
  }

  let env;
  beforeEach(async () => {
    env = { mode: 'gather' }
    result = await model(question, session, env);
  });

  it('returns choices', () => {
    expect(result.choices).toMatchObject(question.choices.map(c => ({ label: c.label, value: c.value })));
  });

  it('returns disabled:false', () => {
    expect(result.disabled).toEqual(false);
  });

  describe('mode == evaluate', () => {

    beforeEach(async () => {
      env = { mode: 'evaluate' };
      result = await model(question, session, env);
    });

    it('returns disabled: true', () => {
      expect(result.disabled).toEqual(true);
    });

    it('returns result', () => {
      expect(result.result).toMatchObject({
        correct: true,
        feedback: 'hooray'
      })
    });
  });

  describe('mode === evaluate wrong answer', () => {

    beforeEach(async () => {
      env = { mode: 'evaluate' }
      session = {
        selectedChoice: 'b'
      }
      result = await model(question, session, env);
    });

    it('returns result', () => {
      expect(result.result).toMatchObject({
        correct: false,
        feedback: 'Incorrect'
      });
    })
  });
})
