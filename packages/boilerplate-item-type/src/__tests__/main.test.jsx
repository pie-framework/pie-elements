import { shallow } from 'enzyme';
import React from 'react';
import Main from '../main';

jest.mock('@pie-element/pie-utils/text-select', () => ({
  prepareText: jest.fn(),
}));

describe('main', () => {
  const getWrapper = (props) => {
    return shallow(
      <Main
        onSessionChange={jest.fn()}
        model={{}}
        session={{}}
        classes={{}}
        {...props}
      />,
    );
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = getWrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
