import * as React from 'react';
import GeneralConfigBlock from '../general-config-block';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { InputContainer } from '@pie-lib/config-ui';
import { FeedbackConfig } from '@pie-lib/config-ui';
import { shallowChild } from '@pie-lib/test-utils';
import { shallow } from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';

jest.mock('../answer-block', () => () => <div>AnswerBlock</div>);

jest.mock('@pie-lib/math-toolbar', () => () => <div>MathToolbar</div>);

const defaultProps = {
  id: '1',
  element: 'math-inline',
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
  }
};

describe('GeneralConfigBlock', () => {
  let wrapper;
  let props;
  let component;

  beforeEach(() => {
    props = {
      model: defaultProps,
      onResponseTypeChange: jest.fn(),
      onLayoutChange: jest.fn(),
      onChange: jest.fn()
    };

    wrapper = shallow(<GeneralConfigBlock {...props} />);
  });

  it('renders correctly', () => {
    component = wrapper.instance();

    expect(wrapper).toMatchSnapshot();
  });
});
