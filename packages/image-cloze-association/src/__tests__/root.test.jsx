import React from 'react';
import { render } from '@testing-library/react';
import { ImageClozeAssociationComponent as Root } from '../root';

jest.mock('@dnd-kit/core', () => ({
  DragOverlay: ({ children }) => <div>{children}</div>,
  useDraggable: () => ({
    setNodeRef: jest.fn(),
    attributes: {},
    listeners: {},
  }),
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
  }),
}));

jest.mock('@pie-lib/drag', () => ({
  DragProvider: ({ children }) => <div>{children}</div>,
  ICADroppablePlaceholder: ({ children }) => <div>{children}</div>,
}));

const model = {
  possibleResponses: ['firstImage', 'secondImage'],
  responseContainers: [
    { index: 0, x: 0, y: 0, width: '10%', height: '10%' },
    { index: 1, x: 20, y: 20, width: '10%', height: '10%' },
  ],
  duplicateResponses: false,
  maxResponsePerZone: 1,
  image: { src: 'test.jpg', width: 100, height: 100 },
};

describe('Root', () => {
  const updateAnswer = jest.fn();

  const mkWrapper = (opts = {}) => {
    const props = {
      model,
      session: { answers: [] },
      updateAnswer,
      ...opts,
    };
    return render(<Root {...props} />);
  };

  const createInstance = (opts = {}) => {
    const props = {
      model,
      session: { answers: [] },
      updateAnswer,
      ...opts,
    };
    const instance = new Root(props);

    // Mock setState to execute updates immediately for testing
    instance.setState = jest.fn((state) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
    });

    return instance;
  };

  describe('initialization', () => {
    it('initializes with correct possible responses', () => {
      const instance = createInstance();
      expect(instance.state.possibleResponses).toEqual([
        { value: 'firstImage', id: '0' },
        { value: 'secondImage', id: '1' },
      ]);
    });
  });

  describe('handleOnAnswerSelect', () => {
    it('removes response from possibleResponses on answer select', () => {
      const instance = createInstance();
      instance.handleOnAnswerSelect({ value: 'firstImage', id: '0' }, 0);
      expect(instance.state.possibleResponses).toEqual([{ value: 'secondImage', id: '1' }]);
    });

    it('adds response back to possibleResponses on answer remove', () => {
      const instance = createInstance();
      instance.handleOnAnswerSelect({ value: 'firstImage', id: '0' }, 0);
      instance.handleOnAnswerRemove({ value: 'firstImage', id: '0', containerIndex: 0 });
      expect(instance.state.possibleResponses).toEqual([
        { value: 'secondImage', id: '1' },
        { value: 'firstImage', id: '0' },
      ]);
    });

    it('preserves id when adding back to possibleResponses', () => {
      const instance = createInstance();
      instance.handleOnAnswerSelect({ value: 'firstImage', id: '0' }, 0);
      instance.handleOnAnswerRemove({ value: 'firstImage', id: '0', containerIndex: 0 });
      expect(instance.state.possibleResponses[1].id).toBe('0');
    });
  });

});
