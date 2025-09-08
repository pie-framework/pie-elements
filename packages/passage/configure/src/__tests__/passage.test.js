import React from 'react';
import { shallow } from 'enzyme';
import { PassageComponent } from '../passage';
import { InputContainer } from '@pie-lib/config-ui';
import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: (props) => <div {...props}>{props.children}</div>,
}));

describe('PassageComponent', () => {
  let wrapper, onModelChanged;
  const basePassage = {
    teacherInstructions: '',
    title: '',
    subtitle: '',
    author: '',
    text: '',
  };

  let model = defaults.model;
  let configuration = defaults.configuration;

  const classes = {
    inputContainer: 'mockInputContainer',
    errorText: 'mockErrorText',
  };

  beforeEach(() => {
    onModelChanged = jest.fn();
    wrapper = shallow(
      <PassageComponent
        model={model}
        configuration={configuration}
        onModelChanged={onModelChanged}
        classes={classes}
        imageSupport={{}}
        uploadSoundSupport={{}}
        passageIndex={0}
      />,
    );
  });

  it('renders all input containers when enabled', () => {
    expect(wrapper.find(InputContainer).length).toBe(5); // All 5 enabled
  });

  it('calls onModelChanged when teacherInstructions changes', () => {
    const instance = wrapper.instance();
    instance.handleChange('teacherInstructions', 'New Instructions');

    expect(onModelChanged).toHaveBeenCalledWith({
      ...model,
      passages: [
        {
          ...basePassage,
          teacherInstructions: 'New Instructions',
        },
      ],
    });
  });

  it('calls onModelChanged when title changes', () => {
    wrapper.instance().handleChange('title', 'New Title');

    expect(onModelChanged).toHaveBeenCalledWith({
      ...model,
      passages: [
        {
          ...basePassage,
          title: 'New Title',
        },
      ],
    });
  });

  describe('Error Handling', () => {
    it('displays teacher instructions error when provided', () => {
      wrapper.setProps({
        model: {
          ...model,
          errors: {
            passages: {
              0: { teacherInstructions: 'Teacher Instructions is required' },
            },
          },
          teacherInstructionsEnabled: true,
        },
        configuration: {
          ...configuration,
          teacherInstructions: { label: 'Teacher Instructions' },
        },
      });
      expect(wrapper.find('.mockErrorText').text()).toEqual('Teacher Instructions is required');
    });

    it('displays title error when provided', () => {
      wrapper.setProps({
        model: {
          ...model,
          errors: {
            passages: {
              0: { title: 'Title is required' },
            },
          },
          titleEnabled: true,
        },
        configuration: { ...configuration, title: { label: 'Title' } },
      });
      expect(wrapper.find('.mockErrorText').text()).toEqual('Title is required');
    });

    it('displays subtitle error when provided', () => {
      wrapper.setProps({
        model: {
          ...model,
          errors: {
            passages: {
              0: { subtitle: 'Subtitle is required' },
            },
          },
          subtitleEnabled: true,
        },
        configuration: { ...configuration, subtitle: { label: 'Subtitle' } },
      });
      expect(wrapper.find('.mockErrorText').text()).toEqual('Subtitle is required');
    });

    it('displays author error when provided', () => {
      wrapper.setProps({
        model: {
          ...model,
          errors: {
            passages: {
              0: { author: 'Author is required' },
            },
          },
          authorEnabled: true,
        },
        configuration: { ...configuration, author: { label: 'Author' } },
      });
      expect(wrapper.find('.mockErrorText').text()).toEqual('Author is required');
    });

    it('displays text error when provided', () => {
      wrapper.setProps({
        model: {
          ...model,
          errors: {
            passages: {
              0: { text: 'Text is required' },
            },
          },
          textEnabled: true,
        },
        configuration: { ...configuration, text: { label: 'Text' } },
      });
      expect(wrapper.find('.mockErrorText').at(0).text()).toEqual('Text is required');
    });
  });
});
