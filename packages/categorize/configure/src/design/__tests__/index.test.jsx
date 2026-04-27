import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Design } from '../index';

const model = (extras) => ({
  choices: [{ id: '1', content: 'content' }],
  correctResponse: [{ category: '1', choices: ['1'] }],
  categories: [{ id: '1', label: 'Category Title' }],
  ...extras,
});

jest.mock('@pie-lib/config-ui', () => {
  const React = require('react');
  const InputContainer = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
  InputContainer.displayName = 'InputContainer';

  return {
    layout: {
      ConfigLayout: (props) => <div {...props} />,
    },
    choiceUtils: {
      firstAvailableIndex: jest.fn(),
    },
    settings: {
      Panel: (props) => <div {...props} />,
      toggle: jest.fn(),
      radio: jest.fn(),
    },
    FeedbackConfig: (props) => <div {...props} />,
    AlertDialog: (props) => <div {...props} />,
    InputContainer,
  };
});

jest.mock('@pie-lib/categorize', () => ({
  ensureNoExtraChoicesInAlternate: jest.fn(),
  countInAnswer: jest.fn().mockReturnValue(1),
  ensureNoExtraChoicesInAnswer: jest.fn(),
}));

jest.mock('@pie-lib/drag', () => ({
  DragProvider: ({ children }) => <div>{children}</div>,
  uid: {
    generateId: jest.fn(() => 'test-uid'),
    Provider: ({ children }) => <div>{children}</div>,
    withUid: (Component) => Component,
  },
}));

jest.mock('@pie-lib/editable-html-tip-tap', () => (props) => <div {...props} />);
jest.mock('@pie-lib/math-rendering', () => ({ renderMath: jest.fn() }));
jest.mock('@pie-lib/translator', () => {
  const translator = {
    t: (key) => key,
  };
  return {
    __esModule: true,
    default: { translator },
  };
});

jest.mock('../categories', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));
jest.mock('../categories/alternateResponses', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));
jest.mock('../choices', () => ({
  __esModule: true,
  default: (props) => <div {...props} />,
}));

const theme = createTheme();

describe('Design', () => {
  let onChange = jest.fn();

  beforeEach(() => {
    onChange = jest.fn();
  });

  const renderDesign = (extras) => {
    const defaults = {
      classes: { design: 'design', text: 'text' },
      className: 'className',
      onChange,
      model: model(),
      uid: '1',
    };
    const props = { ...defaults, ...extras };

    return render(
      <ThemeProvider theme={theme}>
        <Design {...props} />
      </ThemeProvider>
    );
  };

  describe('renders', () => {
    it('renders without crashing', () => {
      const { container } = renderDesign();
      expect(container).toBeInTheDocument();
    });
  });

  describe('onDragEnd', () => {
    const createInstance = (modelExtras = {}) => {
      const instance = new Design({
        model: model({
          allowAlternateEnabled: true,
          ...modelExtras,
        }),
        onChange,
      });

      instance.setState = jest.fn();
      instance.removeChoiceFromSource = jest.fn();
      instance.moveChoice = jest.fn();
      instance.addChoiceToCategory = jest.fn();
      instance.moveChoiceInAlternate = jest.fn();
      instance.addChoiceToAlternateCategory = jest.fn();

      return instance;
    };

    const eventFor = ({ activeData, overData }) => ({
      active: activeData ? { data: { current: activeData } } : null,
      over: overData ? { data: { current: overData } } : null,
    });

    it('routes choice-preview with no target to removeChoiceFromSource', () => {
      const instance = createInstance();
      const activeData = {
        type: 'choice-preview',
        id: 'c1-cat1-0',
        categoryId: '1',
        choiceIndex: 0,
      };

      instance.onDragEnd(eventFor({ activeData }));

      expect(instance.removeChoiceFromSource).toHaveBeenCalledWith(
        activeData,
        0,
        expect.objectContaining({
          allowAlternateEnabled: true,
          categories: expect.any(Array),
          choices: expect.any(Array),
        }),
      );
    });

    it('routes choice-preview dropped on choice pool to removeChoiceFromSource', () => {
      const instance = createInstance();
      const activeData = {
        type: 'choice-preview',
        id: 'c1-cat1-0',
        categoryId: '1',
        choiceIndex: 0,
      };
      const overData = { type: 'choice' };

      instance.onDragEnd(eventFor({ activeData, overData }));

      expect(instance.removeChoiceFromSource).toHaveBeenCalled();
      expect(instance.moveChoice).not.toHaveBeenCalled();
    });

    it('routes choice-preview dropped on category to moveChoice', () => {
      const instance = createInstance();
      const activeData = {
        type: 'choice-preview',
        id: 'c1-cat1-0',
        categoryId: '1',
        choiceIndex: 2,
      };
      const overData = { type: 'category', id: '2' };

      instance.onDragEnd(eventFor({ activeData, overData }));

      expect(instance.moveChoice).toHaveBeenCalledWith('c1', '1', '2', 2);
    });

    it('routes new choice dropped on category to addChoiceToCategory', () => {
      const instance = createInstance();
      const activeData = { type: 'choice', id: '9' };
      const overData = { type: 'category', id: '2' };

      instance.onDragEnd(eventFor({ activeData, overData }));

      expect(instance.addChoiceToCategory).toHaveBeenCalledWith({ id: '9' }, '2');
    });

    it('routes choice-preview dropped on category-alternate to moveChoiceInAlternate', () => {
      const instance = createInstance();
      const activeData = {
        type: 'choice-preview',
        id: 'c1-cat1-0',
        categoryId: '1',
        choiceIndex: 1,
      };
      const overData = { type: 'category-alternate', id: '2', alternateResponseIndex: 3 };

      instance.onDragEnd(eventFor({ activeData, overData }));

      expect(instance.moveChoiceInAlternate).toHaveBeenCalledWith('c1', '1', '2', 1, 3);
    });

    it('routes new choice dropped on category-alternate to addChoiceToAlternateCategory', () => {
      const instance = createInstance({ allowAlternateEnabled: true });
      const activeData = { type: 'choice', id: '11' };
      const overData = { type: 'category-alternate', id: '2', alternateResponseIndex: 4 };

      instance.onDragEnd(eventFor({ activeData, overData }));

      expect(instance.addChoiceToAlternateCategory).toHaveBeenCalledWith({ id: '11' }, '2', 4);
    });
  });
});
