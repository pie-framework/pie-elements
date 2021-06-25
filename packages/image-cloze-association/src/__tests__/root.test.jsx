import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Root from '../root';

const answer1 = { id: 1, value: '1', containerIndex: 0 };
const answer2 = { id: 2, value: '2', containerIndex: 1 };

const model = {
  answers: [],
  canDrag: true,
  draggingElement: {},
  image: {},
  onAnswerSelect: () => {},
  onDragAnswerBegin: () => {},
  onDragAnswerEnd: () => {},
  responseContainers: [],
  possibleResponses: [],
  duplicateResponses: false,
  maxResponsePerZone: 5,
  showDashedBorder: true
};

describe('Root', () => {
  let wrapper;

  const mkWrapper = (opts = {}) => {
    opts = _.extend(
      {
        model,
        updateAnswer: () => {}
      },
      opts
    );

    return shallow(<Root {...opts} />);
  };

  beforeEach(() => {
    wrapper = mkWrapper();
  });

  describe('snapshots', () => {
    describe('model', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ model: { ...model, answers: [answer1, answer2] } });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });
  });
});
