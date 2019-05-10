import { shallow } from 'enzyme';
import React from 'react';

import { Main } from '../main';

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

  describe('logic', () => {
    describe('changeScoring', () => {
      w = wrapper();
      w.instance().changeScoring({ update: true });
      expect(onModelChanged).toBeCalledWith(
        expect.objectContaining({ scoring: { update: true } })
      );
    });
  });
});
