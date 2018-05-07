import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';

export default class extends HTMLElement {
    constructor() {
        super();
        this.onModelChanged = this.onModelChanged.bind(this);
    }

    set model(s) {
        this._model = utils.normalizeChoices(s);
        this._render();
    }

    dispatchModelUpdated() {
        this.dispatchEvent(new ModelUpdatedEvent(this._model, false));
    }

    onModelChanged(m) {
        this._model = m;
        this.dispatchModelUpdated();
    }

    _render() {
        let element = React.createElement(Main, {
            model: this._model,
            onModelChanged: this.onModelChanged
        });
        ReactDOM.render(element, this);
    }
}