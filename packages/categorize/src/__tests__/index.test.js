import React from 'react';
import Categorize from '../index';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ModelSetEvent, SessionChangedEvent } from '@pie-framework/pie-player-events';
import { Categorize as UnStyledCategorize } from '../categorize/index';

jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));
const mockRender = jest.fn();
const mockUnmount = jest.fn();
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: mockRender,
    unmount: mockUnmount,
  })),
}));

const theme = createTheme();

describe('categorize', () => {
  describe('renders', () => {
    const renderCategorize = (props) => {
      const defaultProps = {
        model: {
          categories: [],
          choices: [],
          correctResponse: [],
          ...props,
        },
        session: {},
        classes: {},
        onAnswersChange: jest.fn(),
        onShowCorrectToggle: jest.fn(),
      };
      return render(
        <ThemeProvider theme={theme}>
          <UnStyledCategorize {...defaultProps} />
        </ThemeProvider>
      );
    };

    it('renders without crashing', () => {
      const { container } = renderCategorize();
      expect(container).toBeInTheDocument();
    });

    it('renders with rationale', () => {
      const { container} = renderCategorize({ rationale: 'This is rationale' });
      expect(container).toBeInTheDocument();
    });

    it('renders with teacherInstructions', () => {
      const { container } = renderCategorize({ teacherInstructions: 'These are teacher instructions' });
      expect(container).toBeInTheDocument();
    });
  });

  describe('events', () => {
    let el;

    beforeEach(() => {
      // Register custom element if not already registered
      if (!customElements.get('categorize-el')) {
        customElements.define('categorize-el', Categorize);
      }

      // Create element via createElement to properly initialize it
      el = document.createElement('categorize-el');

      // Mock dispatchEvent
      el.dispatchEvent = jest.fn();
    });

    describe('model', () => {
      it('dispatches model set event', () => {
        el.model = {};
        expect(el.dispatchEvent).toBeCalledWith(new ModelSetEvent('categorize-el', false, true));
      });
    });

    describe('changeAnswers', () => {
      it('dispatches session changed event - add answer', () => {
        el.model = {
          responseAreasToBeFilled: 2,
          hasUnplacedChoices: true,
        };
        el.session = { answers: [] };
        el.changeAnswers([{ category: 'id-fruits', choices: ['apple'] }]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', false));
        el.changeAnswers([
          { category: 'id-fruits', choices: ['apple'] },
          { category: 'id-vegetables', choices: ['carrot'] },
        ]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', true));
      });

      it('dispatches session changed event - remove answer', () => {
        el.model = {
          responseAreasToBeFilled: 1,
        };
        el.session = { answers: [{ category: 'id-fruits', choices: ['apple'] }] };
        el.changeAnswers([{ category: 'id-fruits', choices: [] }]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', false));
      });

      it('dispatches session changed event - add/remove answer', () => {
        el.model = {
          responseAreasToBeFilled: 2,
          hasUnplacedChoices: true,
        };
        el.session = {
          answers: [
            { category: 'id-fruits', choices: ['apple'] },
            { category: 'id-vegetables', choices: ['carrot', 'onion'] },
          ],
        };
        el.changeAnswers([
          { category: 'id-fruits', choices: ['apple'] },
          { category: 'id-vegetables', choices: ['carrot'] },
        ]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', true));

        el.changeAnswers([
          { category: 'id-fruits', choices: ['apple'] },
          { category: 'id-vegetables', choices: [] },
        ]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', false));

        el.changeAnswers([
          { category: 'id-fruits', choices: [] },
          { category: 'id-vegetables', choices: [] },
        ]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', false));
      });

      it('dispatches session changed event - add/remove answer - no unplaced choices', () => {
        el.model = {
          responseAreasToBeFilled: 2,
          hasUnplacedChoices: false,
          possibleResponses: [['apple', 'carrot', 'onion']],
        };
        el.session = {
          answers: [
            { category: 'id-fruits', choices: ['apple'] },
            { category: 'id-vegetables', choices: [] },
          ],
        };

        el.changeAnswers([
          { category: 'id-fruits', choices: ['apple'] },
          { category: 'id-vegetables', choices: ['carrot'] },
        ]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', false));

        el.changeAnswers([
          { category: 'id-fruits', choices: ['apple'] },
          { category: 'id-vegetables', choices: ['carrot', 'onion'] },
        ]);
        expect(el.dispatchEvent).toBeCalledWith(new SessionChangedEvent('categorize-el', true));
      });
    });
  });
});
