import React from 'react';
import { render, screen } from '@testing-library/react';
import { MultipleChoice, Choice } from '../multiple-choice';
import CorrectAnswerToggle from '@pie-lib/correct-answer-toggle';

// Mock the CorrectAnswerToggle component
jest.mock('@pie-lib/correct-answer-toggle', () => {
  const MockToggle = (props) => (
    <div data-testid="correct-answer-toggle" data-show={props.show} data-toggled={props.toggled}>
      Mock Toggle
    </div>
  );
  MockToggle.displayName = 'CorrectAnswerToggle';
  return MockToggle;
});

describe('Choice', () => {
  let onChoiceChanged;

  beforeEach(() => {
    onChoiceChanged = jest.fn();
  });

  const renderChoice = (extras = {}) => {
    const props = {
      classes: {},
      choice: {},
      index: 0,
      choicesLength: 1,
      showCorrect: false,
      isEvaluateMode: false,
      choiceMode: 'radio',
      disabled: true,
      onChoiceChanged,
      checked: true,
      correctness: 'correct',
      displayKey: '0',
      choicesLayout: 'grid',
      gridColumns: 2,
      ...extras,
    };
    return render(<Choice {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = renderChoice();
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('does not call onChoiceChanged if disabled is true', () => {
      const { container } = renderChoice({ disabled: true });
      const input = container.querySelector('input');
      if (input) {
        input.click();
      }
      // When disabled, onChange should not be called
      expect(onChoiceChanged).not.toHaveBeenCalled();
    });
  });
});

describe('CorespringChoice', () => {
  const mkWrapper = (opts = {}) => {
    const defaultProps = {
      classes: {},
      choices: [],
      disabled: false,
      keyMode: 'letters',
      onChoiceChanged: jest.fn(),
      mode: 'gather',
      ...opts,
    };

    return render(<MultipleChoice {...defaultProps} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = mkWrapper({
        choices: [
          { value: 'a', label: 'label a', correct: true, feedback: 'great' },
          { value: 'b', label: 'label b' },
          { value: 'c', label: 'label c', correct: true, feedback: 'great' },
        ],
      });

      expect(container).toMatchSnapshot();
    });

    describe('renders incorrect tick if one answer is correct but it is not checked', () => {
      it('renders', () => {
        const { container } = mkWrapper({
          mode: 'evaluate',
          keyMode: 'none',
          choices: [
            { value: 'a', label: 'label a', correct: true, feedback: 'great' },
            { value: 'b', label: 'label b' },
            { value: 'c', label: 'label c', correct: true, feedback: 'great' },
          ],
          session: {
            value: ['a'],
          },
        });

        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('Toggle', () => {
    it('toggle is rendered', () => {
      mkWrapper();
      expect(screen.getByTestId('correct-answer-toggle')).toBeInTheDocument();
    });

    it('toggle show is set to false by default', () => {
      mkWrapper();
      const toggle = screen.getByTestId('correct-answer-toggle');
      expect(toggle).toHaveAttribute('data-show', 'false');
    });

    it('shows toggle if mode is evaluate, feedback is enabled and responseCorrect is false', () => {
      mkWrapper({ mode: 'evaluate', responseCorrect: false, feedbackEnabled: true });
      const toggle = screen.getByTestId('correct-answer-toggle');
      expect(toggle).toHaveAttribute('data-show', 'true');
    });

    it('hides toggle if mode is evaluate and responseCorrect is true', () => {
      mkWrapper({ mode: 'evaluate', responseCorrect: true });
      const toggle = screen.getByTestId('correct-answer-toggle');
      expect(toggle).toHaveAttribute('data-show', 'false');
    });
  });
});
