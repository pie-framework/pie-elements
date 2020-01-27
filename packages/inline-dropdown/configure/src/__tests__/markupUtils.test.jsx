import {
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

  });

  describe('processMarkup', () => {

    it('should get processed markup', () => {
      const markup = [
        '<div>',
          '<span data-type="inline_dropdown" data-value="foobar" data-index="0"></span>',
          '<span data-type="inline_dropdown" data-value="barfoo" data-index="1"></span>',
        '</div>'
      ].join('');
      const processed = processMarkup(markup);

      expect(processed).toEqual([
        '<div>',
        '{{0}}',
        '{{1}}',
        '</div>'
      ].join(''));
    });

  });

  describe('createSlateMarkup', () => {

    it('should create slate markup from the regular markup and choices', () => {
      const markup = [
        '<div>',
          '{{0}}',
          '{{1}}',
        '</div>'
      ].join('');
      const choices = {
        0: [
          {
            id: '0',
            value: 'foobar',
            label: 'foobar'
          },
          {
            id: '1',
            value: 'barfoo',
            label: 'barfoo'
          },
          {
            id: '2',
            value: 'hufu',
            label: 'hufu',
            correct: true
          }
        ],
        1: [
          {
            id: '0',
            value: 'foobar',
            label: 'foobar'
          },
          {
            id: '1',
            value: 'barfoo',
            label: 'barfoo'
          },
          {
            id: '2',
            value: 'hufu',
            label: 'hufu',
            correct: true
          }
        ]
      };
      const slateMarkup = createSlateMarkup(markup, choices);

      expect(slateMarkup).toEqual([
        '<div>',
        '<span data-type="inline_dropdown" data-index="0" data-value="hufu"></span>',
        '<span data-type="inline_dropdown" data-index="1" data-value="hufu"></span>',
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
      const choices = {
        0: [
          {
            id: '0',
            value: 'foobar',
            label: 'foobar'
          },
          {
            id: '1',
            value: 'barfoo',
            label: 'barfoo'
          },
          {
            id: '2',
            value: 'hufu',
            label: 'hufu',
            correct: true
          }
        ],
        1: [
          {
            id: '0',
            value: 'foobar',
            label: 'foobar'
          },
          {
            id: '1',
            value: 'barfoo',
            label: 'barfoo'
          },
          {
            id: '2',
            value: 'hufu',
            label: 'hufu'
          }
        ]
      };
      const slateMarkup = createSlateMarkup(markup, choices);

      expect(slateMarkup).toEqual([
        '<div>',
        '<span data-type="inline_dropdown" data-index="0" data-value="hufu"></span>',
        '<span data-type="inline_dropdown" data-index="1" data-value=""></span>',
        '</div>'
      ].join(''));
    });

  });

});
