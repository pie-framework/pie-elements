import React from 'react';
import { createRoot } from 'react-dom/client';
import debounce from 'lodash/debounce';
import debug from 'debug';

import StimulusTabs from './stimulus-tabs';

const log = debug('pie-element:passage:print');

const checkNullish = (value) => value !== null && value !== undefined;

const isEnabled = (value, defaultValue) => (checkNullish(value) ? value : defaultValue);

const preparePrintPassage = (model, opts) => {
  const isInstructor = opts.role === 'instructor';

  // TODO: also update '../../configure/src/defaults.js' and '../../controller/src/defaults.js' when updating defaultValue
  const teacherInstructionsEnabled = isEnabled(model.teacherInstructionsEnabled, true);
  const titleEnabled = isEnabled(model.titleEnabled, true);
  const authorEnabled = isEnabled(model.authorEnabled, false);
  const subtitleEnabled = isEnabled(model.subtitleEnabled, true);
  const textEnabled = isEnabled(model.textEnabled, true);

  return model.passages.map((passage, index) => ({
    id: index,
    teacherInstructions: isEnabled(passage.teacherInstructionsEnabled, teacherInstructionsEnabled)
      ? (isInstructor && passage.teacherInstructions) || ''
      : '',
    label: passage.title || `Passage ${index + 1}`,
    title: isEnabled(passage.titleEnabled, titleEnabled) ? passage.title || '' : '',
    author: isEnabled(passage.authorEnabled, authorEnabled) ? passage.author || '' : '',
    subtitle: isEnabled(passage.subtitleEnabled, subtitleEnabled) ? passage.subtitle || '' : '',
    text: isEnabled(passage.textEnabled, textEnabled) ? passage.text || '' : '',
  }));
};

export default class PassagePrint extends HTMLElement {
  constructor() {
    super();
    this._model = null;
    this._options = null;
    this._session = [];
    this._root = null;

    this._rerender = debounce(
      () => {
        if (this._model && this._session) {
          if (this._model.passages && this._model.passages.length > 0) {
            const printPassage = preparePrintPassage(this._model, this._options);

            const element = React.createElement(StimulusTabs, {
              disabledTabs: true,
              tabs: printPassage,
            });

            if (!this._root) {
              this._root = createRoot(this);
            }
            this._root.render(element);
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

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}
