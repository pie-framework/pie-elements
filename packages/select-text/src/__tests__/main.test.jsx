import { shallow } from 'enzyme';
import React from 'react';
import { Main } from '../main';

jest.mock('@pie-lib/text-select', () => ({
  prepareText: jest.fn()
}));

describe('main', () => {
  const getWrapper = props => {
    return shallow(
      <Main
        onSelectionChange={jest.fn()}
        model={{
          text: 'foo',
          tokens: [{ start: 0, end: 1, text: 'f' }]
        }}
        session={{
          selectedTokens: [{ start: 0, end: 1, text: 'f' }]
        }}
        classes={{}}
        { ...props }
      />
    );
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = getWrapper();
      expect(w).toMatchSnapshot();
    });

    it('renders rationale', () => {
      const w = getWrapper({ rationale: 'This is rationale '});
      expect(w).toMatchSnapshot();
    });

    it('renders showCorrect', () => {
      const w = getWrapper();
      w.instance().toggleShowCorrect();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w;

    beforeEach(() => {
      w = getWrapper();
    });

    it('shows correct answer', () => {
      const correctTokens = [{ start: 0, end: 1, text: 'f', correct: true }];
      w.setProps({
        model: { text: 'foo', tokens: correctTokens }
      });
      const result = w.instance().correctAnswer();
      expect(result).toEqual(correctTokens);
    });
  });
});
