import { isValidSession } from '../index';

describe('isValidSession', () => {
  it('returns true if includeTargets is true and session is empty', () => {
    expect(isValidSession(
      {
        model: {
          config: {
            includeTargets: true
          }
        },
        session: { value: [] }
      })).toEqual(true);
  });

  it('returns true if includeTargets is true and session is not complete', () => {
    expect(isValidSession(
      {
        model: {
          config: {
            includeTargets: true
          }
        },
        session: { value: ['c1', null, 'c3', null] }
      })).toEqual(true);
  });

  it('returns true if includeTargets is true and session is not complete', () => {
    expect(isValidSession(
      {
        model: {
          config: {
            includeTargets: true
          }
        },
        session: { value: [null, 'c2'] }
      })).toEqual(true);
  });

  it('returns true if includeTargets is false, but session is valid', () => {
    expect(isValidSession(
      {
        model: {
          config: {
            includeTargets: false
          }
        },
        session: { value: ['c1', 'c3', 'c2', 'c4'] }
      })).toEqual(true);
  });

  it('returns false if includeTargets is false and session is empty', () => {
    expect(isValidSession(
      {
        model: {
          config: {
            includeTargets: false
          }
        },
        session: { value: [] }
      })).toEqual(false);
  });

  it('returns false if includeTargets is false and session is not complete', () => {
    expect(isValidSession(
      {
        model: {
          config: {
            includeTargets: false
          }
        },
        session: { value: ['c1', null, 'c3', null] }
      })).toEqual(false);
  });

  it('returns false if includeTargets is false and session is not complete', () => {
    expect(isValidSession(
      {
        model: {
          config: {
            includeTargets: false
          }
        },
        session: { value: [null, 'c2'] }
      })).toEqual(false);
  });
})
