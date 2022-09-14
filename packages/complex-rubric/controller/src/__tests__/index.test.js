import { model } from '../index';
import defaultModel from '../defaults';

jest.mock('@pie-lib/rubric', () => ({
  RUBRIC_TYPES: {
    SIMPLE_RUBRIC: 'simpleRubric',
    MULTI_TRAIT_RUBRIC: 'multiTraitRubric'
  }
}));

describe('complex rubric model', () => {
  let state = { ...defaultModel.model };
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

  it('returns model for instructor role and simple rubric', async () => {
    env = { mode: 'gather', role: 'instructor' };
    result = await model(state, session, env);
    expect(result).toEqual({
      ...state,
      rubrics: {
        ...state.rubrics,
        multiTraitRubric: {
          ...state.rubrics.multiTraitRubric,
          visible: false
        }
      }
    });
  });

  it('returns model for instructor role and multi trait rubric', async () => {
    env = { mode: 'gather', role: 'instructor' };
    result = await model({ ...state, rubricType: 'multiTraitRubric' }, session, env);
    expect(result).toEqual({
      ...state,
      rubricType: 'multiTraitRubric',
      rubrics: {
        ...state.rubrics,
        simpleRubric: {
          ...state.rubrics.simpleRubric,
          visible: false
        }
      }
    });
  });
});
