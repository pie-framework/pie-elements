import * as React from 'react';
import Box from '../box';
import { shallowChild } from '@pie-lib/test-utils';

describe('Box', () => {
  const defaultProps = {
    children: 'child content',
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallowChild(Box, defaultProps, 1);
  });

  it('renders correctly', () => {
    const component = wrapper();

    expect(component.html().includes('child content')).toEqual(true);
    expect(component.find('hr').length).toEqual(1);
  });
});
