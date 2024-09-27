import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import debug from 'debug';

import StimulusTabs from './stimulus-tabs';

const log = debug('pie-element:passage:print');

const preparePrintPassage = (model, opts) => {
  const isInstructor = opts.role === 'instructor';

  return model.passages.map((passage, index) => ({
    id: index,
    teacherInstructions: model.teacherInstructionsEnabled ? (isInstructor && passage.teacherInstructions) || '' : '',
    label: passage.title || `Passage ${index + 1}`,
    title: model.titleEnabled ? passage.title || '' : '',
    author: model.authorEnabled ? passage.author || '' : '',
    subtitle: model.subtitleEnabled ? passage.subtitle || '' : '',
    text: (model.textEnabled ?? true) ? passage.text || '' : '',
  }));
};

export default class PassagePrint extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._options = null;
    this._session = [];

    this._rerender = debounce(
      () => {
        if (this._model && this._session) {
          if (this._model.passages && this._model.passages.length > 0) {
            const printPassage = preparePrintPassage(this._model, this._options);

            const element = React.createElement(StimulusTabs, {
              disabledTabs: true,
              tabs: printPassage,
            });

            ReactDOM.render(element, this);
          }
        } else {
          log('skip');
        }
      },
      50,
      { leading: false, trailing: true },
    );
  }

  set model(s) {
    this._model = s;
    this._rerender();
  }

  set options(o) {
    this._options = o;
  }

  connectedCallback() {}
}
