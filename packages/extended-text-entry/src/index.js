import Main from './main';
import React from 'react';
import { createRoot } from 'react-dom/client';
import debug from 'debug';
import { debounce } from 'lodash-es';

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

    // The session is written synchronously on commit and only the dispatch is
    // deferred, so any layer that reads `this._session` sees the response as
    // soon as the editor commits it. Debouncing the write instead left the
    // session stale until the timer fired, which is what made the response
    // unrecoverable when the element was torn down inside the window.
    //
    // One debouncer per session field, so each keeps its own `complete`.
    this._dispatchValueChanged = debounce(() => {
      this.dispatchEvent(
        new SessionChangedEvent(this.tagName.toLowerCase(), isComplete(this._session && this._session.value)),
      );
    }, 1500);

    this._dispatchCommentChanged = debounce(() => {
      this.dispatchEvent(
        new SessionChangedEvent(this.tagName.toLowerCase(), isComplete(this._session && this._session.comment)),
      );
    }, 1500);
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

    this._dispatchValueChanged();

    this.render();
  }

  annotationsChange(annotations) {
    this._session.annotations = annotations;

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), true));

    this.render();
  }

  commentChange(comment) {
    this._session.comment = comment;

    this._dispatchCommentChanged();

    this.render();
  }

  /**
   * Dispatch every deferred `session-changed` now.
   *
   * A player calls this before it discards the element, while the element is
   * still attached and the event can therefore still reach a `document`-level
   * listener. A no-op when nothing is pending, so a teardown adds no event in
   * the normal path.
   */
  commitPendingSession() {
    this._dispatchValueChanged.flush();
    this._dispatchCommentChanged.flush();
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

      if (!this._root) {
        this._root = createRoot(this);
      }
      this._root.render(elem);
      queueMicrotask(() => {
        renderMath(this);
      });
    }
  }

  disconnectedCallback() {
    // For a host on a player with no commit seam. This runs after removal, so
    // the event reaches a listener bound inside the removed subtree and not one
    // on `document`; `commitPendingSession()` is the path that reaches both.
    this.commitPendingSession();

    if (this._root) {
      this._root.unmount();
      this._root = null;
    }
  }
}
