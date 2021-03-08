import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { NumberLine, Graph } from '../index';

describe('NumberLine', () => {
  const mkWrapper = (props, context) => {
    const onMoveElement = jest.fn();
    const onDeleteElements = jest.fn();
    const onAddElement = jest.fn();

    const defaults = {
      classes: {},
      model: {
        graph: {
          domain: [0, 1]
        }
      },
      onMoveElement,
      onDeleteElements,
      onAddElement
    };

    props = _.merge(defaults, props);
    const opts = _.merge({ context: context });
    const out = shallow(<NumberLine {...props} />, opts);
    return out;
  };

  describe('getSize', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mkWrapper();
    });

    it('sets default width', () => {
      expect(wrapper.find(Graph).prop('width')).toEqual(600);
    });

    it('sets default height', () => {
      expect(wrapper.find(Graph).prop('height')).toEqual(400);
    });

    it('sets custom width', () => {
      expect(
        mkWrapper({ model: { graph: { width: 1001 } } })
          .find(Graph)
          .prop('width')
      ).toEqual(1001);
    });

    it('sets custom height', () => {
      expect(
        mkWrapper({ model: { graph: { height: 701 } } })
          .find(Graph)
          .prop('height')
      ).toEqual(701);
    });
  });
});
