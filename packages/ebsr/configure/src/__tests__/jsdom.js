const { JSDOM } = require('../../node_modules/@tbranyen/jsdom');
const window = (new JSDOM()).window;
const { HTMLElement, customElements, document, CustomEvent, InputEvent } = window;

global.HTMLElement = HTMLElement;
global.CustomEvent = CustomEvent;
global.customElements = customElements;
global.InputEvent = InputEvent;

global.document = document;

const Root = require('../../dist/index.js');

customElements.define('custom-element', Root);
document.body.appendChild(new Root());
