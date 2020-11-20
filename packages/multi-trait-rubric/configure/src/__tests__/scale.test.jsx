import { shallow } from 'enzyme';
import React from 'react';

import { Scale } from '../scale';
import { excludeZeroTypes } from '../modals';

const scale = () => ({
  excludeZero: false,
  maxPoints: 2,
  scorePointsLabels: ['Non-Scorable', 'Unsatisfactory', 'Satisfactory'],
  traitLabel: 'Category',
  traits: [
    {
      name: 'Presentation',
      standards: [],
      description: '',
      scorePointsDescriptors: [
        'Handwriting is unreadable, or response is blank, not in English, or too brief to evaluate. ',
        'Handwriting poor\n' + '\n' + 'Overall appearance is distracting to unacceptable',
        'Handwriting is generally legible\n' + '\n' + 'Overall appearance is acceptable or better',
      ],
    },
  ]
});

describe('Scale', () => {
  let w;
  let onScaleChanged = jest.fn();
  let onScaleRemoved = jest.fn();

  const wrapper = extras => {
    const defaults = {
      classes: {},
      scale: scale(),
      scaleIndex: 0,
      onScaleChanged,
      onScaleRemoved,
      showStandards: true,
      ...extras
    };

    return shallow(<Scale {...defaults} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('renders without traits', () => {
      w = wrapper({ traits: [] });
      expect(w).toMatchSnapshot();
    });

    it('renders without standards', () => {
      w = wrapper({ showStandards: false });
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    beforeEach(() => {
      w = wrapper();
    });

    describe('changeExcludeZero', () => {
      it('removes zero', () => {
        const { traits, scorePointsLabels, excludeZero } = w.instance().props.scale;
        w.instance().changeExcludeZero(excludeZeroTypes.remove0);

        expect(onScaleChanged).toBeCalledWith(0, {
          excludeZero: !excludeZero,
          scorePointsLabels: scorePointsLabels.slice(1),
          traits: [{
            ...traits[0],
            scorePointsDescriptors: traits[0].scorePointsDescriptors.slice(1)
          }]
        });
      });
      it('add0 zero', () => {
        const { traits, scorePointsLabels, excludeZero } = w.instance().props.scale;
        w.instance().changeExcludeZero(excludeZeroTypes.add0);

        expect(onScaleChanged).toBeCalledWith(0, {
          excludeZero: !excludeZero,
          scorePointsLabels: ['', ...scorePointsLabels],
          traits: [{
            ...traits[0],
            scorePointsDescriptors: ['', ...traits[0].scorePointsDescriptors]
          }]
        });
      });
      it('shift to Left', () => {
        const { traits, scorePointsLabels, excludeZero } = w.instance().props.scale;
        w.instance().changeExcludeZero(excludeZeroTypes.shiftLeft);

        expect(onScaleChanged).toBeCalledWith(0, {
          excludeZero: !excludeZero,
          scorePointsLabels: scorePointsLabels.slice(0, -1),
          traits: [{
            ...traits[0],
            scorePointsDescriptors: traits[0].scorePointsDescriptors.slice(0, -1)
          }]
        });
      });
      it('shift to Right', () => {
        const { traits, scorePointsLabels, excludeZero } = w.instance().props.scale;
        w.instance().changeExcludeZero(excludeZeroTypes.shiftRight);

        expect(onScaleChanged).toBeCalledWith(0, {
          excludeZero: !excludeZero,
          scorePointsLabels: [...scorePointsLabels, ''],
          traits: [{
            ...traits[0],
            scorePointsDescriptors: [...traits[0].scorePointsDescriptors, '']
          }
          ]
        })
        ;
      });
    });

    describe('updateMaxPointsFieldValue', () => {
      it('shows alert box is number less then max points', () => {
        const { maxPoints } = w.instance().props.scale;
        w.instance().updateMaxPointsFieldValue({ target: { value: maxPoints - 1 } });

        expect(w.instance().state.newMaxPoints).toEqual(maxPoints - 1);
      });

      it('changes max points if number more then max points', () => {
        const { maxPoints } = w.instance().props.scale;
        w.instance().updateMaxPointsFieldValue({ target: { value: maxPoints + 1 } });

        expect(onScaleChanged).toBeCalledWith(0, { maxPoints: maxPoints + 1 });
      });
    });

    describe('changeMaxPoints', () => {
      it('removes zero', () => {
        w.instance().setState({ newMaxPoints: 10 });
        w.instance().changeMaxPoints();

        expect(onScaleChanged).toBeCalledWith(0, { maxPoints: 10 });
      });
    });

    describe('deleteScale', () => {
      it('calls onRemoveScale', () => {
        w.instance().deleteScale();

        expect(onScaleRemoved).toBeCalledWith(0);
      });
    });

    describe.only('onTraitRemoved', () => {
      // todo
      // it('calls onScaleChanged', () => {
      //   w.instance().setState({ traitToDeleteIndex: 0 });
      //   w.instance().onTraitRemoved();
      //
      //   expect(onScaleRemoved).toBeCalledWith(0, { traits: [] });
      // });

      it('does not call onScaleChanged if index not valid', () => {
        w.instance().setState({ traitToDeleteIndex: -1 });
        const result = w.instance().onTraitRemoved();

        expect(result).toEqual(false);
      });
    });

    describe.only('onTraitChanged', () => {
      it('calls onScaleChanged', () => {
        w.instance().onTraitChanged(0, {});

        expect(onScaleChanged).toBeCalledWith(0, { traits: [{}] });
      });
    });

    // todo
    // describe.only('onTraitDropped', () => {
    //   it('calls onScaleChanged', () => {
    //     w.instance().onTraitDropped({ index: 0 }, 1);
    //
    //     expect(onScaleChanged).toBeCalledWith(0, { traits: [{}]});
    //   });
    // });
  });
});
