import { model } from '../index';

describe('rubric model', () => {

  let state = {
    points: ['nothing right', 'a teeny bit right', 'mostly right', 'bingo'],
    sampleAnswers: [null, 'just right', 'not left', null],
    maxPoints: 4,
    excludeZero: false
  };

  let session = {};
  let env, result;

  it('returns no model for gather', async () => {
    env = { mode: 'gather' };
    result = await model(state, session, env);
    expect(result).toEqual({});
  });

  it('returns no model for student role', async () => {
    env = { mode: 'gather', role: 'student' };
    result = await model(state, session, env);
    expect(result).toEqual({});
  });

  it('returns model for instructor role', async () => {
    env = { mode: 'gather', role: 'instructor' };
    result = await model(state, session, env);
    expect(result).toEqual(state);
  });



});
