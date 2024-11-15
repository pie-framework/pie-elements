import React from 'react';
import ReactDOM from 'react-dom';

import defaults from '../defaults';

jest.mock('@pie-lib/pie-toolbox/config-ui', () => ({
  settings: {
    Panel: (props) => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
  },
}));
jest.mock('@pie-lib/pie-toolbox/render-ui', () => ({
  color: {
    tertiary: jest.fn(() => '#146EB3'),
  },
}));

const model = () => ({ ...defaults.model });

jest.mock('react-dom', () => ({
  render: jest.fn(),
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
