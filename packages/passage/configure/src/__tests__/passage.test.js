import React from 'react';
import { render } from '@testing-library/react';
import { PassageComponent } from '../passage';
import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: (props) => <div data-testid="input-container" {...props}>{props.children}</div>,
}));

jest.mock('@pie-lib/editable-html-tip-tap', () => (props) => (
  <div data-testid="editable-html" onChange={props.onChange}>
    {props.markup}
  </div>
));

describe('PassageComponent', () => {
  let onModelChanged;
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

  const createInstance = (props = {}) => {
    const defaultProps = {
      model,
      configuration,
      onModelChanged: jest.fn(),
      classes,
      imageSupport: {},
      uploadSoundSupport: {},
      passageIndex: 0,
    };
    const mergedProps = { ...defaultProps, ...props };
    const instance = new PassageComponent(mergedProps);
    return instance;
  };

  beforeEach(() => {
    onModelChanged = jest.fn();
  });

  it('renders all input containers when enabled', () => {
    const { container } = render(
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
    const inputContainers = container.querySelectorAll('[data-testid="input-container"]');
    expect(inputContainers.length).toBe(5); // All 5 enabled
  });

  it('calls onModelChanged when teacherInstructions changes', () => {
    const instance = createInstance({ onModelChanged });
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
    const instance = createInstance({ onModelChanged });
    instance.handleChange('title', 'New Title');

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
      const modelWithError = {
        ...model,
        errors: {
          passages: {
            0: { teacherInstructions: 'Teacher Instructions is required' },
          },
        },
        teacherInstructionsEnabled: true,
      };
      const configWithLabel = {
        ...configuration,
        teacherInstructions: { label: 'Teacher Instructions' },
      };

      const { getByText } = render(
        <PassageComponent
          model={modelWithError}
          configuration={configWithLabel}
          onModelChanged={onModelChanged}
          classes={classes}
          imageSupport={{}}
          uploadSoundSupport={{}}
          passageIndex={0}
        />,
      );

      expect(getByText('Teacher Instructions is required')).toBeInTheDocument();
    });

    it('displays title error when provided', () => {
      const modelWithError = {
        ...model,
        errors: {
          passages: {
            0: { title: 'Title is required' },
          },
        },
        titleEnabled: true,
      };
      const configWithLabel = { ...configuration, title: { label: 'Title' } };

      const { getByText } = render(
        <PassageComponent
          model={modelWithError}
          configuration={configWithLabel}
          onModelChanged={onModelChanged}
          classes={classes}
          imageSupport={{}}
          uploadSoundSupport={{}}
          passageIndex={0}
        />,
      );

      expect(getByText('Title is required')).toBeInTheDocument();
    });

    it('displays subtitle error when provided', () => {
      const modelWithError = {
        ...model,
        errors: {
          passages: {
            0: { subtitle: 'Subtitle is required' },
          },
        },
        subtitleEnabled: true,
      };
      const configWithLabel = { ...configuration, subtitle: { label: 'Subtitle' } };

      const { getByText } = render(
        <PassageComponent
          model={modelWithError}
          configuration={configWithLabel}
          onModelChanged={onModelChanged}
          classes={classes}
          imageSupport={{}}
          uploadSoundSupport={{}}
          passageIndex={0}
        />,
      );

      expect(getByText('Subtitle is required')).toBeInTheDocument();
    });

    it('displays author error when provided', () => {
      const modelWithError = {
        ...model,
        errors: {
          passages: {
            0: { author: 'Author is required' },
          },
        },
        authorEnabled: true,
      };
      const configWithLabel = { ...configuration, author: { label: 'Author' } };

      const { getByText } = render(
        <PassageComponent
          model={modelWithError}
          configuration={configWithLabel}
          onModelChanged={onModelChanged}
          classes={classes}
          imageSupport={{}}
          uploadSoundSupport={{}}
          passageIndex={0}
        />,
      );

      expect(getByText('Author is required')).toBeInTheDocument();
    });

    it('displays text error when provided', () => {
      const modelWithError = {
        ...model,
        errors: {
          passages: {
            0: { text: 'Text is required' },
          },
        },
        textEnabled: true,
      };
      const configWithLabel = { ...configuration, text: { label: 'Text' } };

      const { getByText } = render(
        <PassageComponent
          model={modelWithError}
          configuration={configWithLabel}
          onModelChanged={onModelChanged}
          classes={classes}
          imageSupport={{}}
          uploadSoundSupport={{}}
          passageIndex={0}
        />,
      );

      expect(getByText('Text is required')).toBeInTheDocument();
    });
  });
});
