import React from 'react';
import {shallow} from 'enzyme';
import Matrix from '../Matrix';

describe('Matrix', () => {
  const getShallowMatrix = ((onSessionChange, propsToOverride = {}) => {
    const props = {
      prompt: 'magic prompt',
      teacherInstructions: 'instructions',
      session: {},
      matrixValues: {},
      rowLabels: [],
      columnLabels: [],
      disabled: false,
      onSessionChange,
      ...propsToOverride
    };
    return shallow(<Matrix {...props}/>);
  });

  describe('snapshot', () => {
    it('renders', () => {
      const onSessionChange = jest.fn();
      const shallowMatrix = getShallowMatrix(onSessionChange);
      expect(shallowMatrix).toMatchSnapshot();
    });
  });
});
