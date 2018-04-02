import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';

export default class extends HTMLElement {

  constructor(){
    super();
    this._render();
  }

  set model(s) {
    this._model = s;
    this._render();
  }

  _render() {
    let element = React.createElement(Main, {
      model: this._model
    });
    ReactDOM.render(element, this);
  }

}