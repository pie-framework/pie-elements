import React from 'react';
import { Main } from '../main';
import { shallow } from 'enzyme';

import {
  layout,
  settings,
} from '@pie-lib/config-ui';

import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  },
  settings: {
    Panel: props => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn()
  }
}));

describe('Render Main Component', () => {
  let wrapper, instance, onChange;
  let model = defaults;

  beforeEach(() => {
    onChange = jest.fn();
    wrapper = shallow(
      <Main
        classes={{}}
        model={model}
        onChange={onChange}
        handleBoxResize={() => {}}
      />
    );

    instance = wrapper.instance();
  });

  it('Match Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('logic', () => {
    it('changeWidth calls onChange', () => {
      instance.changeWidth({}, 10);
      expect(onChange).toBeCalledWith(expect.objectContaining({ width: 10 }));
    });

    it('changeHeight call onChange', () => {
      instance.changeHeight({}, 10);
      console.log(onChange.mock.calls[0]);
      expect(onChange).toBeCalledWith(expect.objectContaining({ height: 10 }));
    });
  });
});
