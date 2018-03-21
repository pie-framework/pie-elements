export default class FunctionEntryConfigure extends HTMLElement {

  constructor() {
    super()
  }

  set model(m) {
    this._model = m;
    this.render();
  }

  render() {
    if (!this._model) {
      return;
    }

    this.innerHTML = `<pre>${JSON.stringify(this._model, null, '  ')}</pre>`
  }
} 