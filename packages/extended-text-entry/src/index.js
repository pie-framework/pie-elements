import Main from './main';
import React from 'react';
import { createRoot } from 'react-dom/client';
import debug from 'debug';

import { renderMath } from '@pie-lib/math-rendering';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';

const log = debug('@pie-elements:extended-text-entry');

const domParser = typeof window !== undefined ? new DOMParser() : { parseFromString: (v) => v };

export function textContent(value) {
  if (typeof value !== 'string') {
    return undefined;
  }

  try {
    const document = domParser.parseFromString(value, 'text/html');
    const textContent = document.body.textContent;

    return textContent;
  } catch (err) {
    log('tried to parse as dom and failed', value);
    return value;
  }
}

export function isComplete(value) {
  const tc = textContent(value);
  const out = tc !== undefined && tc.length > 0;

  return out;
}

export default class RootExtendedTextEntry extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = null;
    this._root = null;
    console.log('[MATH-DEBUG][extended-text-entry] constructor called');
  }

  setLangAttribute() {
    const language = this._model && typeof this._model.language ? this._model.language : '';
    const lang = language ? language.slice(0, 2) : 'en';
    this.setAttribute('lang', lang);
  }

  set model(m) {
    this._model = m;
    this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), false, !!this._model));

    this.render();
  }

  set session(s) {
    this._session = s;
    this.render();
  }

  get session() {
    return this._session;
  }

  valueChange(value) {
    this._session.value = value;

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), isComplete(value)));

    this.render();
  }

  annotationsChange(annotations) {
    this._session.annotations = annotations;

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), true));

    this.render();
  }

  commentChange(comment) {
    this._session.comment = comment;

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), isComplete(comment)));

    this.render();
  }

  connectedCallback() {
    console.log('[MATH-DEBUG][extended-text-entry] connectedCallback called');
    this.setAttribute('aria-label', 'Written Response Question');
    this.setAttribute('role', 'region');

    this.render();
  }

  render() {
    if (this._model && this._session) {
      console.log('[MATH-DEBUG][extended-text-entry] render() called');

      let elem = React.createElement(Main, {
        model: this._model,
        session: this._session,
        onValueChange: this.valueChange.bind(this),
        onAnnotationsChange: this.annotationsChange.bind(this),
        onCommentChange: this.commentChange.bind(this),
      });

      this.setLangAttribute();

      if (!this._root) {
        console.log('[MATH-DEBUG][extended-text-entry] createRoot() - creating new root');
        this._root = createRoot(this);
      }

      console.log('[MATH-DEBUG][extended-text-entry] root.render() - starting React render');
      const mathNodesBefore = this.querySelectorAll('[data-latex], mjx-container, math').length;
      console.log('[MATH-DEBUG][extended-text-entry] Math nodes before render:', mathNodesBefore);

      this._root.render(elem);

      console.log('[MATH-DEBUG][extended-text-entry] root.render() - render call completed (async)');

      queueMicrotask(() => {
        const mathNodesAfter = this.querySelectorAll('[data-latex], mjx-container, math').length;
        console.log('[MATH-DEBUG][extended-text-entry] queueMicrotask() - before renderMath');
        console.log('[MATH-DEBUG][extended-text-entry] Math nodes in microtask:', mathNodesAfter);
        console.log('[MATH-DEBUG][extended-text-entry] [data-latex] nodes:', this.querySelectorAll('[data-latex]').length);
        console.log('[MATH-DEBUG][extended-text-entry] mjx-container nodes:', this.querySelectorAll('mjx-container').length);

        renderMath(this);

        const mathNodesRendered = this.querySelectorAll('mjx-container').length;
        console.log('[MATH-DEBUG][extended-text-entry] renderMath() completed');
        console.log('[MATH-DEBUG][extended-text-entry] mjx-container nodes after renderMath:', mathNodesRendered);
      });
    }
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
