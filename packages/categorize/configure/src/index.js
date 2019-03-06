import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import {
  ModelUpdatedEvent,
  DeleteImageEvent,
  InsertImageEvent
} from '@pie-framework/pie-configure-events';

export default class CategorizeConfigure extends HTMLElement {
  static prepareModelObject = (model = {}) => {
    const sensibleDefaults = {
      choices: [
        {
          id: '0',
          content: '<span mathjax="" data-latex="">420\\text{ cm}=4.2\\text{ meters}</span>'
        },
        {
          id: '1',
          content: '<span mathjax="" data-latex="" data-raw="3.4\\text{ kg}=350\\text{ g}">3.4\\text{ kg}=340\\text{ g}</span>'
        },
      ],
      categories: [
        {
          id: '0',
          label: 'Equivalent',
          choices: [
            {
              id: '0',
              content: '<span mathjax="" data-latex="">420\\text{ cm}=4.2\\text{ meters}</span>'
            },
          ]
        },
        {
          id: '1',
          label: '<b>NOT </b>equivalent',
          choices: [
            {
              id: '1',
              content: '<span mathjax="" data-latex="">3.4\\text{ kg}=340\\text{ g}</span>'
            },
          ]
        }
      ],
      correctResponse: [
        {
          category: '0',
          choices: ['0']
        },
        {
          category: '1',
          choices: ['1']
        }
      ],
      config: {
        choices: {
          columns: 2,
          position: 'below',
        },
        categories: {
          columns: 2
        }
      }
    };

    return {
      ...sensibleDefaults,
      ...model,
    };
  };

  set model(m) {
    this._model = CategorizeConfigure.prepareModelObject(m);
    this.render();
  }

  onChange(m) {
    this._model = m;

    this.dispatchEvent(new ModelUpdatedEvent(this._model, true));
  }

  connectedCallback() {}

  /**
   *
   * @param {done, progress, file} handler
   */
  insertImage(handler) {
    this.dispatchEvent(new InsertImageEvent(handler));
  }

  onDeleteImage(src, done) {
    this.dispatchEvent(new DeleteImageEvent(src, done));
  }

  render() {
    const el = React.createElement(Main, {
      model: this._model,
      onChange: this.onChange.bind(this),
      imageSupport: {
        add: this.insertImage.bind(this),
        delete: this.onDeleteImage.bind(this)
      }
    });
    ReactDOM.render(el, this);
  }
}
