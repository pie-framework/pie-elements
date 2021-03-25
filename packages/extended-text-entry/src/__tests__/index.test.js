

import { isComplete, textContent } from '../index';

describe('textContent', () => {

  const assertContent = function()  {
    const args = Array.prototype.slice.call(arguments);
    const [input, expected] = args.length === 2 ? args : [args[0], args[0]];
    it(`${input} => ${expected}` ,() => {
      const result = textContent(input);
      expect(result).toEqual(expected  );
    })
  }
  assertContent(undefined );
  assertContent([], undefined);
  assertContent({}, undefined);
  assertContent("", "");
  assertContent("<div></div>", "");
  assertContent("< div ->/div>", "< div ->/div>");
  assertContent("<foo", "")
  assertContent("<foo/ >", "")
  assertContent("<foo />", "")
});

describe('Completeness Checker', () => {

  const assertIsComplete = (input, expected) => {
    it(`${input}: ${expected}`, () => {
    expect(isComplete(input)).toEqual(expected);
    })
  }
  assertIsComplete("", false);
  assertIsComplete("<div></div>", false);
  assertIsComplete("<div><p></p><h1></h1></div>", false);
  assertIsComplete("<div><p></p><h1</h1></div>", false);
  assertIsComplete("<div>test</div>", true);
  assertIsComplete("<div><p><a>test</a></p></div>", true);
  assertIsComplete("foo", true);
});