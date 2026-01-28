import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Main } from '../main';

import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
}));

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    tertiary: jest.fn(() => '#146EB3'),
    text: jest.fn(() => '#000000'),
    background: jest.fn(() => '#ffffff'),
    primaryLight: jest.fn(() => '#e3f2fd'),
    primary: jest.fn(() => '#1976d2'),
    disabled: jest.fn(() => '#999999'),
    correct: jest.fn(() => '#00c853'),
    incorrect: jest.fn(() => '#d32f2f'),
  },
}));

jest.mock('@pie-lib/rubric', () => ({
  RUBRIC_TYPES: {
    SIMPLE_RUBRIC: 'simpleRubric',
    MULTI_TRAIT_RUBRIC: 'multiTraitRubric',
    RUBRICLESS: 'rubricless',
  },
}));

const theme = createTheme();

const model = (extras) => ({
  id: '1',
  element: 'complex-rubric',
  ...defaults.model,
  ...extras,
});

describe('Main', () => {
  const onModelChanged = jest.fn();
  const onConfigurationChanged = jest.fn();

  const renderMain = (extras) => {
    const defaultProps = {
      onModelChanged,
      onConfigurationChanged,
      classes: {},
      model: model(extras),
      configuration: {
        rubricOptions: ['simpleRubric', 'multiTraitRubric', 'rubricless'],
        multiTraitRubric: {
          width: 600,
          showStandards: {
            settings: false,
            label: 'Show Standards',
            enabled: false,
          },
          showExcludeZero: {
            settings: true,
            label: 'Exclude Zero',
            enabled: false,
          },
          showScorePointLabels: {
            settings: true,
            label: 'Show Score Point Labels',
            enabled: false,
          },
          showLevelTagInput: {
            settings: true,
            label: 'Show Level Tag Input',
            enabled: false,
          },
          showDescription: {
            settings: true,
            label: 'Show Description',
            enabled: false,
          },
          showVisibleToStudent: {
            settings: true,
            label: 'Visible to Student',
            enabled: false,
          },
          showHalfScoring: {
            settings: true,
            label: 'Half Scoring',
            enabled: false,
          },
          dragAndDrop: {
            settings: false,
            label: 'Enable Drag and Drop',
            enabled: false,
          },
        },
      },
      canUpdateModel: true,
    };

    return render(
      <ThemeProvider theme={theme}>
        <Main {...defaultProps} />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    onModelChanged.mockClear();
    onConfigurationChanged.mockClear();
  });

  describe('render', () => {
    it('renders without crashing', () => {
      const { container } = renderMain();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with simple rubric', () => {
      const { container } = renderMain({ rubricType: 'simpleRubric' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with multi trait rubric', () => {
      const { container } = renderMain({ rubricType: 'multiTraitRubric' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with rubricless', () => {
      const { container } = renderMain({ rubricType: 'rubricless' });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Note: Tests for internal methods (onChangeRubricType) are implementation details
  // and cannot be directly tested with RTL. These should be tested through
  // user interactions with radio buttons in integration tests.
});
