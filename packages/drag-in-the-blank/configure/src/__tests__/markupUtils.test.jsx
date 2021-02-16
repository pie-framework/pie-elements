import {
  choiceIsEmpty,
  createElementFromHTML,
  createSlateMarkup,
  processMarkup,
  removeUnwantedCharacters
} from '../markupUtils';

describe('markupUtils', () => {

  describe('createElementFromHTML', () => {

    it('should create dom element from string', () => {
      const el = createElementFromHTML(`<div>Foo Bar</div>`);

      expect(el.outerHTML).toEqual('<div><div>Foo Bar</div></div>');
    });

  });

  describe('removeUnwantedCharacters', () => {

    it('should remove \\t and \\n characters', () => {
      expect(removeUnwantedCharacters('<div>foo\t\nbar</div>')).toEqual('<div>foobar</div>');
    });

    it('should remove \\t and \\n characters', () => {
      expect(removeUnwantedCharacters('<div>foo\\t\\nbar</div>')).toEqual('<div>foobar</div>');
    });

    it('should replace \\" with "', () => {
      expect(removeUnwantedCharacters('<div>\"foo bar\"</div>')).toEqual('<div>"foo bar"</div>');
    });

    it('should replace \\\/ with /', () => {
      expect(removeUnwantedCharacters('<div>foo\/bar</div>')).toEqual('<div>foo/bar</div>');
    });

    it('should not remove \\t character which has latex like \\times', () => {
      expect(removeUnwantedCharacters('<div><span data-latex=\"\" data-raw=\"3\\times3\\div2\">3\\times3\\div2</span></div>'))
        .toEqual("<div><span data-latex=\"\" data-raw=\"3\\times3\\div2\">3\\times3\\div2</span></div>");
    });

  });

  describe('processMarkup', () => {

    it('should get choices, markup and correctResponse from markup', () => {
      const markup = [
        '<div>',
          '<span data-type="drag_in_the_blank" data-value="foobar" data-id="0"></span>',
          '<span data-type="drag_in_the_blank" data-value="barfoo" data-id="1"></span>',
        '</div>'
      ].join('');
      const processed = processMarkup(markup);

      expect(processed).toEqual(expect.objectContaining({
        markup: [
          '<div>',
          '{{0}}',
          '{{1}}',
          '</div>'
        ].join(''),
        choices: [
          {
            value: 'foobar',
            id: '0'
          },
          {
            value: 'barfoo',
            id: '1'
          }
        ],
        correctResponse: {
          0: '0',
          1: '1'
        }
      }));
    });

    // TODO: not sure if this test is very good
    it('should get value with &nbsp; replaced with a regular space', () => {
      const markup = [
        '<div>',
          '<span data-type="drag_in_the_blank" data-value="foo&nbsp;bar" data-id="0"></span>',
        '</div>'
      ].join('');
      const processed = processMarkup(markup);

      expect(encodeURIComponent(processed.choices[0].value)).toEqual('foo%C2%A0bar');

    });

  });

  describe('createSlateMarkup', () => {

    it('should create slate markup from the regular markup, choices and correctResponses', () => {
      const markup = [
        '<div>',
          '{{0}}',
          '{{1}}',
        '</div>'
      ].join('');
      const choices = [
        {
          value: 'foobar',
          id: '0'
        },
        {
          value: 'barfoo',
          id: '1'
        }
      ];
      const correctResponse = {
        0: '0',
        1: '1'
      };
      const slateMarkup = createSlateMarkup(markup, choices, correctResponse);

      expect(slateMarkup).toEqual([
        '<div>',
        '<span data-type="drag_in_the_blank" data-index="0" data-id="0" data-value="foobar"></span>',
        '<span data-type="drag_in_the_blank" data-index="1" data-id="1" data-value="barfoo"></span>',
        '</div>'
      ].join(''));
    });

    it('should handle choices with empty values', () => {
      const markup = [
        '<div>',
          '{{0}}',
          '{{1}}',
        '</div>'
      ].join('');
      const choices = [
        {
          value: 'foobar',
          id: '0'
        },
        {
          value: '',
          id: '1'
        }
      ];
      const correctResponse = {
        0: '0',
        1: '1'
      };
      const slateMarkup = createSlateMarkup(markup, choices, correctResponse);

      expect(slateMarkup).toEqual([
        '<div>',
        '<span data-type="drag_in_the_blank" data-index="0" data-id="0" data-value="foobar"></span>',
        '<span data-type="drag_in_the_blank" data-index="1" data-id="" data-value=""></span>',
        '</div>'
      ].join(''));
    });

  });

  describe('choiceIsEmpty', () => {

    it('should return false if choice is null or undefined', () => {
      expect(choiceIsEmpty(null)).toEqual(false);

      expect(choiceIsEmpty(undefined)).toEqual(false);

    });

    it('should handle choices with no value provided', () => {
      expect(choiceIsEmpty({})).toEqual(true);
    });

    it('should handle choices with img tags provided', () => {
      const markup = [
        '<div>',
        '<img src="foobar" />',
        '</div>'
      ].join('');

      expect(choiceIsEmpty({ value: markup })).toEqual(false);
    });

  });

});
