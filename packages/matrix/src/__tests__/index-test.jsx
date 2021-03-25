import {isComplete} from '../index';

describe('isComplete', () => {
  it('returns true if value is populated', () => {
    expect(isComplete({value: {'0-0': 1}})).toEqual(true);
  });

  it('returns false if value is empty object', () => {
    expect(isComplete({value: {}})).toEqual(false);
  });

  it('returns false if session is empty', () => {
    expect(isComplete({})).toEqual(false);
  });

  it('returns false if session is null', () => {
    expect(isComplete(null)).toEqual(false);
  });

  it('returns false if session is undefined', () => {
    expect(isComplete(undefined)).toEqual(false);
  });
});
