import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultipleChoice } from '../multiple-choice';

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

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000',
    background: () => '#fff',
    incorrect: () => '#f00',
    correct: () => '#0f0',
    primaryLight: () => '#eee',
    primary: () => '#333',
  },
  Collapsible: ({ children }) => <div>{children}</div>,
  PreviewPrompt: ({ prompt, tagName: Tag = 'div' }) => <Tag>{prompt}</Tag>,
  transformDataHeadings: (html) => html,
}));

jest.mock('@pie-lib/translator', () => ({
  __esModule: true,
  default: { translator: { t: (key) => key } },
}));

// Mock Choice with separate select/deselect buttons so fireEvent.click
// reliably triggers handleChange with the correct checked value.
jest.mock('../choice', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ choice, onChoiceChanged }) => (
      <>
        <button
          data-testid={`select-${choice.value}`}
          onClick={() => onChoiceChanged({ target: { value: choice.value, checked: true } })}
        />
        <button
          data-testid={`deselect-${choice.value}`}
          onClick={() => onChoiceChanged({ target: { value: choice.value, checked: false } })}
        />
      </>
    ),
  };
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

describe('MultipleChoice handleChange', () => {
  const makeChoice = (value) => ({ value, label: value });

  const defaultProps = (overrides = {}) => ({
    mode: 'gather',
    choiceMode: 'radio',
    choices: [makeChoice('A'), makeChoice('B'), makeChoice('C')],
    session: { value: [] },
    disabled: false,
    onChoiceChanged: jest.fn(),
    ...overrides,
  });

  describe('maxSelections: null', () => {
    it('allows selecting a first answer', () => {
      const onChoiceChanged = jest.fn();
      const { getByTestId } = render(
        <MultipleChoice {...defaultProps({ maxSelections: null, onChoiceChanged })} />,
      );

      fireEvent.click(getByTestId('select-A'));

      expect(onChoiceChanged).toHaveBeenCalledWith({ value: 'A', selected: true, selector: 'Mouse' });
    });

    it('allows switching to a different answer after one is already selected', () => {
      const onChoiceChanged = jest.fn();
      const { getByTestId } = render(
        <MultipleChoice
          {...defaultProps({
            maxSelections: null,
            session: { value: ['A'] },
            onChoiceChanged,
          })}
        />,
      );

      fireEvent.click(getByTestId('select-B'));

      expect(onChoiceChanged).toHaveBeenCalledWith({ value: 'B', selected: true, selector: 'Mouse' });
    });
  });

  describe('maxSelections: 1, choiceMode: radio', () => {
    it('allows selecting a first answer', () => {
      const onChoiceChanged = jest.fn();
      const { getByTestId } = render(
        <MultipleChoice {...defaultProps({ maxSelections: 1, onChoiceChanged })} />,
      );

      fireEvent.click(getByTestId('select-A'));

      expect(onChoiceChanged).toHaveBeenCalledWith({ value: 'A', selected: true, selector: 'Mouse' });
    });

    it('allows switching to a different answer after one is already selected', () => {
      const onChoiceChanged = jest.fn();
      const { getByTestId } = render(
        <MultipleChoice
          {...defaultProps({
            maxSelections: 1,
            session: { value: ['A'] },
            onChoiceChanged,
          })}
        />,
      );

      fireEvent.click(getByTestId('select-B'));

      expect(onChoiceChanged).toHaveBeenCalledWith({ value: 'B', selected: true, selector: 'Mouse' });
    });
  });

  describe('maxSelections: 2, choiceMode: checkbox', () => {
    it('allows selecting up to the limit', () => {
      const onChoiceChanged = jest.fn();
      const { getByTestId } = render(
        <MultipleChoice
          {...defaultProps({
            choiceMode: 'checkbox',
            maxSelections: 2,
            session: { value: ['A'] },
            onChoiceChanged,
          })}
        />,
      );

      fireEvent.click(getByTestId('select-B'));

      expect(onChoiceChanged).toHaveBeenCalledWith({ value: 'B', selected: true, selector: 'Mouse' });
    });

    it('blocks selecting beyond the limit', () => {
      const onChoiceChanged = jest.fn();
      const { getByTestId } = render(
        <MultipleChoice
          {...defaultProps({
            choiceMode: 'checkbox',
            maxSelections: 2,
            session: { value: ['A', 'B'] },
            onChoiceChanged,
          })}
        />,
      );

      fireEvent.click(getByTestId('select-C'));

      expect(onChoiceChanged).not.toHaveBeenCalled();
    });

    it('allows deselecting when at the limit', () => {
      const onChoiceChanged = jest.fn();
      const { getByTestId } = render(
        <MultipleChoice
          {...defaultProps({
            choiceMode: 'checkbox',
            maxSelections: 2,
            session: { value: ['A', 'B'] },
            onChoiceChanged,
          })}
        />,
      );

      fireEvent.click(getByTestId('deselect-A'));

      expect(onChoiceChanged).toHaveBeenCalledWith({ value: 'A', selected: false, selector: 'Mouse' });
    });
  });
});
