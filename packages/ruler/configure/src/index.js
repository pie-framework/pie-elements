export default class RulerConfigure extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = 'configure ruler here ...';
  }
}
