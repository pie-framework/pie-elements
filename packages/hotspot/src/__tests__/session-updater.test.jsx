import { updateSessionValue } from '../session-updater';

const modelCopy = {
  shapes: {
    rectangles: [
      {
        id: '1',
        correct: true
      },
      {
        id: '2'
      },
      {
        id: '3'
      }
    ],
    polygons: [
      {
        id: '4',
        correct: true
      },
      {
        id: '5'
      }
    ]
  },
  configure: {},
  multipleCorrect: true
};

const sessionCopy = {
  answers: [
    {
      id: '1'
    },
    {
      id: '2'
    }
  ]
};

describe('session-updater', () => {
  beforeEach(() => {});

  describe('updateSessionValue', () => {
    const assert = (session, model, data, expected) => {
      return () => {
        updateSessionValue(session, model, data);
        expect(session.answers).toEqual(expected);
      };
    };

    describe('deselect', () => {
      it('deselects shape', assert(
        sessionCopy,
        modelCopy,
        { id: '1', selected: false },
        [{ id: '2' }]
      ));
    });

    describe('select hotspot', () => {
      it('selects shape in multiple choice mode', assert(
        sessionCopy,
        modelCopy,
        { id: '1', selected: true },
        [{ id: '2' }, { id: '1' }]
      ));

      it('selects shape in single choice mode', assert(
        sessionCopy,
        { ...modelCopy, multipleCorrect: false },
        { id: '1', selected: true },
        [{ id: '1' }]
      ));
    });
  });
});
