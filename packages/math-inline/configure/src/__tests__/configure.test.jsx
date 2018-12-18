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

jest.mock('../general-config-block', () => () => <div>GeneralConfigBlock</div>);

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
