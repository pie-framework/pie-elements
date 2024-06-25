import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Main from '../main'; 
import { withStyles } from '@material-ui/core/styles';
import { Collapsible, Readable, hasText, PreviewPrompt } from '@pie-lib/pie-toolbox/render-ui';
import MathQuill from '@pie-framework/mathquill';
import { CorrectAnswerToggle } from '@pie-lib/pie-toolbox/correct-answer-toggle';

// Utility function to simulate the toggle click and return the updated component
const simulateToggleClick = (wrapper, toggleClassName) => {
    const toggleContent = wrapper.find(toggleClassName).first();
    toggleContent.simulate('click');
    wrapper.update();
    return wrapper.find(CorrectAnswerToggle).first();
};

const defaultModel = {
    prompt: 'Solve the equation:',
    teacherInstructions: '',
    rationale: '',
    responses: {
        0: {
            allowTrailingZeros: false,  
            answer: "2",    
            id: "1",
            validation: "symbolic",
            ignoreOrder: false,
            alternates: {},
        },
        1: {
            allowTrailingZeros: false,
            answer: "5",
            id: "2",
            validation: "symbolic",
            ignoreOrder: false,
            alternates: {},
        }
        
    },
    env: {mode: 'evaluate', role: 'instructor'},
    markup: '<p>If the unit price of a notebook in Store A is $1.50, what is the unit price of a binder? ${{0}} ${{1}}</p',
    equationEditor: 'miscellaneous',
    customKeys: [],
    view: false,
    feedback: {},
    correctness: {
        correct: false,
        correctness: "incorrect",
        score: 0
    }
};

const defaultSession = {
    answers: {
        r0: {
            value: "2"
        },
        r1: {
            value: "3"
        }
    },
    showCorrectness: true
};

const defaultProps = {
    model: defaultModel,
    session: defaultSession,
    onSessionChange: jest.fn(),
    classes: {},
};

describe('Main component', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(<Main {...defaultProps} />);
    });
    
    it('Match Snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('displays the prompt', () => {
        const prompt = 'Solve the equation:';
        const wrapper = mount(<Main {...defaultProps} model={{ ...defaultModel, prompt }} />);
        expect(wrapper.find(PreviewPrompt).text()).toContain(prompt);
    });
    
    it('updates component when receiving new props', () => {
        const newMarkup = 'Solve {{0}}';
        wrapper.setProps({ model: { ...defaultModel, markup: newMarkup } });
        expect(wrapper.text()).toContain('Solve');
    });

    it('updates session when change value in a response area', () => {
        const wrapper = mount(<Main {...defaultProps} model={{ ...defaultModel, env: {mode: 'gather', role:'student' }}} />);
        const firstResponseArea = wrapper.find('Static').at(0);
        const onSubFieldChange = firstResponseArea.prop('onSubFieldChange');
        onSubFieldChange('r1','5');

        expect(defaultProps.onSessionChange).toHaveBeenCalledWith({
            ...defaultProps.session,
            answers: { r0: { value: '2' }, r1: { value: '5'} }
        });
    });

    it('renders answers correctly in response areas', () => {
        wrapper.setState({ showCorrect: true });
        const toggle = wrapper.find(CorrectAnswerToggle);
        const firstResponseArea = wrapper.find('Static').at(0);
        const secondResponseArea = wrapper.find('Static').at(1);
        expect(firstResponseArea.prop('latex')).toContain('[r0]{2}');
        expect(secondResponseArea.prop('latex')).toContain('[r1]{3}');
    });
    
    it('toggles CorrectAnswerToggle correctly', () => {
        const updatedToggleComponent = simulateToggleClick(wrapper, '.CorrectAnswerToggle-content-26');
        expect(updatedToggleComponent.props().toggled).toBe(true);
    });

    it('show correct answers when correct answer toggle is true', () => {
        const updatedToggleComponent = simulateToggleClick(wrapper, '.CorrectAnswerToggle-content-26');
        const firstResponseArea = wrapper.find('Static').at(0);
        const secondResponseArea = wrapper.find('Static').at(1);
        expect(firstResponseArea.prop('latex')).toContain('2');
        expect(secondResponseArea.prop('latex')).toContain('5');
    });
});
