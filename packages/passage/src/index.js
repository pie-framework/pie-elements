import { ModelSetEvent } from '@pie-framework/pie-player-events';
import { renderMath } from '@pie-lib/math-rendering';
import React from 'react';
import { createRoot } from 'react-dom/client';

import StimulusTabs from './stimulus-tabs';

function getBaseHeadingLevel(element) {
  const player =
    element.closest('pie-player') ||
    element.closest('pie-item-player');

  if (player) {
    let raw = player.baseHeadingLevel;

    // fallback in case someone sets via HTML attribute manually
    if (raw == null) {
      raw =
        player.getAttribute('base-heading-level') ??
        player.getAttribute('baseheadinglevel');
    }

    const playerLevel = parseInt(raw, 10);

    if (Number.isFinite(playerLevel) && playerLevel >= 1 && playerLevel <= 6) {
      return playerLevel;
    }
  }

  return undefined;
}

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
    this._playerObserver = null;
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
    this._initPlayerObserver();
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
        model: this._model,
        baseHeadingLevel: getBaseHeadingLevel(this),
      });

      if (!this._root) {
        this._root = createRoot(this);
      }
      this._root.render(elem);

      this._initMathObserver();
    }
  }

  _initPlayerObserver() {
    const player = this.closest('pie-player') || this.closest('pie-item-player');
    if (!player) return;

    this._playerObserver = new MutationObserver(() => {
      this._render();
    });
    this._playerObserver.observe(player, { attributes: true, attributeFilter: ['base-heading-level'] });
  }

  _disconnectPlayerObserver() {
    if (this._playerObserver) {
      this._playerObserver.disconnect();
      this._playerObserver = null;
    }
  }

  disconnectedCallback() {
    this._disconnectMathObserver();
    this._disconnectPlayerObserver();
    if (this._root) {
      this._root.unmount();
      this._root = null;
    }
  }
}
