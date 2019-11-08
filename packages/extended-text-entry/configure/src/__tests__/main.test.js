import React from 'react';
import { Main } from '../main';
import { shallow } from 'enzyme';

import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  },
  settings: {
    Panel: props => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    numberFields: jest.fn(),
    dropdown: jest.fn()
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
        imageSupport={{}}
      />
    );

    instance = wrapper.instance();
  });

  it('Match Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('logic', () => {
    it('onPromptChange calls onModelChanged', () => {
      instance.onPromptChange('New Prompt');
      expect(onChange).toBeCalledWith(expect.objectContaining({ prompt: 'New Prompt' }));
    });

    it('changeFeedback calls onModelChanged', () => {
      instance.changeFeedback({ type: 'custom', default: 'Default Feedback' });
      expect(onChange).toBeCalledWith(expect.objectContaining({ feedback: { type: 'custom', default: 'Default Feedback' } }));
    });

    it('changeTeacherInstructions calls onModelChanged', () => {
      instance.changeTeacherInstructions('Teacher Instructions');
      expect(onChange).toBeCalledWith(expect.objectContaining({ teacherInstructions: 'Teacher Instructions' }));
    });
  });
});
