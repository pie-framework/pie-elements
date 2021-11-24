import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import debug from 'debug';
import { renderMath } from '@pie-lib/math-rendering';
import { updateSessionValue } from './session-updater';
import { CorrectAnswerToggle } from '@pie-lib/correct-answer-toggle';

const log = debug('pie-ui:multiple-choice');

export const isComplete = (session) =>
  !!(session && session.value && session.value.length);

export default class MultipleChoice extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = null;
    this._strikethrough = { on: false, enabled: false };

    this._rerender = debounce(
      () => {
        if (this._model && this._session) {
          log('render...', this._strikethrough);

          const element = React.createElement(Main, {
            model: {
              ...this._model,
              tools: { strikethrough: this._strikethrough },
            },
            session: this._session,
            onChoiceChanged: this._onChange.bind(this),
          });
          ReactDOM.render(element, this, () => {
            log('render complete - render math');
            renderMath(this);
          });
        } else {
          log('skip');
        }
      },
      50,
      { leading: false, trailing: true }
    );

    this._dispatchResponseChanged = debounce(() => {
      var event = new CustomEvent('session-changed', {
        bubbles: true,
        composed: true,
        detail: {
          complete: isComplete(this._session),
          component: this.tagName.toLowerCase(),
        },
      });

      this.dispatchEvent(event);
    });

    this._dispatchModelSet = debounce(
      () => {
        this.dispatchEvent(
          new CustomEvent('model-set', {
            bubbles: true,
            composed: true,
            detail: {
              complete: isComplete(this._session),
              component: this.tagName.toLowerCase(),
              hasModel: this._model !== undefined,
            },
          })
        );
      },
      50,
      { leading: false, trailing: true }
    );
  }

  set model(s) {
    this._model = s;
    this._rerender();
    this._dispatchModelSet();
  }

  get session() {
    return this._session;
  }

  set session(s) {
    this._session = s;
    this._rerender();
    //TODO: remove this session-changed should only be emit on user change
    this._dispatchResponseChanged();
  }

  /**
   * type Strikethrough = {
   *   // user has turned it on so can toggle any choice to be an ST or not
   *   on: boolean,
   *   // the context has enabled it
   *   // don't show any strikethrough if false
   *   enabled: boolean
   * }
   */
  set strikethrough(opts) {
    this._strikethrough = { on: false, enabled: false, ...opts };
    this._rerender();
  }

  _onChange(data) {
    if (this._strikethroughEnabled) {
      this._session.strikethrough = this._session.strikethrough || [];
      const i = this._session.strikethrough.indexOf(data.value);
      if (i >= 0) {
        this._session.strikethrough.splice(i, 1);
      } else {
        this._session.strikethrough.push(data.value);
      }
    } else {
      updateSessionValue(this._session, this._model.choiceMode, data);
    }
    this._dispatchResponseChanged();
    this._rerender();
  }

  disconnectedCallback() {
    this.dispatchEvent(
      new CustomEvent('deregister-strikethrough-handler', {
        bubbles: true,
        detail: { handler: this },
      })
    );
  }

  connectedCallback() {
    this._rerender();

    this.dispatchEvent(
      new CustomEvent('register-strikethrough-handler', {
        bubbles: true,
        detail: { handler: this },
      })
    );
  }
}
