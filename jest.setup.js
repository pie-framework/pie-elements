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
