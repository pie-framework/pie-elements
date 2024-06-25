import React from 'react';
import { shallow } from 'enzyme';
import { Design } from '../design';
import defaults from '../defaults';
import { InputContainer } from '@pie-lib/pie-toolbox/config-ui';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';

jest.mock('@pie-lib/pie-toolbox/config-ui', () => ({
    layout: {
        ConfigLayout: (props) => <div>{props.children}</div>,
    },
    settings: {
        Panel: (props) => <div onChange={props.onChange} />,
        toggle: jest.fn(),
        dropdown: jest.fn(),
    },
    InputContainer: (props) => <div {...props}>{props.children}</div>,
    EditableHtml: (props) => <div {...props}>{props.children}</div>,
}));

describe('Render Main Component', () => {
    let wrapper, onChange;
    let model = defaults.model;
    let configuration = defaults.configuration;

    beforeEach(() => {
        onChange = jest.fn();

        wrapper = shallow(
            <Design
                classes={{}}
                model={model}
                configuration={configuration}
                onModelChanged={onChange}
                imageSupport={{}}
                uploadSoundSupport={{}}
            />,
        );
        
    });

    it('Match Snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
    
    describe('UI Rendering', () => {
        it('renders teacher instructions input when enabled', () => {
            wrapper.setProps({
                model: { ...model, teacherInstructionsEnabled: true },
            });
            expect(wrapper.find(InputContainer).at(0).prop('label')).toEqual('Teacher Instructions');
        });

        it('renders prompt input when enabled', () => {
            wrapper.setProps({
                model: { ...model, promptEnabled: true },
            });
            expect(wrapper.find(InputContainer).at(1).prop('label')).toEqual('Prompt');
        });

        it('renders rationale input when enabled', () => {
            wrapper.setProps({
                model: { ...model, rationaleEnabled: true },
            });
            expect(wrapper.find(InputContainer).at(3).prop('label')).toEqual('Rationale');
        });

        it('renders response template and markup correctly', () => {
            const mockMarkup = '<div data-type="math_templated"></div>';
            wrapper.setState({ markup: mockMarkup });
            wrapper.setProps({ model: { ...model, slateMarkup: mockMarkup } });

            const editableHtml = wrapper.find(EditableHtml);
            expect(editableHtml.exists()).toBe(true);
            expect(editableHtml.at(2).prop('markup')).toEqual(mockMarkup);
        });

        it('renders equation editor select correctly', () => {
            const inputContainer = wrapper.find(InputContainer).findWhere(node => node.prop('label') === 'Response Template Equation Editor');
            expect(inputContainer.exists()).toBe(true);

            const select = inputContainer.find(Select);
            expect(select.exists()).toBe(true);
        });

        it('renders tooltip with correct title', () => {
            const tooltip = wrapper.find(Tooltip);
            expect(tooltip.exists()).toBe(true);
            expect(tooltip.prop('title')).toEqual(
                'Validation requirements:\nCorrect answers should not be blank.\nEach answer defined for a response area should be unique.\nThere should be at least 1 and at most 10 response areas defined.'
            );
        });
    });

    describe('logic', () => {
        it('handles onChange event correctly for teacher instructions', () => {
            wrapper.setProps({ model: { ...model, teacherInstructionsEnabled: true } });

            const inputContainer = wrapper.find(InputContainer).at(0);
            inputContainer.find(EditableHtml).simulate('change', '<p>New teacher instructions</p>');

            expect(onChange).toHaveBeenCalledWith({ ...model, teacherInstructions: '<p>New teacher instructions</p>' });
        });

        it('handles onChange event correctly for prompt', () => {
            wrapper.setProps({ model: { ...model, promptEnabled: true } });

            const inputContainer = wrapper.find(InputContainer).at(1);
            inputContainer.find(EditableHtml).simulate('change', '<p>New prompt</p>');

            expect(onChange).toHaveBeenCalledWith({ ...model, prompt: '<p>New prompt</p>' });
        });

        it('handles onChange event correctly for rationale', () => {
            wrapper.setProps({ model: { ...model, rationaleEnabled: true } });

            const inputContainer = wrapper.find(InputContainer).at(3);
            inputContainer.find(EditableHtml).simulate('change', '<p>New rationale</p>');

            expect(onChange).toHaveBeenCalledWith({ ...model, rationale: '<p>New rationale</p>' });
        });

        it('not renders prompt input when disabled', () => {
            wrapper.setProps({ model: { ...model, promptEnabled: false } });

            expect(wrapper.find(InputContainer).at(1).prop('label')).not.toEqual('Prompt');
        });

        it('updates state correctly when markup changes', () => {
            const mockMarkup = '<p>New markup content</p>';
            wrapper.setState({ markup: mockMarkup });
            wrapper.setProps({ model: { ...model, slateMarkup: mockMarkup } });

            wrapper.find(EditableHtml).at(2).simulate('change', mockMarkup);

            expect(wrapper.state('markup')).toEqual(mockMarkup);
        });

        it('updates model correctly when equation editor value changes', () => {
            const newValue = 'integers';
            const inputContainer = wrapper.find(InputContainer).findWhere(node => node.prop('label') === 'Response Template Equation Editor');
            const select = inputContainer.find(Select);

            select.simulate('change', { target: { value: newValue } });

            expect(onChange).toHaveBeenCalledWith({ ...model, equationEditor: newValue });
        });
    });

});