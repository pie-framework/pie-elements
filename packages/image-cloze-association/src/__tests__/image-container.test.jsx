import React from 'react';
import { render } from '@testing-library/react';

import ImageContainer from '../image-container';

jest.mock('@dnd-kit/core', () => ({
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

const answer1 = { id: 1, value: '1', containerIndex: 0 };
const answer2 = { id: 2, value: '2', containerIndex: 1 };

const container1 = {
  x: 0,
  y: 0,
  height: '0%',
  width: '0%',
};
const container2 = {
  x: 1,
  y: 1,
  height: '1%',
  width: '1%',
};

describe('Image Container', () => {
  const mkWrapper = (opts = {}) => {
    opts = {
      answers: [],
      canDrag: true,
      draggingElement: {},
      image: {},
      onAnswerSelect: () => {},
      onDragAnswerBegin: () => {},
      onDragAnswerEnd: () => {},
      responseContainers: [],
      ...opts,
    };

    return render(<ImageContainer {...opts} />);
  };

  describe('snapshots', () => {
    describe('answers', () => {
      it('renders', () => {
        const { container } = mkWrapper({ answers: [answer1, answer2] });
        expect(container).toMatchSnapshot();
      });
    });

    describe('canDrag', () => {
      it('renders', () => {
        const { container } = mkWrapper({ canDrag: false });
        expect(container).toMatchSnapshot();
      });
    });

    describe('draggingElement', () => {
      it('renders', () => {
        const { container } = mkWrapper({ draggingElement: answer2 });
        expect(container).toMatchSnapshot();
      });
    });

    describe('image', () => {
      it('renders', () => {
        const { container } = mkWrapper({
          image: {
            src: 'https://picsum.photos/id/102/200/300',
            width: 0,
            scale: false,
            height: 0,
          },
        });
        expect(container).toMatchSnapshot();
      });
    });

    describe('responseContainers', () => {
      it('renders', () => {
        const { container } = mkWrapper({ responseContainers: [container1, container2] });
        expect(container).toMatchSnapshot();
      });
    });

    describe('showDashedBorder', () => {
      it('renders', () => {
        const { container } = mkWrapper({ showDashedBorder: true });
        expect(container).toMatchSnapshot();
      });
    });
  });
});
