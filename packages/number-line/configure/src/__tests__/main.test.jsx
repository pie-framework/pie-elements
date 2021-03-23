/* eslint-disable react/display-name */
import { shallow } from 'enzyme';
import React from 'react';
import { Main } from '../main';
import {
  model as defaultModel,
  configuration as defaultConfig
} from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  FormSection: () => <div />,
  FeedbackConfig: () => <div />,
  InputCheckbox: () => <div />
}));

describe('main', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      model: { correctResponse: [], graph: { ...defaultModel } },
      configuration: { ...defaultConfig }
    };
    const props = { ...defaults, ...extras };
    return shallow(<Main {...props} />);
  };
  describe.only('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {
    const fn = (fnName, args, expected) => {
      describe(fnName, () => {
        it(`(${args.map(a => JSON.stringify(a)).join(',')})`, () => {
          const w = wrapper();
          const i = w.instance();
          i[fnName].apply(w.instance(), args);
          expect(onChange).toHaveBeenCalledWith(expected);
        });
      });
    };

    fn('graphChange', [{ foo: true }], {
      graph: expect.objectContaining({ foo: true })
    });

    fn('changeSize', [{ width: 0, height: 0 }], {
      graph: expect.objectContaining({ width: 0, height: 0 })
    });

    fn('changeMaxNoOfPoints', [{}, 10], {
      graph: expect.objectContaining({ maxNumberOfPoints: 10 })
    });

    fn('changeGraphTitle', ['title'], {
      graph: expect.objectContaining({ title: 'title' })
    });

    fn(
      'changeTicks',
      [{ minor: 1, major: 3 }],
      expect.objectContaining({
        correctResponse: [],
        graph: expect.objectContaining({ ticks: { minor: 1, major: 3 } })
      })
    );

    fn(
      'changeArrows',
      [{ left: false, right: false }],
      expect.objectContaining({
        graph: expect.objectContaining({
          arrows: { left: false, right: false }
        })
      })
    );

    describe('moveCorrectResponse', () => {});
    describe('moveInitalView', () => {});
    describe('availableTypesChange', () => {});
    describe('deleteCorrectResponse', () => {});
    describe('deleteInitialView', () => {});
    describe('addCorrectResponse', () => {});
    describe('addInitialView', () => {});

    describe('clearCorrectResponse', () => {
      it('clears correct response', () => {
        const w = wrapper();
        const i = w.instance();
        i.props.model.correctResponse = ['Point1', 'Point2'];
        i.clearCorrectResponse();
        expect(onChange).toHaveBeenCalledWith({correctResponse: []});
      });
    });

    describe('clearInitialView', () => {
      it('clear initial elements', () => {
        const w = wrapper();
        const i = w.instance();
        i.props.model.initialElements = ['Point1', 'Point2'];
        i.clearInitialView();
        const graph = { ...defaultModel.graph, initialElements: []}
        expect(onChange).toHaveBeenCalledWith({graph});
      });
    });

    describe('undoCorrectResponse', () => {
      it('undo correct response', () => {
        const w = wrapper();
        const i = w.instance();
        i.props.model.correctResponse = ['Point1', 'Point2'];
        i.undoCorrectResponse();
        expect(onChange).toHaveBeenCalledWith({correctResponse: ['Point1']});
      });
    });

    describe('undoInitialView', () => {
      it('undo initial response', () => {
        const w = wrapper();
        const i = w.instance();
        i.props.model.initialElements = ['Point1'];
        i.undoInitialView();
        const graph = { ...defaultModel.graph, initialElements: []};
        expect(onChange).toHaveBeenCalledWith({graph});
      });
    });
  });
});
