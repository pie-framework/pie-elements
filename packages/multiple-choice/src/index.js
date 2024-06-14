import Main from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import debug from 'debug';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering-accessible';
import { updateSessionValue } from './session-updater';

const log = debug('pie-ui:multiple-choice');

export const isComplete = (session) => !!(session && session.value && session.value.length);

export default class MultipleChoice extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = null;

    this._rerender = debounce(
      () => {
        if (this._model && this._session) {
          var element = React.createElement(Main, {
            model: this._model,
            session: this._session,
            onChoiceChanged: this._onChange.bind(this),
          });

          //TODO: aria-label is set in the _rerender because we need to change it when the model.choiceMode is updated. Consider revisiting the placement of the aria-label setting in the _rerender
          this.setAttribute(
            'aria-label',
            this._model.choiceMode === 'radio' ? 'Multiple Choice Question' : 'Multiple Correct Answer Question',
          );
          this.setAttribute('role', 'region');

          this.setLangAttribute();

          ReactDOM.render(element, this, () => {
            log('render complete - render math');
            renderMath(this);
          });
        } else {
          log('skip');
        }
      },
      50,
      { leading: false, trailing: true },
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
          }),
        );
      },
      50,
      { leading: false, trailing: true },
    );
  }

  setLangAttribute() {
    const language = this._model && typeof this._model.language ? this._model.language : '';
    const lang = language ? language.slice(0, 2) : 'en';
    this.setAttribute('lang', lang);
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

  _onChange(data) {
    updateSessionValue(this._session, this._model.choiceMode, data);
    this._dispatchResponseChanged();
    this._rerender();
  }

  connectedCallback() {
    this._rerender();
  }
}
