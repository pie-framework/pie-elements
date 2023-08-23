import { getCorrectness, model, outcome } from '../index';

jest.mock('@pie-lib/text-select', () => ({
  prepareText: jest.fn(),
}));

describe('getCorrectness', () => {
  it('returns correctness', () => {
    const c = getCorrectness();
    expect(c).toEqual('correct');
  });
});

describe('outcome', () => {
  it('handles empty session', async () => {
    const result = await outcome({ tokens: [] }, { id: '1' }, { mode: 'evaluate' });
    expect(result).toEqual({ score: 1 });
  });
});

describe('model', () => {
  it('returns object', async () => {
    const result =await model({}, {}, {});
    console.log(result);
    expect(result).toEqual({
      prompt: 'Question Prompt goes here',
      env: {}
    })
  })
});
