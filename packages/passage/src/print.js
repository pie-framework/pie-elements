import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import StimulusTabs from './stimulus-tabs';
import debug from 'debug';

const log = debug('pie-element:passage:print');

const preparePrintPassage = model =>
  model.passages.map((passage, index) => {
    return {
      id: index,
      title: passage.title,
      text: passage.text,
      disabledTabs: true
    };
  });

export default class PassagePrint extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._session = [];

    this._rerender = debounce(
      () => {
        if (this._model && this._session) {
          if (this._model.passages && this._model.passages.length > 0) {
            const printPassage = preparePrintPassage(this._model);

            const element = React.createElement(StimulusTabs, { tabs: printPassage });

            ReactDOM.render(element, this);
          }
        } else {
          log('skip');
        }
      },
      50,
      { leading: false, trailing: true }
    );
  }

  set model(s) {
    this._model = s;
    this._rerender();
  }

  connectedCallback() {}
}
