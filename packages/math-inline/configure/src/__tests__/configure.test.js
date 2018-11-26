import * as React from 'react';
import Configure from '../configure';
import GeneralConfigBlock from '../general-config-block';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { InputContainer } from '@pie-lib/config-ui';
import { FeedbackConfig } from '@pie-lib/config-ui';
import { shallowChild } from '@pie-lib/test-utils';
import { shallow } from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';

export const defaultProps = {
  model: {
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
  }
};

const clonedDefaultProps = cloneDeep(defaultProps);

describe('Configure', () => {
  let wrapper;
  let component;

  beforeEach(() => {
    wrapper = shallowChild(Configure, defaultProps, 2);
  });

  it('renders correctly', () => {
    component = wrapper();

    expect(component.find(GeneralConfigBlock).length).toEqual(1);
    expect(component.find(FeedbackConfig).length).toEqual(1);
  });
});

describe('GeneralConfigBlock', () => {
  let wrapper;
  let props;
  let component;

  beforeEach(() => {
    props = {
      model: defaultProps.model,
      onResponseTypeChange: jest.fn(),
      onLayoutChange: jest.fn()
    };

    wrapper = shallowChild(GeneralConfigBlock, props, 1);
  });

  it('renders correctly', () => {
    component = wrapper();

    expect(component.find(InputContainer).length).toBeGreaterThan(1);
  });
});
