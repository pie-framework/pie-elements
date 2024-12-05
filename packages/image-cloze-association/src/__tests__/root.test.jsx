import React from 'react';
import { shallow } from 'enzyme';
import { ImageClozeAssociationComponent as Root } from '../root';

const model = {
  possibleResponses: ['firstImage', 'secondImage'],
  responseContainers: [{ index: 0 }, { index: 1 }],
  duplicateResponses: false,
  maxResponsePerZone: 1,
};

describe('Root', () => {
  let wrapper;
  const updateAnswer = jest.fn();

  const mkWrapper = (opts = {}) => {
    const props = {
      model,
      session: { answers: [] },
      updateAnswer,
      ...opts,
    };
    return shallow(<Root {...props} />);
  };

  beforeEach(() => {
    wrapper = mkWrapper();
  });

  describe('initialization', () => {
    it('initializes with correct possible responses', () => {
      const instance = wrapper.instance();
      expect(instance.state.possibleResponses).toEqual([
        { value: 'firstImage', id: '0' },
        { value: 'secondImage', id: '1' },
      ]);
    });
  });

  describe('handleOnAnswerSelect', () => {
    it('removes response from possibleResponses on answer select', () => {
      const instance = wrapper.instance();
      instance.handleOnAnswerSelect({ value: 'firstImage', id: '0' }, 0);
      expect(instance.state.possibleResponses).toEqual([{ value: 'secondImage', id: '1' }]);
    });

    it('adds response back to possibleResponses on answer remove', () => {
      const instance = wrapper.instance();
      instance.handleOnAnswerSelect({ value: 'firstImage', id: '0' }, 0);
      instance.handleOnAnswerRemove({ value: 'firstImage', id: '0', containerIndex: 0 });
      expect(instance.state.possibleResponses).toEqual([
        { value: 'secondImage', id: '1' },
        { value: 'firstImage', id: '0' },
      ]);
    });

    it('preserves id when adding back to possibleResponses', () => {
      const instance = wrapper.instance();
      instance.handleOnAnswerSelect({ value: 'firstImage', id: '0' }, 0);
      instance.handleOnAnswerRemove({ value: 'firstImage', id: '0', containerIndex: 0 });
      expect(instance.state.possibleResponses[1].id).toBe('0');
    });
  });

  describe('snapshots', () => {
    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
