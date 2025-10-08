import { getResponseCorrectness, model, outcome } from '../index';

jest.mock('@pie-lib/text-select', () => ({
  prepareText: jest.fn(),
}));

const defaultModel = {
  id: '1',
  element: 'fraction-model',
  correctResponse: [
    {
      id: 1,
      value: 5,
    },
    {
      id: 2,
      value: 5,
    },
    {
      id: 3,
      value: 2,
    },
  ],
  title: 'Question',
  prompt: 'Title',
  modelTypeSelected: 'bar',
  maxModelSelected: 3,
  partsPerModel: 5,
  allowedStudentConfig: false,
  showGraphLabels: false,
};

describe('getResponseCorrectness', () => {
  it('returns correct correctness', () => {
    const c = getResponseCorrectness(defaultModel, {
      response: [
        {
          id: 1,
          value: 5,
        },
        {
          id: 2,
          value: 2,
        },
        {
          id: 3,
          value: 5,
        },
      ],
    });
    expect(c).toEqual('correct');
  });

  it('returns incorrect correctness', () => {
    const c = getResponseCorrectness(defaultModel, {
      response: [
        {
          id: 1,
          value: 5,
        },
        {
          id: 2,
          value: 2,
        },
      ],
    });
    expect(c).toEqual('incorrect');
  });
});

describe('outcome', () => {
  it('handles empty session', async () => {
    const result = await outcome(
      defaultModel,
      {
        id: '1',
        answers: {
          response: [],
        },
      },
      { mode: 'evaluate' },
    );
    expect(result).toEqual({ score: 0 });
  });
  it('handles correct session', async () => {
    const result = await outcome(
      defaultModel,
      {
        id: '1',
        answers: {
          response: [
            {
              id: 1,
              value: 5,
            },
            {
              id: 2,
              value: 2,
            },
            {
              id: 3,
              value: 5,
            },
          ],
        },
      },
      { mode: 'evaluate' },
    );
    expect(result).toEqual({ score: 1 });
  });

  it('handles incorrect session', async () => {
    const result = await outcome(
      defaultModel,
      {
        id: '1',
        answers: {
          response: [
            {
              id: 1,
              value: 5,
            },
            {
              id: 2,
              value: 2,
            },
          ],
        },
      },
      { mode: 'evaluate' },
    );
    expect(result).toEqual({ score: 0 });
  });
});

describe('model', () => {
  it('returns object', async () => {
    const result = await model({}, {}, {});
    expect(result).toEqual({
      env: {},
      correctResponse: [],
      title: '',
      prompt: '',
      modelTypeSelected: 'bar',
      maxModelSelected: 1,
      partsPerModel: 5,
      allowedStudentConfig: false,
      showGraphLabels: false,
      view: false,
    });
  });
});
