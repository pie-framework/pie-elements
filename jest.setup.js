import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

// mock HTML - jsdom doesnt support it.
global.HTMLElement = class HTMLElement {
  dispatchEvent() {}

  constructor() {
    this.querySelector = jest.fn().mockReturnValue(this);
    this.addEventListener = jest.fn();
  }
};

global.CustomEvent = class CustomEvent {};

global.customElements = {
  define: jest.fn(),
  whenDefined: jest.fn().mockResolvedValue(),
  get: jest.fn()
};
// const { JSDOM } = require('@tbranyen/jsdom');
// const window = new JSDOM().window;
// const {
//   HTMLElement,
//   customElements,
//   document,
//   CustomEvent,
//   InputEvent
// } = window;

// console.log('registering JSDOM...');

// global.HTMLElement = HTMLElement;
// global.CustomEvent = CustomEvent;
// global.customElements = customElements;
// global.InputEvent = InputEvent;

// global.document = document;

// const Root = require('../../dist/index.js');

// customElements.define('custom-element', Root);
// document.body.appendChild(new Root());
