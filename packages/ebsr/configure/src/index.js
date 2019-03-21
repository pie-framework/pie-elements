import Main from './main';

export default class EbsrConfigure extends HTMLElement {
  static getMain = ()  => document.querySelector('ebsr-main');

  static defineMain() {
    if (!customElements.get('ebsr-main')) {
      customElements.define('ebsr-main', Main);
    }
  }

  static setModel(m) {
    const main = EbsrConfigure.getMain();
    main.model = m;
  }

  constructor() {
    super();

    EbsrConfigure.defineMain();
  }

  set model(m) {
    this._render();

    EbsrConfigure.setModel(m);
  }

  _render() {
    this.innerHTML = `<ebsr-main></ebsr-main>`;
  }
}
