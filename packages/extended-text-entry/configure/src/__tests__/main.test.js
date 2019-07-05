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
  let model = defaults.model;
  let configuration = defaults.configuration;

  beforeEach(() => {
    onChange = jest.fn();
    wrapper = shallow(
      <Main
        classes={{}}
        model={model}
        configuration={configuration}
        onModelChanged={onChange}
        handleBoxResize={() => {}}
      />
    );

    instance = wrapper.instance();
  });

  it('Match Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('logic', () => {
    it('changeWidth calls onModelChanged', () => {
      instance.changeWidth({}, 10);
      expect(onChange).toBeCalledWith(expect.objectContaining({ width: 10 }));
    });

    it('changeHeight call onModelChanged', () => {
      instance.changeHeight({}, 10);
      expect(onChange).toBeCalledWith(expect.objectContaining({ height: 10 }));
    });

    it('changeTeacherInstructions calls onModelChanged', () => {
      instance.changeTeacherInstructions('Teacher Instructions');
      expect(onChange).toBeCalledWith(expect.objectContaining({ teacherInstructions: 'Teacher Instructions' }));
    });
  });
});
