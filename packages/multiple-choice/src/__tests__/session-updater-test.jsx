import { updateSessionValue } from '../session-updater';

describe('session-updater', () => {
  let updater;

  beforeEach(() => {});

  describe('updateSessionValue', () => {
    const assert = (mode, session, data, expected) => {
      return () => {
        updateSessionValue(session, mode, data);
        expect(session.value).toEqual(expected);
      };
    };

    describe('checkbox', () => {
      const cb = assert.bind(null, 'checkbox');
      it('adds 1', cb({ value: [] }, { value: '1', selected: true }, ['1']));
      it(
        'removes 1',
        cb({ value: ['1'] }, { value: '1', selected: false }, [])
      );
      it(
        'adds 2',
        cb({ value: ['1'] }, { value: '2', selected: true }, ['1', '2'])
      );
      it(
        'does not add duplicate 1',
        cb({ value: ['1'] }, { value: '1', selected: true }, ['1'])
      );
      it(
        'does not remove if not in arrary',
        cb({ value: ['1'] }, { value: '2', selected: false }, ['1'])
      );
    });

    describe('radio', () => {
      const cb = assert.bind(null, 'radio');
      it('adds 1', cb({ value: [] }, { value: '1', selected: true }, ['1']));
      it('adds 2', cb({ value: ['1'] }, { value: '2', selected: true }, ['2']));
      it(
        'does not add duplicate 1',
        cb({ value: ['1'] }, { value: '1', selected: true }, ['1'])
      );
    });
  });
});
