import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Design } from '../design';
import defaultValues from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
  },
}));

jest.mock('lodash/debounce', () => (fn) => fn);

const theme = createTheme();

describe('design', () => {
  let onChange;
  let onChangeConfig;

  const getModel = () => ({
    tokens: [],
  });

  beforeEach(() => {
    onChange = jest.fn();
    onChangeConfig = jest.fn();
  });

  const renderDesign = (model = getModel(), config = defaultValues.configuration) => {
    return render(
      <ThemeProvider theme={theme}>
        <Design
          model={model}
          configuration={config}
          classes={{}}
          className={'foo'}
          onModelChanged={onChange}
          onConfigurationChanged={onChangeConfig}
        />
      </ThemeProvider>
    );
  };

  describe('snapshot', () => {
    it('renders all items with defaultProps', () => {
      const { container } = renderDesign();
      expect(container).toMatchSnapshot();
    });

    it('tokenizer renders with html entities', () => {
      const model = {
        text: '<p>&#8220;Lucy?&#63; Are you using your time wisely to plan your project?&#33;&#33;&#33;&#8221; Mr. Wilson asked.</p><p>Lucy looked a little confused at first. &#195; Then she grinned and proudly stated, &#8220;Why, yes I am! I plan to make a bird feeder for that tree out our window!&#8221;</p>',
        tokens: [],
      };
      const { container } = renderDesign(model);
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('changePrompt', () => {
      it('onPromptChanged ["New Prompt"] => {"tokens":[],"prompt":"New Prompt"}', () => {
        const { container } = renderDesign();
        // Get the component instance - find the Design component and call its method directly
        // In RTL, we test behavior, not implementation, but since we need to test the method directly:
        const designInstance = new Design({
          model: getModel(),
          configuration: defaultValues.configuration,
          onModelChanged: onChange,
          onConfigurationChanged: onChangeConfig,
        });

        designInstance.onPromptChanged('New Prompt');

        expect(onChange).toBeCalledWith({
          tokens: [],
          prompt: 'New Prompt',
        });
      });
    });
  });
});
