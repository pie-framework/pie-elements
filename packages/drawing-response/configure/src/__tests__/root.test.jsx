import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Root } from '../root';
import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  settings: {
    Panel: (props) => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn(),
  },
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  InputContainer: (props) => <div {...props}>{props.children}</div>,
}));

jest.mock('@pie-lib/editable-html', () => (props) => <div {...props} />);

jest.mock('../image-container', () => (props) => <div data-testid="image-container" {...props} />);

const theme = createTheme();

const model = {
  prompt: 'Test Prompt',
  promptEnabled: true,
  imageUrl: '',
  imageDimensions: {
    height: 100,
    width: 100,
  },
};

describe('Root', () => {
  const onConfigurationChanged = jest.fn();
  const onModelChanged = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderRoot = (props = {}) => {
    const defaultProps = {
      model,
      configuration: defaults.configuration,
      onConfigurationChanged,
      onModelChanged,
      ...props,
    };
    return render(
      <ThemeProvider theme={theme}>
        <Root {...defaultProps} />
      </ThemeProvider>
    );
  };

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = renderRoot();
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('onPromptChanged calls onModelChanged', () => {
      const { container } = renderRoot();
      // Get the Root component instance by finding the component ref
      const rootInstance = container.querySelector('[data-testid]')?.parentElement?.__reactFiber$?.return?.stateNode;

      // Since we can't easily access instance methods in RTL, we'll verify the behavior
      // by checking that the handler is correctly bound
      expect(onModelChanged).not.toHaveBeenCalled();

      // Create a new Root instance to test the method directly
      const testInstance = new Root({ model, onModelChanged, configuration: defaults.configuration, onConfigurationChanged });
      testInstance.onPromptChanged('New Prompt');

      expect(onModelChanged).toHaveBeenCalledWith(expect.objectContaining({ prompt: 'New Prompt' }));
    });

    it('onTeacherInstructionsChanged calls onModelChanged', () => {
      const testInstance = new Root({ model, onModelChanged, configuration: defaults.configuration, onConfigurationChanged });
      testInstance.onTeacherInstructionsChanged('New Teacher Instructions');

      expect(onModelChanged).toHaveBeenCalledWith(
        expect.objectContaining({ teacherInstructions: 'New Teacher Instructions' }),
      );
    });

    it('onUpdateImageDimension calls onModelChanged', () => {
      const testInstance = new Root({ model, onModelChanged, configuration: defaults.configuration, onConfigurationChanged });
      testInstance.onUpdateImageDimension({
        height: 200,
        width: 200,
      });

      expect(onModelChanged).toHaveBeenCalledWith(
        expect.objectContaining({
          imageDimensions: {
            height: 200,
            width: 200,
          },
        }),
      );
    });

    it('onImageUpload calls onModelChanged', () => {
      const testInstance = new Root({ model, onModelChanged, configuration: defaults.configuration, onConfigurationChanged });
      testInstance.onImageUpload('url');

      expect(onModelChanged).toHaveBeenCalledWith(expect.objectContaining({ imageUrl: 'url' }));
    });
  });
});
