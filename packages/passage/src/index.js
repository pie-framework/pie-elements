import { ModelSetEvent } from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/math-rendering';
import React from 'react';
import { createRoot } from 'react-dom/client';

import StimulusTabs from './stimulus-tabs';

export default class PiePassage extends HTMLElement {
  constructor() {
    super();
    this._model = {
      passages: [],
    };
    this._session = null;
    this._root = null;
    this._mathObserver = null;
    this._mathRenderPending = false;
  }

  setLangAttribute() {
    const language = this._model && typeof this._model.language ? this._model.language : '';
    const lang = language ? language.slice(0, 2) : 'en';
    this.setAttribute('lang', lang);
  }

  _scheduleMathRender = () => {
    if (this._mathRenderPending) return;
    this._mathRenderPending = true;

    requestAnimationFrame(() => {
      if (this._mathObserver) {
        this._mathObserver.disconnect();
      }
      renderMath(this);
      this._mathRenderPending = false;
      setTimeout(() => {
        if (this._mathObserver) {
          this._mathObserver.observe(this, { childList: true, subtree: true });
        }
      }, 50);
    });
  };

  _initMathObserver() {
    if (this._mathObserver) return;
    this._mathObserver = new MutationObserver(this._scheduleMathRender);
    this._mathObserver.observe(this, { childList: true, subtree: true });
  }

  _disconnectMathObserver() {
    if (this._mathObserver) {
      this._mathObserver.disconnect();
      this._mathObserver = null;
    }
  }

  set model(s) {
    this._model = s;
    this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), this._session, !!this._model));
    this.setLangAttribute();

    this._render();
  }

  set session(s) {
    this._session = s;
  }

  connectedCallback() {
    this.setAttribute('aria-label', 'Passage');
    this.setAttribute('role', 'region');
    this._initMathObserver();
    this._render();
  }

  _render() {
    const { passages = [] } = this._model;

    if (this._model.passages.length > 0) {
      const passagesTabs = passages.map((passage, index) => ({
        id: index,
        ...passage,
      }));

      const elem = React.createElement(StimulusTabs, {
        tabs: passagesTabs,
      });

      if (!this._root) {
        this._root = createRoot(this);
      }
      this._root.render(elem);

      this._initMathObserver();
    }
  }

  disconnectedCallback() {
    this._disconnectMathObserver();
    if (this._root) {
      this._root.unmount();
    }
  }
}
