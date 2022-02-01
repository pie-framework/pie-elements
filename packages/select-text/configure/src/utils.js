import React from 'react';

var createElementFromHTML = function createElementFromHTML() {
  var htmlString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div;
};

var parseBrs = function parseBrs(dom) {
  var brs = dom.querySelectorAll('br');
  brs.forEach(function (br) {
    return br.replaceWith('\n');
  });
  dom.innerHTML = dom.innerHTML.replace(/\n\n/g, '\n');
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

  if (txtDom.querySelectorAll('div').length === 0) {
    var div = document.createElement('div');
    div.innerHTML = '<div separator=\'true\'>'.concat(txtDom.innerHTML, '</div>');
    txtDom = div;
  } // if no dom elements, we just return the text

  var allDomElements = Array.from(txtDom.querySelectorAll('*'));

  if (allDomElements.length === 0) {
    return text;
  }

  parseBrs(txtDom);
  return parseParagraphs(txtDom);
};

export default (model) => {
// parsing
  const modelText = prepareText(model.text);

  const newTokens = (model.tokens || []).reduce((acc, token) => {
    const tokenText = prepareText(model.text.slice(token.start, token.end));

    if (!tokenText) {
      return token;
    }

    function getAllIndexes(arr, val) {
      var indexes = [], i = -1;

      while ((i = (arr || '').indexOf(val, i + 1)) != -1) {
        if (!(acc.filter(({ start, text }) => (text === val && start === i)) || []).length) {
          indexes.push(i);
        }
      }

      return indexes;
    }

    var indexes = getAllIndexes(modelText, tokenText);

    const newStart = indexes[0];
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
