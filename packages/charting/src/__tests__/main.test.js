import * as React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Main } from '../main';

jest.mock('lodash/uniq', () => {
  return () => [];
});

jest.mock('@pie-lib/charting', () => ({
  Chart: (props) => <div data-testid="chart">{props.children}</div>,
  KeyLegend: (props) => <div data-testid="key-legend">{props.children}</div>,
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

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000',
    background: () => '#fff',
  },
  Collapsible: (props) => <div>{props.children}</div>,
  hasText: jest.fn(() => false),
  PreviewPrompt: (props) => <div>{props.children}</div>,
  UiLayout: (props) => <div>{props.children}</div>,
  hasMedia: jest.fn(() => false),
}));

jest.mock('@pie-lib/correct-answer-toggle', () => ({
  __esModule: true,
  default: (props) => <div>{props.children}</div>,
}));

const theme = createTheme();

describe('Main', () => {
  const onAnswersChange = jest.fn();
  const defaultProps = {
    model: {
      backgroundMarks: [],
      correctMarks: [],
      data: [],
    },
    onAnswersChange,
    session: {},
  };

  const renderMain = (props = {}) => {
    const combinedProps = { ...defaultProps, ...props };
    return render(
      <ThemeProvider theme={theme}>
        <Main {...combinedProps} />
      </ThemeProvider>
    );
  };

  describe('render', () => {
    it('renders without crashing', () => {
      const { container } = renderMain();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with categories', () => {
      const props = {
        ...defaultProps,
        model: {
          ...defaultProps.model,
          data: [
            { label: 'A', value: 1 },
            { label: 'B', value: 2 },
          ],
        },
      };
      const { container } = renderMain(props);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Note: Tests for internal methods (changeData) are implementation details
  // and cannot be directly tested with RTL. These should be tested through
  // user interactions in integration tests, or by checking that onAnswersChange
  // is called with correct data when user interacts with the chart.
});
