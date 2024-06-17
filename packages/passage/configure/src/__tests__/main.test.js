import React from 'react';
import { shallow } from 'enzyme';
import { Main } from '../design';
import defaults from '../defaults';
import { InputContainer } from '@pie-lib/pie-toolbox/config-ui';

jest.mock('@pie-lib/pie-toolbox/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    dropdown: jest.fn(),
  },
  InputContainer: (props) => <div {...props}>{props.children}</div>,
}));

describe('Render Main Component', () => {
  let wrapper, instance, onChange;
  let model = defaults.model;
  let configuration = defaults.configuration;

  beforeEach(() => {
    onChange = jest.fn();
    const classes = {
      inputContainer: 'mockInputContainer',
      errorText: 'mockErrorText',
    };

    wrapper = shallow(
        <Main
            classes={classes}
            model={model}
            configuration={configuration}
            onModelChanged={onChange}
            imageSupport={{}}
            uploadSoundSupport={{}}
        />,
    );

    instance = wrapper.instance();
  });

  it('Match Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('logic', () => {
    it('changeTeacherInstructions calls onModelChanged', () => {
      const updatedModel = {
        ...model,
        passages: [
          { ...model.passages[0], teacherInstructions: 'Teacher Instructions' }
        ]
      };
      instance.changeTeacherInstructions('Teacher Instructions', 0);
      expect(onChange).toBeCalledWith(updatedModel);
    });

    it('changeTitle calls onModelChanged', () => {
      const updatedModel = {
        ...model,
        passages: [
          { ...model.passages[0], title: 'New Title' }
        ]
      };
      instance.changeTitle('New Title', 0);
      expect(onChange).toBeCalledWith(updatedModel);
    });

    it('changeSubtitle calls onModelChanged', () => {
      const updatedModel = {
        ...model,
        passages: [
          { ...model.passages[0], subtitle: 'New Subtitle' }
        ]
      };
      instance.changeSubtitle('New Subtitle', 0);
      expect(onChange).toBeCalledWith(updatedModel);
    });

    it('changeAuthor calls onModelChanged', () => {
      const updatedModel = {
        ...model,
        passages: [
          { ...model.passages[0], author: 'New Author' }
        ]
      };
      instance.changeAuthor('New Author', 0);
      expect(onChange).toBeCalledWith(updatedModel);
    });

    it('changeText calls onModelChanged', () => {
      const updatedModel = {
        ...model,
        passages: [
          { ...model.passages[0], text: 'New Text' }
        ]
      };
      instance.changeText('New Text', 0);
      expect(onChange).toBeCalledWith(updatedModel);
    });
  });

  describe('UI Rendering', () => {

    it('renders title input when enabled', () => {
      wrapper.setProps({
        model: { ...model, titleEnabled: true },
        configuration: { ...configuration, title: { label: 'Title' } }
      });
      expect(wrapper.find(InputContainer).at(0).prop('label')).toEqual('Title');
    });

    it('renders subtitle input when enabled', () => {
      wrapper.setProps({
        model: { ...model, subtitleEnabled: true },
        configuration: { ...configuration, subtitle: { label: 'Subtitle' } }
      });
      expect(wrapper.find(InputContainer).at(1).prop('label')).toEqual('Subtitle');
    });

    it('renders author input when enabled', () => {
      wrapper.setProps({
        model: { ...model, authorEnabled: true },
        configuration: { ...configuration, author: { label: 'Author' } }
      });
      expect(wrapper.find(InputContainer).at(2).prop('label')).toEqual('Author');
    });

    it('renders teacher instructions input when enabled', () => {
      wrapper.setProps({
        model: { ...model, teacherInstructionsEnabled: true },
        configuration: {
          ...configuration,
          teacherInstructions: { label: 'Teacher Instructions' }
        }
      });
      expect(wrapper.find(InputContainer).at(3).prop('label')).toEqual('Teacher Instructions');
    });

    it('renders text input when enabled', () => {
      wrapper.setProps({
        model: { ...model, textEnabled: true },
        configuration: { ...configuration, text: { label: 'Text' } }
      });
      expect(wrapper.find(InputContainer).at(4).prop('label')).toEqual('Text');
    });
  });

  describe('Error Handling', () => {
    it('displays teacher instructions error when provided', () => {
      wrapper.setProps({
        model: {
          ...model,
          errors: { teacherInstructions: 'Teacher Instructions is required' },
          teacherInstructionsEnabled: true
        },
        configuration: {
          ...configuration,
          teacherInstructions: { label: 'Teacher Instructions' }
        }
      });
      expect(wrapper.find('.mockErrorText').text()).toEqual('Teacher Instructions is required');
    });

    it('displays title error when provided', () => {
      wrapper.setProps({
        model: {
          ...model,
          errors: { title: 'Title is required' },
          titleEnabled: true
        },
        configuration: { ...configuration, title: { label: 'Title' } }
      });
      expect(wrapper.find('.mockErrorText').at(0).text()).toEqual('Title is required');
    });

    it('displays subtitle error when provided', () => {
      wrapper.setProps({
        model: {
          ...model,
          errors: { subtitle: 'Subtitle is required' },
          subtitleEnabled: true
        },
        configuration: { ...configuration, subtitle: { label: 'Subtitle' } }
      });
      expect(wrapper.find('.mockErrorText').at(0).text()).toEqual('Subtitle is required');
    });

    it('displays author error when provided', () => {
      wrapper.setProps({
        model: {
          ...model,
          errors: { author: 'Author is required' },
          authorEnabled: true
        },
        configuration: { ...configuration, author: { label: 'Author' } }
      });
      expect(wrapper.find('.mockErrorText').at(0).text()).toEqual('Author is required');
    });

    it('displays text error when provided', () => {
      wrapper.setProps({
        model: {
          ...model,
          errors: { text: 'Text is required' },
          textEnabled: true
        },
        configuration: { ...configuration, text: { label: 'Text' } }
      });
      expect(wrapper.find('.mockErrorText').at(0).text()).toEqual('Text is required');
    });
  });
});
