import {updateSessionValue} from '../session-updater';

describe('session-updater', () => {
  describe('updateSessionValue', () => {
    it('selects first element', () => {
      const session = {value: {}};
      updateSessionValue(session, {value: {'0-0': 1}});
      const expected = {'0-0': 1};
      expect(session.value).toEqual(expected);
    })
  });
});
