import * as React from 'react';
import Configure, { Configure as ConfigureNotStyled } from '../configure';
import GeneralConfigBlock from '../general-config-block';
import { InputContainer, InputCheckbox } from '@pie-lib/config-ui';
import { shallowChild } from '@pie-lib/test-utils';
import Response from '../response';
import { MathToolbar } from '@pie-lib/math-toolbar';
import EditableHtml from '@pie-lib/editable-html';
import { shallow } from 'enzyme';

import { FeedbackConfig, layout, settings } from '@pie-lib/config-ui';

import defaultValues from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  InputContainer: props => <div>{props.children}</div>,
  InputCheckbox: props => <div>{props.children}</div>,
  FeedbackConfig: props => <div>{props.children}</div>,
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  },
  settings: {
    Panel: props => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn()
  }
}));

jest.mock('@pie-lib/math-toolbar', () => ({
  MathToolbar: () => <div />
}));

jest.mock('@pie-framework/mathquill', () => ({
  StaticMath: jest.fn().mockReturnValue({
    latex: jest.fn()
  }),
  registerEmbed: jest.fn(),
  getInterface: jest.fn().mockReturnThis()
}));
const Mathquill = require('@pie-framework/mathquill');

const defaultProps = {
  model: {
    id: '1',
    promptEnabled: true,
    feedbackEnabled: true,
    element: 'math-inline',
    responseType: 'Advanced Multi',
    feedback: {
      correct: {
        default: 'Correct',
        type: 'none'
      },
      incorrect: {
        default: 'Incorrect',
        type: 'none'
      },
      partial: {
        default: 'Nearly',
        type: 'none'
      }
    },
    equationEditor: '3',
    expression: '{{response}} = {{response}} \\text{eggs}',
    question:
      '<p>Sam sells baskets of eggs at his farm stand. He sold 12 baskets and wrote the number sentence below to show how many eggs he sold in all.</p><p><span class="equation-block"><math xmlns="http://www.w3.org/1998/Math/MathML" >\n <mrow>\n  <mn>12</mn><mo>&#x00D7;</mo><mo>&#x25A1;</mo><mo>=</mo><mn>72</mn>\n </mrow>\n</math> </span></p><p>What <span class="relative-emphasis">division</span> number sentence can be used to show how many eggs were in each basket?</p><p>Use the on-screen keyboard to type your number sentence and answer in the box.</p>',
    response: {
      answer: '72\\div12=6\\text{eggs}',
      alternates: {
        '1': '6=72\\div12\\text{eggs}',
        '2': '\\frac{72}{12}=6\\text{eggs}',
        '3': '6=\\frac{72}{12}\\text{eggs}'
      },
      validation: 'literal'
    },
    responses: [
      {
        id: '1',
        answer: '72\\div12=6\\text{eggs}',
        alternates: {
          '1': '6=72\\div12\\text{eggs}',
          '2': '\\frac{72}{12}=6\\text{eggs}',
          '3': '6=\\frac{72}{12}\\text{eggs}'
        },
        validation: 'literal',
        allowTrailingZeros: true
      }
    ],
    customKeys: ['\\left(\\right)', '\\frac{}{}', 'x\\frac{}{}'],
    configure: defaultValues.configure
  },
  configuration: defaultValues.configuration
};

describe('Configure', () => {
  let wrapper;
  let component;
  let onModelChanged;

  beforeEach(() => {
    onModelChanged = jest.fn();
    wrapper = shallowChild(Configure, {...defaultProps, onModelChanged}, 2);
  });

  it('renders correctly', () => {
    component = wrapper();

    expect(component.find(GeneralConfigBlock).length).toEqual(1);
    expect(component.find(layout.ConfigLayout).length).toEqual(1);
    expect(component.find(FeedbackConfig).length).toEqual(1);
  });

  it('renders correctly with snapshot', () => {
    component = wrapper();

    expect(component).toMatchSnapshot();
  });

  it('changeTeacherInstructions calls onModelChange', () => {
    const component = shallow(<ConfigureNotStyled
      onModelChanged={onModelChanged}
      classes={{}}
      {...defaultValues }
    />);

    component.instance().changeTeacherInstructions('Teacher Instructions');

    expect(onModelChanged).toBeCalledWith(expect.objectContaining({
      teacherInstructions: 'Teacher Instructions'
    }));
  });

  it('if allowTrailingZeros is undefined in the model responses, it is set to the default value in config', () => {
    const component = shallow(<ConfigureNotStyled
      onModelChanged={onModelChanged}
      classes={{}}
      { ...defaultValues}
      model={{
        ...defaultValues.model,
        responses: [{
          'validation': 'literal',
          'answer': '',
          'id': '1',
        }]
      }}
    />);

    expect(onModelChanged).toBeCalled();
    expect(component.instance().props.model.responses[0].allowTrailingZeros).toEqual(defaultValues.configuration.allowTrailingZeros.default);
  });

  it('if allowTrailingZeros is undefined in the model and configuration.allowTrailingZeros.default is undefined, it is set to false', () => {
    const component = shallow(<ConfigureNotStyled
      onModelChanged={onModelChanged}
      classes={{}}
      { ...defaultValues}
      model={{
        ...defaultValues.model,
        responses: [{
          'validation': 'literal',
          'answer': '',
          'id': '1',
        }]
      }}
      configuration={{
        ...defaultValues.configuration,
        allowTrailingZeros: {
          ...defaultValues.configuration.allowTrailingZeros,
          default: undefined
        }}}
    />);

    expect(onModelChanged).toBeCalled();
    expect(component.instance().props.model.responses[0].allowTrailingZeros).toEqual(false);
  });
});

describe('GeneralConfigBlock', () => {
  let wrapper;
  let props;
  let component;

  beforeEach(() => {
    props = {
      model: defaultProps.model,
      promptEnabled: true,
      configuration: defaultValues.configuration,
      onChange: jest.fn(),
      imageSupport: {}
    };

    wrapper = shallowChild(GeneralConfigBlock, props, 1);
  });

  it('renders correctly', () => {
    component = wrapper();

    expect(component.find(InputContainer).length).toBeGreaterThan(1);
    expect(component.find(Response).length).toEqual(1);
    expect(component.find(MathToolbar).length).toEqual(1);
    expect(component.find(EditableHtml).length).toEqual(1);
    expect(Mathquill.getInterface().registerEmbed).toHaveBeenCalled();

    component = wrapper({ model: { ...props.model, responseType: 'Simple' } });

    expect(component.find(InputContainer).length).toBeGreaterThan(1);
    expect(component.find(Response).length).toEqual(1);
    expect(component.find(EditableHtml).length).toEqual(1);
    expect(component.find(MathToolbar).length).toEqual(0);
  });

  it('renders correctly with snapshot', () => {
    component = wrapper();

    expect(component).toMatchSnapshot();
  });

  it('updates advanced model correctly', () => {
    const onChange = jest.fn();
    const component = wrapper({
      ...props,
      onChange
    });

    component.instance().onResponseChange({ answer: 'something', id: 'r1' }, 0);

    expect(onChange).toBeCalledWith({
      ...props.model,
      responses: [
        {
          id: 'r1',
          answer: 'something'
        }
      ]
    });
  });

  it('builds out internal state correctly based on expression provided', () => {
    component = wrapper();

    expect(component.state()).toEqual({
      showKeypad: false,
      responseIdCounter: 2,
      responseAreas: {
        r1: {
          value: ''
        },
        r2: {
          value: ''
        }
      }
    });

    component = wrapper({
      ...props,
      model: {
        ...props.model,
        expression: props.model.expression + ' {{response}} '
      }
    });

    expect(component.state()).toEqual({
      showKeypad: false,
      responseIdCounter: 3,
      responseAreas: {
        r1: {
          value: ''
        },
        r2: {
          value: ''
        },
        r3: {
          value: ''
        }
      }
    });
  });
});
