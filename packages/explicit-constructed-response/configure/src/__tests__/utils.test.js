import { processMarkup, createSlateMarkup } from '../markupUtils';

describe('processMarkup', () => {
  const assertProcessMarkup = (markup, expected, should) => {
    it(should || `returns processed markup: ${expected}`, () => {
      expect(processMarkup(markup)).toEqual(expected);
    });
  };

  assertProcessMarkup(
    '<p>The <span data-type="explicit_constructed_response" data-index="0" data-value="cow"></span> jumped <span data-type="explicit_constructed_response" data-index="1" data-value="over"></span> the <span data-type="explicit_constructed_response" data-index="2" data-value="moon"></span></p>',
    '<p>The {{0}} jumped {{1}} the {{2}}</p>');

  assertProcessMarkup(
    '<p>This is a <span data-type="explicit_constructed_response" data-index="0" data-value="test"></span>.</p>',
    '<p>This is a {{0}}.</p>');

  assertProcessMarkup(
    '<p>This is another test.</p>',
    '<p>This is another test.</p>');

  assertProcessMarkup(
    '',
    '');

  assertProcessMarkup(
    undefined,
    '');

  assertProcessMarkup(
    null,
    '');

  assertProcessMarkup(
    '<div> \\tfoo\\nbar </div>',
    '<div> foobar </div>',
    'should remove \t, \n from the string');

  assertProcessMarkup(
    '<div> \"foobar\" </div>',
    '<div> "foobar" </div>',
    'should replace \" with " in the string');

  assertProcessMarkup(
    '<div> \/foobar </div>',
    '<div> /foobar </div>',
    'should replace \/ with / in the string');

  assertProcessMarkup(
    '<div> <br><br> </br> </div>',
    '<div>   </div>',
    'should remove <br> or </br> elements from the string');
});

describe('createSlateMarkup', () => {
  const choices = {
    0: [{ label: 'cow', value: '0' }, { label: 'cattle', value: '1' }, { label: 'calf', value: '2' }],
    1: [{ label: 'over', value: '0' }, { label: 'past', value: '1' }, { label: 'beyond', value: '2' }],
    2: [{ label: 'moon', value: '0' }]
  };

  const assertCreateSlateMarkup = (markup, expected, should) => {
    it(should || `returns slate markup: ${expected}`, () => {
      expect(createSlateMarkup(markup, choices)).toEqual(expected);
    });
  };

  assertCreateSlateMarkup(
    '<p>The {{0}} jumped {{1}} the {{2}}</p>',
    '<p>The <span data-type="explicit_constructed_response" data-index="0" data-value="cow"></span> jumped <span data-type="explicit_constructed_response" data-index="1" data-value="over"></span> the <span data-type="explicit_constructed_response" data-index="2" data-value="moon"></span></p>',
  );

  assertCreateSlateMarkup(
    '<p>This is a {{0}}.</p>',
    '<p>This is a <span data-type="explicit_constructed_response" data-index="0" data-value="cow"></span>.</p>',
  );

  assertCreateSlateMarkup(
    '<p>This is another test.</p>',
    '<p>This is another test.</p>',
  );

  assertCreateSlateMarkup(
    '',
    '');

  assertCreateSlateMarkup(
    undefined,
    '');

  assertCreateSlateMarkup(
    null,
    '');

  assertCreateSlateMarkup(
    '<div> \\tfoo\\nbar </div>',
    '<div> foobar </div>',
    'should remove \t, \n from the string');

  assertCreateSlateMarkup(
    '<div> \"foobar\" </div>',
    '<div> "foobar" </div>',
    'should replace \" with " in the string');

  assertCreateSlateMarkup(
    '<div> \/foobar </div>',
    '<div> /foobar </div>',
    'should replace \/ with / in the string');

  assertCreateSlateMarkup(
    '<div> <br><br> </br> </div>',
    '<div>   </div>',
    'should remove <br> or </br> elements from the string');
});
