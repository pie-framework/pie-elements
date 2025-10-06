import * as React from 'react';
import AddRow from '../add-row';
import Button from '@material-ui/core/Button';
import AddButton from '@material-ui/icons/Add';
import { shallowChild } from '@pie-lib/test-utils';

describe('AddRow', () => {
  const defaultProps = {
    onAddClick: () => {},
    disabled: false,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallowChild(AddRow, defaultProps, 1);
  });

  it('renders correctly', () => {
    const component = wrapper();

    expect(component.find(Button).length).toEqual(1);
    expect(component.find(AddButton).length).toEqual(1);
  });
});
