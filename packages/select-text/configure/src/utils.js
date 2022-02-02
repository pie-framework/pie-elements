import React from 'react';

var createElementFromHTML = function createElementFromHTML() {
  var htmlString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div;
};

var parseParagraph = function parseParagraph(paragraph, end) {
  if (end) {
    return paragraph.innerHTML;
  }

  return ''.concat(paragraph.innerHTML, '\n\n');
};

var parseParagraphs = function parseParagraphs(dom) {
  var paragraphs = dom.querySelectorAll('div[separator=true]'); // separate variable for easily debugging, if needed

  var str = '';
  paragraphs.forEach(function (par, index) {
    str += parseParagraph(par, index === paragraphs.length - 1);
  });
  return str || null;
};

var prepareText = function prepareText(text) {
  var txtDom = createElementFromHTML(text);

  var div = document.createElement('div');
  div.innerHTML = '<div separator=\'true\'>'.concat(txtDom.innerHTML, '</div>');
  txtDom = div;

  var allDomElements = Array.from(txtDom.querySelectorAll('*'));

  if (allDomElements.length === 0) {
    return text;
  }

  return parseParagraphs(txtDom);
};

export default (model) => {
// parsing
  const modelText = prepareText(model.text);

  const newTokens = (model.tokens || []).reduce((acc, token) => {
    const tokenText = prepareText(model.text.slice(token.start, token.end));

    if (!tokenText) {
      return [...acc, token];
    }

    const getStartIndex = (start) => {
      let length = start;

      while (length >= 0) {
        let newStartIndex = modelText.slice(length).indexOf(tokenText);

        if (newStartIndex >= 0) {
          return newStartIndex + length;
        }

        length--;
      }

      return 0;
    };

    const lastToken = acc[acc.length - 1];
    const newStart = getStartIndex(lastToken ? lastToken.end : token.start);
    const newEnd = newStart + tokenText.length;

    return [
      ...acc,
      {
        ...token,
        text: tokenText,
        start: newStart,
        end: newEnd
      }
    ];
  }, []);


  return {
    ...model,
    tokens: newTokens,
    text: modelText
  }
}
