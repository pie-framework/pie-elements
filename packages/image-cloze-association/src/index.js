import React from 'react';
import ReactDOM from 'react-dom';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering-accessible';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';

import ImageClozeAssociationComponent from './root';

export default class ImageClozeAssociation extends HTMLElement {
  set model(m) {
    this._model = m;

    this.dispatchEvent(new ModelSetEvent(this.tagName.toLowerCase(), this.isComplete(), !!this._model));
    this._render();
  }

  isComplete() {
    if (!this._session || !this._session.answers) {
      return false;
    }

    if (!Array.isArray(this._session.answers)) {
      return false;
    }

    return Array.isArray(this._session.answers) && this._session.answers.length > 0;
  }

  set session(s) {
    if (s && !s.answers) {
      s.answers = [];
    }

    this._session = s;
    this._render();
  }

  get session() {
    return this._session;
  }

  updateAnswer(data) {
    this._session.answers = data;

    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete()));

    this._render();
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (this._model && this._session) {
      const el = React.createElement(ImageClozeAssociationComponent, {
        model: this._model,
        session: this._session,
        updateAnswer: this.updateAnswer.bind(this),
      });

      ReactDOM.render(el, this, () => {
        renderMath(this);
      });
    }
  }
}
