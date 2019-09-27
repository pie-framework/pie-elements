import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn()
  },
  settings: {
    Panel: props => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn()
  }
}));

const model = () => ({
  promptEnabled: true,
  prompt: 'This is the question prompt',
  imageUrl: '',
  imageDimensions: {
    height: 0,
    width: 0
  }
});

jest.mock('react-dom', () => ({
  render: jest.fn()
}));

describe('index', () => {
  let Def;
  let el;
  let onModelChanged = jest.fn();
  let initialModel = model();

  beforeAll(() => {
    Def = require('../index').default;
  });

  beforeEach(() => {
    el = new Def();
    el.model = initialModel;
    el.onModelChanged = onModelChanged;
  });

  describe('set model', () => {
    it('calls ReactDOM.render', () => {
      expect(ReactDOM.render).toHaveBeenCalled();
    });
  });
});
