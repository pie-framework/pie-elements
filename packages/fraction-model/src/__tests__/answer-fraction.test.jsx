import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import AnswerFraction from '../answer-fraction';

jest.mock('@mui/material', () => {
  const React = require('react');
  return {
    ...jest.requireActual('@mui/material'),
    TextField: (props) => React.createElement('div', { 'data-testid': 'text-field', ...props }),
  };
});

const theme = createTheme();

describe('AnswerFraction', () => {
  const defaultProps = {
    classes: {},
    model: {
      correctResponse: [],
      title: '',
      prompt: '',
      modelTypeSelected: 'bar',
      maxModelSelected: 1,
      partsPerModel: 5,
      allowedStudentConfig: true,
      showGraphLabels: false,
    },
    correctAnswers: {},
    view: false,
    showCorrect: false,
    onAnswerChange: jest.fn(),
    answers: {},
  };

  const renderAnswerFraction = (extras = {}) => {
    const props = { ...defaultProps, ...extras };

    return render(
      <ThemeProvider theme={theme}>
        <AnswerFraction {...props} />
      </ThemeProvider>
    );
  };

  describe('render', () => {
    it('snapshot', () => {
      const { container } = renderAnswerFraction();
      expect(container).toMatchSnapshot();
    });

    it('renders correctly', () => {
      renderAnswerFraction();
      const textFields = screen.getAllByTestId('text-field');
      expect(textFields.length).toEqual(2);
    });

    it('onValueChange correctly update answers', () => {
      const testInstance = new AnswerFraction(defaultProps);

      testInstance.onValueChange('partsPerModel');
      testInstance.onValueChange('noOfModel');
    });
  });
});
