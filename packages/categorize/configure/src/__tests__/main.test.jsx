import { shallow } from 'enzyme';
import React from 'react';

import { Main } from '../main';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: props => <div {...props} />
  },
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
  correctResponse: [],
  choices: [],
  categories: []
});

describe('Main', () => {
  let w;
  let onModelChanged = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onModelChanged,
      model: model()
    };
    const props = { ...defaults, ...extras };

    return shallow(<Main {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
