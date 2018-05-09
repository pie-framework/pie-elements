import * as React from 'react';
import AddPoint from '../add-point';
import Button from 'material-ui/Button';
import AddButton from '@material-ui/icons/Add';
import { shallowChild } from '@pie-lib/test-utils';

describe('AddPoint', () => {
  const defaultProps = {
    onAddClick: () => {},
    disabled: false,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallowChild(AddPoint, defaultProps, 1);
  });

  it('renders correctly', () => {
    const component = wrapper();

    expect(component.find(Button).length).toEqual(1);
    expect(component.find(AddButton).length).toEqual(1);
  });
});
