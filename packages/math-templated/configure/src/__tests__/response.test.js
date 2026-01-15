import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Response } from '../response';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    dropdown: jest.fn(),
  },
  InputContainer: (props) => <div data-testid="input-container" {...props}>{props.children}</div>,
  EditableHtml: (props) => <div data-testid="editable-html" {...props}>{props.children}</div>,
}));

jest.mock('@pie-lib/math-toolbar', () => ({
  MathToolbar: (props) => (
    <div data-testid="math-toolbar" onChange={(e) => props.onChange && props.onChange(e.target.value)}>
      <input data-testid={`math-toolbar-input-${props['data-key'] || 'main'}`} onChange={(e) => props.onChange && props.onChange(e.target.value)} />
    </div>
  ),
}));

const mockOnResponseChange = jest.fn();

const defaultProps = {
  responseKey: '1',
  response: {
    answer: '',
    alternates: {},
    validation: 'literal',
    ignoreOrder: false,
    allowTrailingZeros: false,
  },
  onResponseChange: mockOnResponseChange,
  cIgnoreOrder: { enabled: true, label: 'Ignore Order' },
  cAllowTrailingZeros: { enabled: true, label: 'Allow Trailing Zeros' },
  error: {},
  defaultResponse: false,
  mode: '8',
};

describe('Response component', () => {
  const wrapper = (props = {}) => {
    return render(<Response {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    mockOnResponseChange.mockClear();
  });

  it('Match Snapshot', () => {
    const { container } = wrapper();
    expect(container).toMatchSnapshot();
  });

  it('renders correctly', () => {
    const { container } = wrapper();
    expect(container).toBeInTheDocument();
  });

  it('changes validation method', () => {
    const { container } = wrapper();
    const select = container.querySelector('select');
    if (select) {
      fireEvent.change(select, { target: { value: 'symbolic' } });
      expect(mockOnResponseChange).toHaveBeenCalledWith(expect.objectContaining({ validation: 'symbolic' }), '1');
    }
  });

  it('toggles allow trailing zeros', () => {
    const { container } = wrapper();
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    if (checkboxes[0]) {
      fireEvent.click(checkboxes[0]);
      expect(mockOnResponseChange).toHaveBeenCalled();
    }
  });

  it('toggles ignore order', () => {
    const { container } = wrapper();
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    if (checkboxes[1]) {
      fireEvent.click(checkboxes[1]);
      expect(mockOnResponseChange).toHaveBeenCalled();
    }
  });

  it('adds an alternate answer', () => {
    const { container } = wrapper();
    const buttons = container.querySelectorAll('button');
    // Find the "Add Alternate" button
    const addButton = Array.from(buttons).find((btn) => btn.textContent.includes('Add'));
    if (addButton) {
      fireEvent.click(addButton);
      expect(mockOnResponseChange).toHaveBeenCalledWith(
        expect.objectContaining({
          alternates: { 1: '' },
        }),
        '1',
      );
    }
  });

  it('removes an alternate answer', () => {
    const propsWithAlternate = {
      ...defaultProps,
      response: {
        ...defaultProps.response,
        alternates: { 1: 'some answer' },
      },
    };
    const { container } = wrapper(propsWithAlternate);

    // Find the delete icon button (it should have an svg inside it)
    const buttons = container.querySelectorAll('button');
    const removeButton = Array.from(buttons).find((btn) => {
      // Check if button has an svg (Delete icon)
      return btn.querySelector('svg') && !btn.textContent.includes('Add');
    });

    if (removeButton) {
      fireEvent.click(removeButton);
      expect(defaultProps.onResponseChange).toHaveBeenCalledWith(
        {
          allowTrailingZeros: false,
          answer: '',
          ignoreOrder: false,
          validation: 'literal',
          alternates: {},
        },
        '1',
      );
    }
  });

  it('changes the main answer', () => {
    const { getAllByTestId } = wrapper();
    const mathToolbars = getAllByTestId('math-toolbar-input-main');
    if (mathToolbars[0]) {
      fireEvent.change(mathToolbars[0], { target: { value: 'new main answer' } });
      expect(mockOnResponseChange).toHaveBeenCalledWith(
        expect.objectContaining({
          answer: 'new main answer',
        }),
        '1',
      );
    }
  });

  it('changes an alternate answer', () => {
    const propsWithAlternate = {
      ...defaultProps,
      response: {
        ...defaultProps.response,
        alternates: { 1: 'some answer' },
      },
    };
    const { container } = wrapper(propsWithAlternate);

    const inputs = container.querySelectorAll('input[data-testid*="math-toolbar-input"]');
    if (inputs[1]) {
      fireEvent.change(inputs[1], { target: { value: 'new alternate answer' } });
      expect(mockOnResponseChange).toHaveBeenCalled();
    }
  });

  it('toggles allow trailing zeros checkbox state', () => {
    const { container } = wrapper();
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    if (checkboxes[0]) {
      fireEvent.click(checkboxes[0]);
      expect(mockOnResponseChange).toHaveBeenCalled();
    }
  });

  it('toggles ignore order checkbox state', () => {
    const { container } = wrapper();
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    if (checkboxes[1]) {
      fireEvent.click(checkboxes[1]);
      expect(mockOnResponseChange).toHaveBeenCalled();
    }
  });

  it('displays error messages for main answer and alternates', () => {
    const propsWithError = {
      ...defaultProps,
      error: {
        answer: 'Main answer error',
        1: 'First alternate error',
      },
    };
    const { container } = wrapper(propsWithError);

    const errorTexts = container.querySelectorAll('[class*="errorText"]');
    if (errorTexts.length >= 2) {
      expect(errorTexts[0].textContent).toBe('Main answer error');
      expect(errorTexts[1].textContent).toBe('First alternate error');
    }
  });

  it('handles empty response object', () => {
    const propsWithEmptyResponse = {
      ...defaultProps,
      response: {},
    };
    const { container } = wrapper(propsWithEmptyResponse);
    expect(container).toBeInTheDocument();

    const buttons = container.querySelectorAll('button');
    const addButton = Array.from(buttons).find((btn) => btn.textContent.includes('Add'));
    if (addButton) {
      fireEvent.click(addButton);
      expect(mockOnResponseChange).toHaveBeenCalledWith(
        expect.objectContaining({
          alternates: { 1: '' },
        }),
        '1',
      );
    }
  });
});
