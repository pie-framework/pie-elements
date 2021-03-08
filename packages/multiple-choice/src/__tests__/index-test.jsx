import { isComplete } from '../index';

describe('isComplete', () => {
  it.each`
  session               |   expected
  ${{ value: [1,2,3]}}  |   ${true}
  ${{ value: [] }}      |   ${false}
  ${{}}                 |   ${false}
  ${null}               |   ${false}
  ${undefined}          |   ${false}
  `('session = $session is complete => $expected', ({ session, expected }) => {
    expect(isComplete(session)).toEqual(expected);
  });
});
