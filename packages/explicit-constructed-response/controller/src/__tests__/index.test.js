import { model, getScore, outcome, prepareVal } from '../index';

const choice = (l, v) => ({ label: l, value: v });
const choices = {
  0: [choice('cow', '0'), choice('cattle', '1'), choice('calf', '2')],
  1: [choice('over', '0'), choice('past', '1'), choice('beyond', '2')],
  2: [choice('moon', '0')]
};

describe('model', () => {
  let question;

  beforeEach(() => {
    question = {
      choices,
      prompt: 'Use the dropdowns to complete the sentence',
      markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>'
    };
  });

  it('output when session is defined', async () => {
    const m = await model(
      question,
      { value: { 0: 'cow', 1: 'over', 2: 'moon' } },
      { mode: 'evaluate' }
    );

    expect(m).toEqual(
      expect.objectContaining({
        feedback: { 0: 'correct', 1: 'correct', 2: 'correct' },
        responseCorrect: true
      })
    );
  });

  const returnModel = session => {
    it(`output when session is ${JSON.stringify(session)}`, async () => {
      const m = await model(question, session, { mode: 'evaluate' });

      expect(m).toEqual(
        expect.objectContaining({
          feedback: { 0: 'incorrect', 1: 'incorrect', 2: 'incorrect' },
          responseCorrect: false
        })
      );
    });
  };

  returnModel(undefined);
  returnModel(null);
  returnModel({});
});

describe('getScore', () => {
  let question;

  beforeEach(() => {
    question = {
      choices,
      prompt: 'Use the dropdowns to complete the sentence',
      markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>'
    };
  });

  it('score = 1 when session is defined', () => {
    expect(
      getScore(question, { value: { 0: 'cow', 1: 'over', 2: 'moon' } })
    ).toEqual(1);
  });

  const returnScore = session => {
    it(`score = 0 when session is ${JSON.stringify(session)}`, () => {
      expect(getScore(question, session)).toEqual(0);
    });
  };

  returnScore(undefined);
  returnScore(null);
  returnScore({});
});

describe('outcome', () => {
  let question;

  beforeEach(() => {
    question = {
      choices,
      prompt: 'Use the dropdowns to complete the sentence',
      markup: '<p>The {{0}} jumped {{1}} the {{2}}</p>'
    };
  });

  it('empty: false when session is defined', async () => {
    const m = await outcome(question, {
      value: { 0: 'cow', 1: 'over', 2: 'moon' }
    });

    expect(m).toEqual(expect.objectContaining({ score: 1, empty: false }));
  });

  const returnModel = session => {
    it(`empty: true when session is ${JSON.stringify(session)}`, async () => {
      const m = await outcome(question, session);

      expect(m).toEqual(expect.objectContaining({ score: 0, empty: true }));
    });
  };

  returnModel(undefined);
  returnModel(null);
  returnModel({});
});

describe('prepareVal', () => {
  it('should return empty string on null or undefined', () => {
    expect(prepareVal(null)).toEqual('');
    expect(prepareVal(undefined)).toEqual('');
  });

  it('should remove html tags', () => {
    expect(prepareVal('<div>Foo Bar</div>')).toEqual('Foo Bar');
  });
});

describe('null choices - ch4723', () => {
  it.only('..', async () => {
    const question = {
      markup:
        "<p>Jan's shape has {{0}} rows.</p>\n\n<p>Jan's shape has {{1}} columns.</p>\n\n<p>Jan used {{2}} squares in all to make the shape.</p>\n",
      choices: {
        '0': [
          {
            id: '0',
            label: '3'
          }
        ],
        '1': [
          {
            id: '0',
            label: '5'
          }
        ],
        '2': [
          {
            id: '0',
            label: '15'
          }
        ]
      },
      id: '4028e4a248cc8a8d0148e6bb27234ff3',
      element: 'explicit-constructed-response',
      rationale:
        '<p>Jan made 3 rows. Jan made 5 columns. Jan used a total of 15 squares to make her shape.</p>',
      prompt:
        '<p>Jan is making a shape using squares. The shape is shown below.</p><p><img alt="image 5703a9473d52409ab23c6124756329a5" id="5703a9473d52409ab23c6124756329a5" src="https://storage.googleapis.com/pie-staging-221718-assets/image/f291410c-c4d6-4a76-9477-47c17fc31682"></p><p>Type the correct answers into the boxes to make the sentences true.</p><p></p>'
    };

    const session = {
      shuffledValues: [null],
      id: '4028e4a248cc8a8d0148e6bb27234ff3',
      element: 'explicit-constructed-response'
    };

    const result = await model(question, session, jest.fn());
    console.log('result:', result);

    //Note: not sure if this assertion is totally correct - this is more just to highlight the issue.
    expect(result.choices).toEqual(question.choices);
  });
});

const d = {
  prompt: '',
  teacherInstructions: true,
  studentInstructions: false,
  choices: {
    0: [choice('A', '0'), choice('B', '1')]
  },
  markup:
    '<p>\n  <strong>Esta cuadrícula de coordenadas representa el diseño del salón de matemáticas de Valerie. Cada unidad en la cuadricula representa 1 pie cuadrado.&nbsp;</strong>\n</p>\n<p>\n  <strong>* El escritorio de Valeria se encuentra en (-3,-4)</strong>\n</p>\n<p>\n  <strong>* El escritorio de la maestra se encuentra en (5,-4)</strong>\n</p>\n<p>\n  <strong>* El cuarto de materiales se encuentra&nbsp; en (-3,-7)</strong>\n</p>\n<p>\n  <strong><img src="https://storage.googleapis.com/pie-staging-221718-assets/image/180d28b2-0376-428e-b415-de96e158b7e7" alt=""></strong>\n</p>\n<p>\n  &nbsp;\n</p>\n<p>\n  <strong>Anota la distancia, en pies, desde el escritorio de Valerie al cuarto de materiales.</strong>\n</p>\n<p>\n  {{0}} <strong>pies</strong>\n</p>',
  id: '2422330',
  rubric: '',
  element: 'explicit-constructed-response-element',
  autoScoring: 'partial',
  rationale: ''
};

describe('edge cases', () => {
  it('does not throw an error if the session has no value', async () => {
    const result = model(d, {}, { mode: 'evaluate' });
    expect(result).toBeDefined();
  });

  describe('model - with updateSession', () => {
    it('calls updateSession', async () => {
      const session = { id: '1', element: 'explicit-constructed-response' };
      const env = { mode: 'gather' };
      const updateSession = jest.fn().mockResolvedValue();
      await model(d, session, env, updateSession);
      expect(updateSession).toHaveBeenCalledWith(
        '1',
        'explicit-constructed-response',
        {
          shuffledValues: expect.arrayContaining(['0', '1'])
        }
      );
    });
  });
});
