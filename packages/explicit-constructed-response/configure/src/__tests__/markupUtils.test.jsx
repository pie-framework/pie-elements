import {
  createSlateMarkup,
  processMarkup,
  removeUnwantedCharacters
} from '../markupUtils';

describe('markupUtils', () => {

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

    it('should remove <br> and </br> tags', () => {
      expect(removeUnwantedCharacters('<div>foo</br><br>bar</div>')).toEqual('<div>foobar</div>');
    });

  });

  describe('processMarkup', () => {

    it('should process slate markup and replace {{number}} with a ecr element dom', () => {
      const markup = [
        '<div>',
          '<span data-type="explicit_constructed_response"></span>',
          '<span data-type="explicit_constructed_response"></span>',
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

    it('should handle the case when markup is empty', () => {
      expect(createSlateMarkup('', {})).toEqual('');
    });

    it('should replace {{number}} with the appropriate element', () => {
      const markup = [
        '<div>',
        '{{0}}',
        '</div>'
      ].join('');
      const choices = {
        0: [{
          label: 'foobar'
        }]
      };
      const slateMarkup = createSlateMarkup(markup, choices);

      expect(slateMarkup).toEqual([
        '<div>',
        '<span data-type="explicit_constructed_response" data-index="0" data-value="foobar"></span>',
        '</div>'
      ].join(''))
    });

    it('should replace {{number}} with the appropriate element having the value escaped', () => {
      const markup = [
        '<div>',
        '{{0}}',
        '</div>'
      ].join('');
      const choices = {
        0: [{
          label: 'foo&bar'
        }]
      };
      const slateMarkup = createSlateMarkup(markup, choices);

      expect(slateMarkup).toEqual([
        '<div>',
        '<span data-type="explicit_constructed_response" data-index="0" data-value="foo&amp;bar"></span>',
        '</div>'
      ].join(''))
    });

  });

});
