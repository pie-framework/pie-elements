import React from 'react';
import { shallow } from 'enzyme';
import { Main } from '../design';

jest.mock('@pie-lib/pie-toolbox/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div className="mockConfigLayout">{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div className="mockPanel" onClick={props.onChange} />,
    toggle: (label, defaultVal = false) => true,
    dropdown: jest.fn(),
  },
}));

jest.mock('../common', () => ({
  ConfimationDialog: (props) => <div className="mockDialog" {...props} />,
  PassageButton: (props) => (
    <button className="mockPassageButton" onClick={props.onClick}>
      {props.label}
    </button>
  ),
}));

jest.mock('../passage', () => (props) => <div className="mockPassage" {...props} />);

describe('Main Component - Unit Method Tests', () => {
  let wrapper, instance, onModelChanged;

  const basePassage = {
    teacherInstructions: '',
    title: '',
    subtitle: '',
    author: '',
    text: '',
  };

  const baseModel = {
    passages: [basePassage],
    language: 'en',
  };

  const configuration = {
    additionalPassage: { label: 'Additional Passage', settings: true, enabled: true },
    teacherInstructions: { label: 'Teacher Instructions', settings: true },
    title: { label: 'Title', settings: true },
    subtitle: { label: 'Subtitle', settings: true },
    author: { label: 'Author', settings: true },
    text: { label: 'Text', settings: true },
  };

  const props = {
    model: baseModel,
    configuration,
    imageSupport: {},
    uploadSoundSupport: {},
    classes: { additionalPassageHeading: 'heading' },
    onModelChanged: jest.fn(),
    onConfigurationChanged: jest.fn(),
  };

  beforeEach(() => {
    onModelChanged = jest.fn();
    wrapper = shallow(<Main {...props} onModelChanged={onModelChanged} />);
    instance = wrapper.instance();
  });

  it('getInnerText removes HTML tags', () => {
    expect(instance.getInnerText('<p>Test <strong>123</strong></p>')).toBe('Test 123');
    expect(instance.getInnerText('')).toBe('');
    expect(instance.getInnerText(null)).toBe('');
    expect(instance.getInnerText('<img src="x" />')).toBe('');
  });

  it('addAdditionalPassage adds an empty passage and calls onModelChanged', () => {
    instance.addAdditionalPassage();

    expect(onModelChanged).toHaveBeenCalledWith({
      ...baseModel,
      passages: [...baseModel.passages, { teacherInstructions: '', title: '', subtitle: '', author: '', text: '' }],
    });
  });

  it('removeAdditionalPassage calls onDelete directly for empty passage', () => {
    const modelWithTwo = {
      ...baseModel,
      passages: [basePassage, basePassage],
    };

    wrapper.setProps({ model: modelWithTwo });
    instance = wrapper.instance();

    const onDeleteSpy = jest.spyOn(instance, 'onDelete');
    instance.removeAdditionalPassage(1);

    expect(onDeleteSpy).toHaveBeenCalledWith(modelWithTwo, 1, onModelChanged);
  });

  it('removeAdditionalPassage sets dialog state if passage has content', () => {
    const modelWithContent = {
      ...baseModel,
      passages: [basePassage, { ...basePassage, teacherInstructions: '<p>Filled</p>' }],
    };

    wrapper.setProps({ model: modelWithContent });
    instance.removeAdditionalPassage(1);

    expect(wrapper.state()).toEqual({
      showConfirmationDialog: true,
      indexToRemove: 1,
    });
  });

  it('onDelete removes passage at index and resets confirmation state', () => {
    const modelWithTwo = {
      ...baseModel,
      passages: [{ teacherInstructions: 'Keep' }, { teacherInstructions: 'Remove' }],
    };

    wrapper.setProps({ model: modelWithTwo });
    instance.onDelete(modelWithTwo, 1, onModelChanged);

    expect(onModelChanged).toHaveBeenCalledWith({
      ...modelWithTwo,
      passages: [{ teacherInstructions: 'Keep' }],
    });

    expect(wrapper.state()).toEqual({
      showConfirmationDialog: false,
      indexToRemove: -1,
    });
  });
});
