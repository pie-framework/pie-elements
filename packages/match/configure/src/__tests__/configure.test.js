import * as React from 'react';
import { Config } from '../configure';
import AnswerConfigBlock from '../answer-config-block';
import GeneralConfigBlock from '../general-config-block';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { FeedbackConfig } from '@pie-lib/config-ui';
import { shallowChild } from '@pie-lib/test-utils';
import { shallow } from 'enzyme';
import { styles } from '../answer-config-block';
import cloneDeep from 'lodash/cloneDeep';
import defaultValues from '../defaults';

jest.mock('@material-ui/core', () => ({
  Input: props => <div/>,
  Button: props => <div/>,
}));

jest.mock('@pie-lib/config-ui', () => ({
  FeedbackConfig: props => (<div/>),
  InputCheckbox: props => (<div/>),
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  },
  settings: {
    Panel: props => <div onChange={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn()
  }
}));

export const defaultProps = {
  model: {
    id: '1',
    element: 'match-element',
    rows: [
      {
        id: 1,
        title: 'Question Text 1',
        values: [false, false]
      },
      {
        id: 2,
        title: 'Question Text 2',
        values: [false, false]
      },
      {
        id: 3,
        title: 'Question Text 3',
        values: [false, false]
      },
      {
        id: 4,
        title: 'Question Text 4',
        values: [false, false]
      }
    ],
    lockChoiceOrder: true,
    partialScoring: [],
    layout: 3,
    headers: ['Column 1', 'Column 2', 'Column 3'],
    choiceMode: 'radio',
    feedback: {
      correct: {
        type: 'none',
        default: 'Correct'
      },
      partial: {
        type: 'none',
        default: 'Nearly'
      },
      incorrect: {
        type: 'none',
        default: 'Incorrect'
      }
    },
  },
  configuration: defaultValues.configuration
};
const clonedDefaultProps = cloneDeep(defaultProps);

describe('Configure', () => {
  let wrapper;
  let component;

  beforeEach(() => {
    wrapper = props => {
      const configProps = {
        ...defaultProps,
        ...props
      };

      return shallow(<Config { ...configProps } />);
    };
  });

  it('renders correctly', () => {
    component = wrapper();

    expect(component.find(GeneralConfigBlock).length).toEqual(1);
    expect(component.find(FeedbackConfig).length).toEqual(1);
  });

  it('updates choiceMode correctly', () => {
    let onModelChanged = jest.fn();

    component = wrapper({
      onModelChanged
    });

    component.instance().onResponseTypeChange('checkbox');

    expect(onModelChanged).toBeCalledWith(
      expect.objectContaining({ choiceMode: 'checkbox' })
    );

    onModelChanged = jest.fn();

    component = wrapper({
      onModelChanged,
      model: {
        ...defaultProps.model,
        choiceMode: 'checkbox',
        rows: [
          {
            id: 1,
            title: 'Question Text 1',
            values: [true, true]
          },
          {
            id: 2,
            title: 'Question Text 2',
            values: [true, true]
          },
          {
            id: 3,
            title: 'Question Text 3',
            values: [false, true]
          },
          {
            id: 4,
            title: 'Question Text 4',
            values: [true, false]
          }
        ]
      }
    });

    component.instance().onResponseTypeChange('radio');

    expect(onModelChanged).toBeCalledWith({
      id: '1',
      element: 'match-element',
      rows: [
        {
          id: 1,
          title: 'Question Text 1',
          values: [false, false]
        },
        {
          id: 2,
          title: 'Question Text 2',
          values: [false, false]
        },
        {
          id: 3,
          title: 'Question Text 3',
          values: [false, true]
        },
        {
          id: 4,
          title: 'Question Text 4',
          values: [true, false]
        }
      ],
      lockChoiceOrder: true,
      partialScoring: [],
      layout: 3,
      headers: ['Column 1', 'Column 2', 'Column 3'],
      choiceMode: 'radio',
      feedback: {
        correct: {
          type: 'none',
          default: 'Correct'
        },
        partial: {
          type: 'none',
          default: 'Nearly'
        },
        incorrect: {
          type: 'none',
          default: 'Incorrect'
        }
      },
    });
  });

  it('adds a row correctly', () => {
    let onModelChanged = jest.fn();
    component = wrapper({
      onModelChanged
    });

    component.instance().onAddRow();

    expect(onModelChanged).toBeCalledWith(
      expect.objectContaining({
        rows: [
          {
            id: 1,
            title: 'Question Text 1',
            values: [false, false]
          },
          {
            id: 2,
            title: 'Question Text 2',
            values: [false, false]
          },
          {
            id: 3,
            title: 'Question Text 3',
            values: [false, false]
          },
          {
            id: 4,
            title: 'Question Text 4',
            values: [false, false]
          },
          {
            id: 6,
            title: 'Question Text 5',
            values: [false, false]
          }
        ]
      })
    );
  });

  it('deletes a row correctly', () => {
    let onModelChanged = jest.fn();
    component = wrapper({
      onModelChanged
    });

    component.instance().onDeleteRow(2);

    expect(onModelChanged).toBeCalledWith(
      expect.objectContaining({
        rows: [
          {
            id: 1,
            title: 'Question Text 1',
            values: [false, false]
          },
          {
            id: 2,
            title: 'Question Text 2',
            values: [false, false]
          },
          {
            id: 4,
            title: 'Question Text 4',
            values: [false, false]
          }
        ]
      })
    );
  });

  it('updates layout correctly', () => {
    let onModelChanged = jest.fn();
    component = wrapper({
      onModelChanged
    });

    component.instance().onLayoutChange(4);

    expect(onModelChanged).toBeCalledWith(
      expect.objectContaining({
        layout: 4,
        rows: [
          {
            id: 1,
            title: 'Question Text 1',
            values: [false, false, false]
          },
          {
            id: 2,
            title: 'Question Text 2',
            values: [false, false, false]
          },
          {
            id: 4,
            title: 'Question Text 4',
            values: [false, false, false]
          }
        ]
      })
    );

    onModelChanged = jest.fn();
    component = wrapper({
      onModelChanged
    });

    component.instance().onLayoutChange(5);

    expect(onModelChanged).toBeCalledWith(
      expect.objectContaining({
        layout: 5,
        rows: [
          {
            id: 1,
            title: 'Question Text 1',
            values: [false, false, false, false, false]
          },
          {
            id: 2,
            title: 'Question Text 2',
            values: [false, false, false, false, false]
          },
          {
            id: 4,
            title: 'Question Text 4',
            values: [false, false, false, false, false]
          }
        ]
      })
    );
  });
});

describe('GeneralConfigBlock', () => {
  let wrapper;
  let props;
  let component;

  beforeEach(() => {
    props = {
      model: defaultProps.model,
      configuration: defaultProps.configuration,
      onResponseTypeChange: jest.fn(),
      onLayoutChange: jest.fn()
    };

    wrapper = shallowChild(GeneralConfigBlock, props, 1);
  });

  it('renders correctly', () => {
    component = wrapper();

    expect(component.find(Select).length).toBeGreaterThan(1);
    expect(component.find(MenuItem).length).toBeGreaterThan(3);
  });
});

describe('AnswerConfigBlock', () => {
  let wrapper;
  let props;
  let component;
  let topWrapper;
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();

    props = {
      classes: styles,
      model: clonedDefaultProps.model,
      configuration: defaultProps.configuration,
      onChange: onChange,
      onAddRow: jest.fn(),
      onDeleteRow: jest.fn()
    };

    wrapper = shallowChild(AnswerConfigBlock, props, 1);
    topWrapper = shallow(<AnswerConfigBlock {...props} />);
  });

  describe('render', () => {
    it('renders correctly', () => {
      component = wrapper();

      expect(component.find(Input).length).toBeGreaterThan(2);
      expect(component.find(Button).length).toEqual(1);
    });
  });

  describe('moveRow', () => {
    it('calls onChange', () => {
      component = topWrapper.dive().instance();

      component.moveRow(0, 1);

      expect(onChange).toBeCalledWith({
        ...clonedDefaultProps.model,
        rows: [
          {
            id: 1,
            title: 'Question Text 1',
            values: [false, false]
          },
          {
            id: 2,
            title: 'Question Text 2',
            values: [false, false]
          },
          {
            id: 3,
            title: 'Question Text 3',
            values: [false, false]
          },
          {
            id: 4,
            title: 'Question Text 4',
            values: [false, false]
          }
        ]
      });
    });
  });
});
