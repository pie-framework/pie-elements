import * as React from 'react';
import { shallowChild } from '@pie-lib/test-utils';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import DeleteControl from '../delete';

describe('DeleteControl', () => {
  const defaultProps = {
    onDeleteClick: () => {},
    disabled: false
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallowChild(DeleteControl, defaultProps, 1);
  });

  it('renders correctly', () => {
    const component = wrapper();

    expect(component.find(Button).length).toEqual(1);
    expect(component.find(Delete).length).toEqual(1);
  });
});
