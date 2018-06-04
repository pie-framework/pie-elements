import { shallow } from 'enzyme';
import React from 'react';

import { Panel } from '../panel';

describe('Panel', () => {
  let w;
  let onToggleEnabled = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {
        panel: 'panel'
      },
      className: 'className',
      title: 'Title',
      enabled: true,
      onToggleEnabled
    };
    const props = { ...defaults, ...extras };
    return shallow(<Panel {...props}>content</Panel>);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {});
});
