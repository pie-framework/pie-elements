import React from 'react';
import ReactDOM from 'react-dom';
import compact from 'lodash/compact';
import debug from 'debug';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import { withDragContext } from '@pie-lib/pie-toolbox/drag';
import { SessionChangedEvent } from '@pie-framework/pie-player-events';
import Main from './main';
import { swap } from './ordering';

const log = debug('pie-elements:placement-ordering');

export { withDragContext, swap };

export const isValidSession = ({ model, session }) => {
  const { config } = model;

  const compactSessionValues = (session && compact(session.value)) || [];
  const completeSession = compactSessionValues.length === model.choices.length;

  // if it includes targets, it doesn't have to contain all the choices selected (eg: only 2 targets were filled)
  // but if it does not include targets, it's a must to have all choices selected
  return config.includeTargets || completeSession;
};

export default class Ordering extends HTMLElement {
  isComplete = (value) => value && compact(value).length === this._model.completeLength;

  sessionChange = (session) => {
    this._session.value = session.value;
    this.render();
    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this._session && this.isComplete(this._session.value)))
  }

  set model(newModel) {
    this._model = newModel;

    this.render();
    this.dispatchEvent(
      new CustomEvent('model-set', {
        bubbles: true,
        detail: {
          complete: false,
        },
      }),
    );
  }

  set session(newSession) {
    this._session = newSession;
    this.render();
  }

  get session() {
    return this._session;
  }

  render() {
    if (this._model && this._session) {
      log('[render] session: ', this._session.value);
      log('[render] model: ', this._model);
      console.log("Andreea this._session.value", this._session.value);

      const element = React.createElement(Main, {
        model: this._model,
        session: this._session,
        onSessionChange: this.sessionChange,
      });

      ReactDOM.render(element, this, () => {
        renderMath(this);
      });
    }
  }
}
