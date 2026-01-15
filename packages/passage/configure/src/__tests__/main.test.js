import React from 'react';
import { render } from '@testing-library/react';
import { Main } from '../design';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div data-testid="config-layout">{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div data-testid="settings-panel" onClick={props.onChange} />,
    toggle: (label, defaultVal = false) => true,
    dropdown: jest.fn(),
  },
}));

jest.mock('../common', () => ({
  ConfirmationDialog: (props) => <div data-testid="confirmation-dialog" {...props} />,
  PassageButton: (props) => (
    <button data-testid="passage-button" onClick={props.onClick}>
      {props.label}
    </button>
  ),
}));

jest.mock('../passage', () => (props) => <div data-testid="passage" {...props} />);

describe('Main Component - Unit Method Tests', () => {
  let onModelChanged;

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

  const defaultProps = {
    model: baseModel,
    configuration,
    imageSupport: {},
    uploadSoundSupport: {},
    classes: { additionalPassageHeading: 'heading' },
    onModelChanged: jest.fn(),
    onConfigurationChanged: jest.fn(),
  };

  const createInstance = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };
    const instance = new Main(mergedProps);
    instance.setState = jest.fn((state, callback) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
      if (callback) callback();
    });
    return instance;
  };

  beforeEach(() => {
    onModelChanged = jest.fn();
  });

  it('getInnerText removes HTML tags', () => {
    const instance = createInstance();
    expect(instance.getInnerText('<p>Test <strong>123</strong></p>')).toBe('Test 123');
    expect(instance.getInnerText('')).toBe('');
    expect(instance.getInnerText(null)).toBe('');
    expect(instance.getInnerText('<img src="x" />')).toBe('');
  });

  it('addAdditionalPassage adds an empty passage and calls onModelChanged', () => {
    const instance = createInstance({ onModelChanged });
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

    const instance = createInstance({ model: modelWithTwo, onModelChanged });
    const onDeleteSpy = jest.spyOn(instance, 'onDelete');

    instance.removeAdditionalPassage(1);

    expect(onDeleteSpy).toHaveBeenCalledWith(modelWithTwo, 1, onModelChanged);
  });

  it('removeAdditionalPassage sets dialog state if passage has content', () => {
    const modelWithContent = {
      ...baseModel,
      passages: [basePassage, { ...basePassage, teacherInstructions: '<p>Filled</p>' }],
    };

    const instance = createInstance({ model: modelWithContent });
    instance.removeAdditionalPassage(1);

    expect(instance.state).toEqual({
      showConfirmationDialog: true,
      indexToRemove: 1,
    });
  });

  it('onDelete removes passage at index and resets confirmation state', () => {
    const modelWithTwo = {
      ...baseModel,
      passages: [{ teacherInstructions: 'Keep' }, { teacherInstructions: 'Remove' }],
    };

    const instance = createInstance({ model: modelWithTwo, onModelChanged });
    instance.onDelete(modelWithTwo, 1, onModelChanged);

    expect(onModelChanged).toHaveBeenCalledWith({
      ...modelWithTwo,
      passages: [{ teacherInstructions: 'Keep' }],
    });

    expect(instance.state).toEqual({
      showConfirmationDialog: false,
      indexToRemove: -1,
    });
  });
});
