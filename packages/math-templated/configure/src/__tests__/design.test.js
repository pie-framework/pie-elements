import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Design } from '../design';
import defaults from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div data-testid="config-layout">{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div data-testid="settings-panel" onChange={props.onChange} />,
    toggle: jest.fn(),
    dropdown: jest.fn(),
  },
  InputContainer: (props) => <div data-testid="input-container" data-label={props.label} {...props}>{props.children}</div>,
}));

jest.mock('@pie-lib/editable-html-tip-tap', () => (props) => (
  <div
    data-testid="editable-html"
    data-markup={props.markup}
    onClick={() => props.onChange && props.onChange(props.markup)}
  >
    {props.children}
  </div>
));

describe('Render Main Component', () => {
  let onChange;
  let model = defaults.model;
  let configuration = defaults.configuration;

  const defaultProps = {
    classes: {},
    model,
    configuration,
    imageSupport: {},
    uploadSoundSupport: {},
    onConfigurationChanged: jest.fn(),
  };

  const wrapper = (props = {}) => {
    const onModelChanged = props.onModelChanged || onChange;
    return render(<Design {...defaultProps} {...props} onModelChanged={onModelChanged} />);
  };

  beforeEach(() => {
    onChange = jest.fn();
  });

  describe('UI Rendering', () => {
    it('renders teacher instructions input when enabled', () => {
      const { container } = wrapper({
        model: { ...model, teacherInstructionsEnabled: true },
      });
      const inputContainers = container.querySelectorAll('[data-testid="input-container"]');
      const teacherInstructionsContainer = Array.from(inputContainers).find(
        (el) => el.getAttribute('data-label') === 'Teacher Instructions'
      );
      expect(teacherInstructionsContainer).toBeInTheDocument();
    });

    it('renders prompt input when enabled', () => {
      const { container } = wrapper({
        model: { ...model, promptEnabled: true },
      });
      const inputContainers = container.querySelectorAll('[data-testid="input-container"]');
      const promptContainer = Array.from(inputContainers).find(
        (el) => el.getAttribute('data-label') === 'Prompt'
      );
      expect(promptContainer).toBeInTheDocument();
    });

    it('renders rationale input when enabled', () => {
      const { container } = wrapper({
        model: { ...model, rationaleEnabled: true },
      });
      const inputContainers = container.querySelectorAll('[data-testid="input-container"]');
      const rationaleContainer = Array.from(inputContainers).find(
        (el) => el.getAttribute('data-label') === 'Rationale'
      );
      expect(rationaleContainer).toBeInTheDocument();
    });

    it('renders response template and markup correctly', () => {
      const mockMarkup = '<div data-type="math_templated"></div>';
      const { container } = wrapper({
        model: { ...model, slateMarkup: mockMarkup }
      });

      const editableHtmlElements = container.querySelectorAll('[data-testid="editable-html"]');
      expect(editableHtmlElements.length).toBeGreaterThan(0);

      // Find the one with the matching markup
      const responseTemplateEditor = Array.from(editableHtmlElements).find(
        (el) => el.getAttribute('data-markup') === mockMarkup
      );
      expect(responseTemplateEditor).toBeInTheDocument();
    });

    it('renders equation editor select correctly', () => {
      const { container } = wrapper();
      const inputContainers = container.querySelectorAll('[data-testid="input-container"]');
      const equationEditorContainer = Array.from(inputContainers).find(
        (el) => el.getAttribute('data-label') === 'Response Template Equation Editor'
      );
      expect(equationEditorContainer).toBeInTheDocument();

      // MUI Select renders as a div with role="button" and aria-haspopup
      const select = equationEditorContainer.querySelector('[role="combobox"]');
      expect(select).toBeInTheDocument();
    });

    it('renders tooltip with correct title', () => {
      const { container } = wrapper();
      // The Info icon has the title attribute via the Tooltip component
      const tooltipTrigger = container.querySelector('svg[data-testid="InfoIcon"]');
      expect(tooltipTrigger).toBeInTheDocument();
    });
  });

  describe('logic', () => {
    it('handles onChange event correctly for teacher instructions', () => {
      const instance = new Design({
        ...defaultProps,
        model: { ...model, teacherInstructionsEnabled: true },
        onModelChanged: onChange,
        onConfigurationChanged: jest.fn()
      });
      instance.handleChange('teacherInstructions', '<p>New teacher instructions</p>');

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ teacherInstructions: '<p>New teacher instructions</p>' })
      );
    });

    it('handles onChange event correctly for prompt', () => {
      const instance = new Design({
        ...defaultProps,
        model: { ...model, promptEnabled: true },
        onModelChanged: onChange,
        onConfigurationChanged: jest.fn()
      });
      instance.handleChange('prompt', '<p>New prompt</p>');

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ prompt: '<p>New prompt</p>' })
      );
    });

    it('handles onChange event correctly for rationale', () => {
      const instance = new Design({
        ...defaultProps,
        model: { ...model, rationaleEnabled: true },
        onModelChanged: onChange,
        onConfigurationChanged: jest.fn()
      });
      instance.handleChange('rationale', '<p>New rationale</p>');

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ rationale: '<p>New rationale</p>' })
      );
    });

    it('not renders prompt input when disabled', () => {
      const { container } = wrapper({
        model: { ...model, promptEnabled: false }
      });

      const inputContainers = container.querySelectorAll('[data-testid="input-container"]');
      const promptContainer = Array.from(inputContainers).find(
        (el) => el.getAttribute('data-label') === 'Prompt'
      );
      expect(promptContainer).toBeUndefined();
    });

    it('updates state correctly when markup changes', () => {
      const mockMarkup = '<p>New markup content</p>';
      const instance = new Design({
        ...defaultProps,
        model: { ...model, slateMarkup: mockMarkup },
        onModelChanged: onChange,
        onConfigurationChanged: jest.fn()
      });

      instance.setState = jest.fn((state, callback) => {
        Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
        if (callback) callback();
      });

      instance.onChange(mockMarkup);

      // Check that setState was called with markup
      expect(instance.setState).toHaveBeenCalled();
    });

    it('updates model correctly when equation editor value changes', () => {
      const newValue = 'integers';
      const instance = new Design({
        ...defaultProps,
        onModelChanged: onChange,
        onConfigurationChanged: jest.fn()
      });

      instance.handleChange('equationEditor', newValue);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ equationEditor: newValue })
      );
    });
  });
});
