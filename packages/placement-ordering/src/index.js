import React from 'react';
import ReactDOM from 'react-dom';
import compact from 'lodash/compact';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import debug from 'debug';
import { renderMath } from '@pie-lib/math-rendering';
import { withDragContext } from '@pie-lib/drag';
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
  constructor() {
    super();
    this.sessionChange = this.sessionChange.bind(this);
  }

  sessionChange(session) {
    this._session.value = session.value;
    this.render();
    this.dispatchEvent(
      new CustomEvent('session-changed', {
        bubbles: true,
        detail: {
          component: this.tagName.toLowerCase(),
          complete:
            this._session && this._session.value && this.isComplete(),
        },
      }),
    );
  }

  isComplete = () => compact(this._session.value).length === this._model.completeLength;

  dispatchSessionChanged = () => {
    this.dispatchEvent(new SessionChangedEvent(this.tagName.toLowerCase(), this.isComplete()));
  }

  verifyIfSessionUpdatesAreNeeded = (newModel) => {
    const { config, choices } = this._model || {};
    const { config: newConfig, choices: newChoices } = newModel || {};
    const session = cloneDeep(this._session);

    // continue ONLY if there is a previous model with config and if there's already a session
    if (!config || !this._session) {
      return;
    }

    const includeTargetsChanged = config?.includeTargets !== newConfig?.includeTargets;
    const choicesChanged = !isEqual(newChoices, choices);


    if (includeTargetsChanged && newConfig?.includeTargets) {
      //  if targets or choices changed, then we can reset the session
      delete session['value'];
    }

    const isValidSess = isValidSession({ model: newModel, session });

    // if the session is not valid anymore, it has to be reset
    if (!newConfig?.includeTargets && (choicesChanged || !isValidSess)) {
      session.value = newModel.choices.map((m) => m.id);
    }

    if (!isEqual(session, this._session)) {
      this.sessionChange(session);
    }
  };

  set model(newModel) {
    this.verifyIfSessionUpdatesAreNeeded(newModel);

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
