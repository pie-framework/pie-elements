import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import MultipleChoiceComponent from '../main';
import MultipleChoice from '../index';
import { isComplete } from '../index';

jest.useFakeTimers();
jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));
jest.mock('lodash/debounce', () => jest.fn((fn) => fn));

// Mock the render-ui PreviewLayout
jest.mock('@pie-lib/render-ui', () => ({
  PreviewLayout: ({ children }) => <div data-testid="preview-layout">{children}</div>,
  Collapsible: ({ children, labels }) => (
    <div data-testid="collapsible">
      <button>{labels?.hidden || 'Show'}</button>
      {children}
    </div>
  ),
  PreviewPrompt: ({ prompt }) => <div data-testid="preview-prompt">{prompt}</div>,
  color: {
    text: () => '#000',
    background: () => '#fff',
    primary: () => '#1976d2',
    correct: () => '#4caf50',
    incorrect: () => '#f44336',
    disabled: () => '#9e9e9e',
  },
}));

describe('isComplete', () => {
  it.each`
    session                 | expected
    ${{ value: [1, 2, 3] }} | ${true}
    ${{ value: [] }}        | ${false}
    ${{}}                   | ${false}
    ${null}                 | ${false}
    ${undefined}            | ${false}
  `('session = $session is complete => $expected', ({ session, expected }) => {
    expect(isComplete(session)).toEqual(expected);
  });
});

describe('multiple-choice', () => {
  describe('rendering', () => {
    const renderComponent = (modelOverrides = {}) => {
      const defaultProps = {
        model: {
          choices: [],
          prompt: 'Select an answer',
          ...modelOverrides,
        },
        session: {},
        classes: {},
      };

      return render(<MultipleChoiceComponent {...defaultProps} />);
    };

    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container).toBeInTheDocument();
    });

    it('renders the preview layout wrapper', () => {
      renderComponent();
      expect(screen.getByTestId('preview-layout')).toBeInTheDocument();
    });

    it('renders with rationale', () => {
      renderComponent({ rationale: 'This is rationale' });
      expect(screen.getByText('This is rationale')).toBeInTheDocument();
    });

    it('renders with teacherInstructions', () => {
      renderComponent({ teacherInstructions: 'These are teacher instructions' });
      expect(screen.getByText('These are teacher instructions')).toBeInTheDocument();
    });

    it('renders choices when provided', () => {
      renderComponent({
        choices: [
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B' },
        ],
      });
      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getByText('Option B')).toBeInTheDocument();
    });
  });

  describe('events', () => {
    describe('model', () => {
      it('dispatches model set event', () => {
        const el = new MultipleChoice();
        el.tagName = 'mc-el';
        el.model = {};
        expect(el.dispatchEvent).toBeCalledWith(new ModelSetEvent('mc-el', false, true));
      });
    });

    describe('onChange', () => {
      it('dispatches session changed event - add answer (checkbox)', () => {
        const el = new MultipleChoice();
        el.tagName = 'mc-el';
        el.model = { choiceMode: 'checkbox' };
        el.session = { value: [] };
        el._onChange({ value: 'a', selected: true });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', true));
      });

      it('dispatches session changed event - remove answer (checkbox)', () => {
        const el = new MultipleChoice();
        el.tagName = 'mc-el';
        el.model = { choiceMode: 'checkbox' };
        el.session = { value: ['a'] };
        el._onChange({ value: 'a', selected: false });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', false));
      });

      it('dispatches session changed event - add/remove answer (checkbox)', () => {
        const el = new MultipleChoice();
        el.tagName = 'mc-el';
        el.model = { choiceMode: 'checkbox' };
        el.session = { value: ['1'] };
        el._onChange({ id: '2', selected: true });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', true));

        el._onChange({ id: '1', selected: false });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', true));

        el._onChange({ id: '2', selected: false });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', false));
      });

      it('dispatches session changed event - add/change answer (radio)', () => {
        const el = new MultipleChoice();
        el.tagName = 'mc-el';
        el.model = { choiceMode: 'radio' };
        el.session = { value: [] };
        el._onChange({ value: 'a', selected: true });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', true));
        el._onChange({ value: 'b', selected: true });
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('mc-el', true));
      });
    });
  });
});
