import * as React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Tools, CorrectResponse } from '../correct-response';
import defaultValues from '../defaults';

jest.mock('@pie-lib/graphing', () => {
  const React = require('react');
  return {
    GraphContainer: (props) => React.createElement('div', { 'data-testid': 'graph-container', ...props }),
  };
});

jest.mock('@pie-lib/config-ui', () => {
  const React = require('react');
  return {
    AlertDialog: (props) => React.createElement('div', { 'data-testid': 'alert-dialog', ...props }),
  };
});

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));

const theme = createTheme();

describe('CorrectResponse', () => {
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange: jest.fn(),
      tools: [],
    };
  });

  describe('logic', () => {
    it('changeMarks calls onChange', () => {
      const onChange = jest.fn();
      const testInstance = new CorrectResponse({ ...props, onChange });
      const marks = [{ x: 1, y: 1, type: 'point' }];

      testInstance.changeMarks('alternateTest', marks);

      expect(onChange).toBeCalledWith({
        ...defaultValues.model,
        answers: {
          ...defaultValues.model.answers,
          alternateTest: {
            marks,
          },
        },
      });
    });

    it('changeToolbarTools calls onChange', () => {
      const onChange = jest.fn();
      const testInstance = new CorrectResponse({ ...props, onChange });

      testInstance.changeToolbarTools([]);

      expect(testInstance.props.model.toolbarTools).toEqual([]);
      expect(onChange).toHaveBeenCalledWith({
        ...defaultValues.model,
        toolbarTools: [],
      });
    });
  });

  it('toggleToolBarTool calls onChange', () => {
    const onChange = jest.fn();
    const testInstance = new CorrectResponse({ ...props, onChange });

    testInstance.toggleToolBarTool('point');

    expect(onChange).toHaveBeenCalledWith({ ...defaultValues.model, toolbarTools: ['point'] });
  });

  it('addAlternateResponse calls onChange', () => {
    const onChange = jest.fn();
    const testInstance = new CorrectResponse({ ...props, onChange });

    testInstance.addAlternateResponse();

    const answers = testInstance.props.model.answers;

    answers.alternate1 = { marks: [], name: 'Alternate 1' };

    expect(testInstance.props.model.answers).toEqual(answers);
    expect(onChange).toHaveBeenCalledWith({ ...defaultValues.model, answers });
  });
});

describe('CorrectResponse: if answers is null it should still work as expected', () => {
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: { ...defaultValues.model, answers: null },
      onChange: jest.fn(),
      tools: [],
    };
  });

  const renderCorrectResponse = (newProps = {}) => {
    const configureProps = { ...props, ...newProps };

    return render(
      <ThemeProvider theme={theme}>
        <CorrectResponse {...configureProps} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('snapshot', () => {
      const { container} = renderCorrectResponse();
      // // expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('changeMarks calls onChange', () => {
      const onChange = jest.fn();
      const testInstance = new CorrectResponse({ ...props, onChange });
      const marks = [{ x: 1, y: 1, type: 'point' }];

      testInstance.changeMarks('alternateTest', marks);

      expect(onChange).toBeCalledWith({
        ...props.model,
        answers: {
          alternateTest: {
            marks,
          },
        },
      });
    });

    it('changeToolbarTools calls onChange', () => {
      const onChange = jest.fn();
      const testInstance = new CorrectResponse({ ...props, onChange });

      testInstance.changeToolbarTools([]);

      expect(testInstance.props.model.toolbarTools).toEqual([]);
      expect(onChange).toHaveBeenCalledWith({
        ...props.model,
        answers: null,
        toolbarTools: [],
      });
    });
  });

  it('toggleToolBarTool calls onChange', () => {
    const onChange = jest.fn();
    const testInstance = new CorrectResponse({ ...props, onChange });

    testInstance.toggleToolBarTool('point');

    expect(onChange).toHaveBeenCalledWith({ ...props.model, answers: null, toolbarTools: ['point'] });
  });

  it('addAlternateResponse calls onChange', () => {
    const onChange = jest.fn();
    const testInstance = new CorrectResponse({ ...props, onChange });

    testInstance.addAlternateResponse();

    const answers = testInstance.props.model.answers;

    answers.alternate1 = { marks: [], name: 'Alternate 1' };

    expect(testInstance.props.model.answers).toEqual(answers);
    expect(onChange).toHaveBeenCalledWith({ ...defaultValues.model, answers });
  });
});

describe('CorrectResponse: if answers is undefined it should still work as expected', () => {
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: { ...defaultValues.model, answers: undefined },
      onChange: jest.fn(),
      tools: [],
    };
  });

  const renderCorrectResponse = (newProps = {}) => {
    const configureProps = { ...props, ...newProps };

    return render(
      <ThemeProvider theme={theme}>
        <CorrectResponse {...configureProps} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('snapshot', () => {
      const { container } = renderCorrectResponse();
      // // expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('changeMarks calls onChange', () => {
      const onChange = jest.fn();
      const testInstance = new CorrectResponse({ ...props, onChange });
      const marks = [{ x: 1, y: 1, type: 'point' }];

      testInstance.changeMarks('alternateTest', marks);

      expect(onChange).toBeCalledWith({
        ...props.model,
        answers: {
          alternateTest: {
            marks,
          },
        },
      });
    });

    it('changeToolbarTools calls onChange', () => {
      const onChange = jest.fn();
      const testInstance = new CorrectResponse({ ...props, onChange });

      testInstance.changeToolbarTools([]);

      expect(testInstance.props.model.toolbarTools).toEqual([]);
      expect(onChange).toHaveBeenCalledWith({
        ...props.model,
        answers: undefined,
        toolbarTools: [],
      });
    });
  });

  it('toggleToolBarTool calls onChange', () => {
    const onChange = jest.fn();
    const testInstance = new CorrectResponse({ ...props, onChange });

    testInstance.toggleToolBarTool('point');

    expect(onChange).toHaveBeenCalledWith({ ...props.model, answers: undefined, toolbarTools: ['point'] });
  });

  it('addAlternateResponse calls onChange', () => {
    const onChange = jest.fn();
    const testInstance = new CorrectResponse({ ...props, onChange });

    testInstance.addAlternateResponse();

    const answers = testInstance.props.model.answers;

    answers.alternate1 = { marks: [], name: 'Alternate 1' };

    expect(testInstance.props.model.answers).toEqual(answers);
    expect(onChange).toHaveBeenCalledWith({ ...defaultValues.model, answers });
  });
});
