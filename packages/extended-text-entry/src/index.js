import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  ModelSetEvent,
  SessionChangedEvent
} from '@pie-framework/pie-player-events';
import debug from 'debug';

const log = debug('@pie-ui:extended-text-entry');

const domParser =
  typeof window !== undefined ? new DOMParser() : { parseFromString: v => v };

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

  set model(m) {
    this._model = m;
    this.dispatchEvent(
      new ModelSetEvent(this.tagName.toLowerCase(), false, !!this._model)
    );

    this.render();
  }

  set session(s) {
    this._session = s;
    this.render();
  }

  get session() {
    return this._session;
  }

  handleChange(value) {
    this._session.value = value;

    this.dispatchEvent(
      new SessionChangedEvent(this.tagName.toLowerCase(), isComplete(value))
    );
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (this._model && this._session) {
      let elem = React.createElement(Main, {
        model: this._model,
        session: this._session,
        onChange: this.handleChange.bind(this)
      });

      ReactDOM.render(elem, this, () => {
        renderMath(this);
      });
    }
  }
}
