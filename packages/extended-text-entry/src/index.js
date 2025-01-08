import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
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
    this.setAttribute('aria-label', 'Written Response Question');
    this.setAttribute('role', 'region');

    this.render();
  }

  render() {
    if (this._model && this._session) {
      let elem = React.createElement(Main, {
        model: this._model,
        session: this._session,
        onValueChange: this.valueChange.bind(this),
        onAnnotationsChange: this.annotationsChange.bind(this),
        onCommentChange: this.commentChange.bind(this),
      });

      this.setLangAttribute();

      ReactDOM.render(elem, this, () => {
        renderMath(this);
      });
    }
  }
}
