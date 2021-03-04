import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Konva from 'konva';

import Container, { Container as ContainerComp } from '../hotspot/container';
import HotspotComponent from '../hotspot/index';

Konva.isBrowser = false;

describe('HotspotComponent', () => {
  describe('renders', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = props => shallow(<HotspotComponent {...props} />);
    });

    it('snapshot', () => {
      let w = wrapper();

      expect(w).toMatchSnapshot();
    });

    it('snapshot with rationale', () => {
      let w = wrapper({ rationale: 'This is rationale' });

      expect(w).toMatchSnapshot();
    });

    it('snapshot with padding having a size accordingly to strokeWidth', () => {
      let w = shallow(<ContainerComp
        strokeWidth={50}
        classes={{}}
        dimensions={{ width: 100, height: 100 }}
        onSelectChoice={jest.fn()}
        disabled={false}
        hotspotColor='#000'
        outlineColor='#FAFAFA'
        imageUrl='data:image/jpeg;base64,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'
        isEvaluateMode={false}
        session={{ answers: [{ id: '1' }, { id: '2' }] }}
        shapes={{
          rectangles: [
            {
              id: '1',
              correct: true,
              x: 0,
              y: 0,
              width: 80,
              height: 80
            },
          ],
          polygons: []
        }}
      />);

      expect(w).toMatchSnapshot();
    });
  });
});

describe('Container', () => {
  let onSelectChoice, wrapper;

  const mkWrapper = (opts = {}) => {
    opts = _.extend(
      {
        classes: {
          base: 'base'
        },
        dimensions: {
          height: 0,
          width: 0
        },
        disabled: false,
        hotspotColor: 'rgba(137, 183, 244, 0.65)',
        imageUrl: '',
        isEvaluateMode: false,
        outlineColor: 'blue',
        session: { answers: [] },
        shapes: {
          rectangles: [],
          polygons: []
        }
      },
      opts
    );

    return shallow(<Container {...opts} onSelectChoice={onSelectChoice}/>);
  };

  beforeEach(() => {
    onSelectChoice = jest.fn();
    wrapper = mkWrapper();
  });

  describe('snapshots', () => {
    describe('outline color', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ outlineColor: 'red' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('hotspot color', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ hotspotColor: 'rgba(217, 30, 24, 0.65)' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('image', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ imageUrl: 'https://picsum.photos/id/102/200/300' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('shapes', () => {
      it('renders', () => {
        const wrapper = mkWrapper({
          shapes: {
            rectangles: [
              { id: '1', x: 5, y: 5, width: 5, height: 5 },
              { id: '2', x: 25, y: 25, width: 5, height: 5 }
            ],
            polygons: [
              { id: '3', points: [{ x: 94, y: 4 }, { x: 89, y: 4 }, { x: 36, y: 40 }] }
            ]
          },
          imageUrl: 'https://picsum.photos/id/102/200/300',
          dimensions: {
            width: 200,
            height: 300
          }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });
  });
});
