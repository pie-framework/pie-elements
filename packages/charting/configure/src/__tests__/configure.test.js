import * as React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Configure } from '../configure';
import { ChartingConfig } from '../charting-config';
import { CorrectResponse } from '../correct-response';
import defaultValues from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: (props) => <div>{props.children}</div>,
  InputCheckbox: (props) => <div>{props.children}</div>,
  FeedbackConfig: (props) => <div>{props.children}</div>,
  AlertDialog: (props) => <div>{props.children}</div>,
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    numberFields: jest.fn(),
  },
}));

jest.mock('@pie-lib/charting', () => ({
  Chart: (props) => <div data-testid="chart">{props.children}</div>,
  ConfigureChartPanel: (props) => <div data-testid="configure-chart-panel">{props.children}</div>,
  chartTypes: {
    Bar: () => ({
      Component: () => <div />,
      type: 'bar',
    }),
    Histogram: () => ({
      Component: () => <div />,
      type: 'histogram',
    }),
    LineDot: () => ({
      Component: () => <div />,
      type: 'lineDot',
    }),
    LineCross: () => ({
      Component: () => <div />,
      type: 'lineCross',
    }),
    DotPlot: () => ({
      Component: () => <div />,
      type: 'dotPlot',
    }),
    LinePlot: () => ({
      Component: () => <div />,
      type: 'linePlot',
    }),
  },
}));

jest.mock('@pie-lib/editable-html-tip-tap', () => ({
  __esModule: true,
  default: (props) => <div>{props.children}</div>,
}));

const theme = createTheme();

describe('Configure', () => {
  const renderConfigure = (props = {}) => {
    const configureProps = { ...defaultValues, ...props };

    return render(
      <ThemeProvider theme={theme}>
        <Configure {...configureProps} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderConfigure();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with custom model', () => {
      const customModel = {
        ...defaultValues.model,
        chartType: 'histogram',
      };
      const { container } = renderConfigure({ model: customModel });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Note: Tests for internal methods (onRationaleChange, onPromptChange,
  // onTeacherInstructionsChange, onChartTypeChange) are implementation details
  // and cannot be directly tested with RTL. These should be tested through
  // user interactions in integration tests.
});

describe('CorrectResponse', () => {
  const defaultProps = {
    classes: {},
    model: defaultValues.model,
    onChange: jest.fn(),
    tools: [],
  };

  const renderCorrectResponse = (props = {}) => {
    const configureProps = { ...defaultProps, ...props };

    return render(
      <ThemeProvider theme={theme}>
        <CorrectResponse {...configureProps} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderCorrectResponse();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with empty correctAnswer data', () => {
      const model = {
        ...defaultValues.model,
        correctAnswer: {
          data: [],
        },
      };
      const { container } = renderCorrectResponse({ model });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctAnswer data', () => {
      const model = {
        ...defaultValues.model,
        correctAnswer: {
          data: [{ value: 2, label: 'A' }],
        },
      };
      const { container } = renderCorrectResponse({ model });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Note: Tests for internal methods (changeData) are implementation details
  // and cannot be directly tested with RTL. These should be tested through
  // user interactions in integration tests.
});

describe('ChartingConfig', () => {
  const defaultProps = {
    classes: {},
    model: defaultValues.model,
    onChange: jest.fn(),
    tools: [],
  };

  const renderChartingConfig = (props = {}) => {
    const configureProps = { ...defaultProps, ...props };

    return render(
      <ThemeProvider theme={theme}>
        <ChartingConfig {...configureProps} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderChartingConfig();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with data', () => {
      const model = {
        ...defaultValues.model,
        data: [{ value: 2, label: 'A' }],
      };
      const { container } = renderChartingConfig({ model });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Note: Tests for internal methods (changeData) are implementation details
  // and cannot be directly tested with RTL. These should be tested through
  // user interactions in integration tests.
});
