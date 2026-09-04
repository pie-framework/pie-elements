import React from 'react';
import { render } from '@testing-library/react';

import { Main } from '../main';

const editorProps = [];

jest.mock('@pie-lib/editable-html-tip-tap', () => (props) => {
  editorProps.push(props);

  return <div data-testid="editor" />;
});

describe('Main', () => {
  const renderMain = (model) => {
    editorProps.length = 0;

    render(
      <Main
        model={{ dimensions: {}, ...model }}
        session={{ value: '' }}
        onValueChange={jest.fn()}
        onAnnotationsChange={jest.fn()}
        onCommentChange={jest.fn()}
      />,
    );

    return editorProps[editorProps.length - 1];
  };

  // The controller turns playerSpellCheckDisabled into spellCheckEnabled; the response area
  // editor has to receive it so the browser spellchecker stays off for students. See PIE-978.
  it('passes spellCheckEnabled: false to the response area editor', () => {
    expect(renderMain({ spellCheckEnabled: false }).spellCheck).toBe(false);
  });

  it('passes spellCheckEnabled: true to the response area editor', () => {
    expect(renderMain({ spellCheckEnabled: true }).spellCheck).toBe(true);
  });
});
