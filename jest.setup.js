import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

// mock HTML - jsdom doesnt support it.
global.HTMLElement = class HTMLElement {
  dispatchEvent = jest.fn();
  addEventListener = jest.fn();
  querySelector = jest.fn().mockReturnValue(this);
};

global.CustomEvent = class CustomEvent {};

global.customElements = {
  define: jest.fn(),
  whenDefined: jest.fn().mockResolvedValue(),
  get: jest.fn(),
};
