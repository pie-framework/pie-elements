import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';

import ImageContainer from '../image-container';

const answer1 = { id: 1, value: '1', containerIndex: 0 };
const answer2 = { id: 2, value: '2', containerIndex: 1 };

const container1 = {
  x: 0,
  y: 0,
  height: '0%',
  width: '0%'
};
const container2 = {
  x: 1,
  y: 1,
  height: '1%',
  width: '1%'
};

describe('Image Container', () => {
  let wrapper;

  const mkWrapper = (opts = {}) => {
    opts = _.extend(
      {
        answers: [],
        canDrag: true,
        draggingElement: {},
        image: {},
        onAnswerSelect: () => {},
        onDragAnswerBegin: () => {},
        onDragAnswerEnd: () => {},
        responseContainers: []
      },
      opts
    );

    return shallow(<ImageContainer {...opts} />);
  };

  beforeEach(() => {
    wrapper = mkWrapper();
  });

  describe('snapshots', () => {
    describe('answers', () => {
      it('renders', () => {
        const wrapper = mkWrapper([answer1, answer2]);
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('canDrag', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ canDrag: false });
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('draggingElement', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ draggingElement: answer2 });
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('image', () => {
      it('renders', () => {
        const wrapper = mkWrapper({
          src: 'https://picsum.photos/id/102/200/300',
          width: 0,
          scale: false,
          height: 0
        });
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('responseContainers', () => {
      it('renders', () => {
        const wrapper = mkWrapper([container1, container2]);
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('showDashedBorder', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ showDashedBorder: true });
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
