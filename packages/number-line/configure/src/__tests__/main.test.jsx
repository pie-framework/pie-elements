/* eslint-disable react/display-name */
import { render } from '@testing-library/react';
import React from 'react';
import { Main } from '../main';
import { model as defaultModel, configuration as defaultConfig } from '../defaults';

jest.mock('../number-text-field', () => (props) => (
  <input data-testid="number-text-field" {...props} />
));

jest.mock('../card-bar', () => (props) => (
  <div data-testid="card-bar" {...props} />
));

jest.mock('../size', () => (props) => (
  <div data-testid="size" {...props} />
));

jest.mock('../domain', () => (props) => (
  <div data-testid="domain" {...props} />
));

jest.mock('../arrows', () => (props) => (
  <div data-testid="arrows" {...props} />
));

jest.mock('../point-config', () => (props) => (
  <div data-testid="point-config" {...props} />
));

jest.mock('../ticks', () => (props) => (
  <div data-testid="ticks" {...props} />
));

jest.mock('@pie-element/number-line', () => ({
  NumberLineComponent: (props) => <div data-testid="number-line-component" {...props} />,
  dataConverter: {
    lineIsSwitched: jest.fn(),
    switchGraphLine: jest.fn(),
    toGraphFormat: jest.fn(),
    toSessionFormat: jest.fn(),
  },
  tickUtils: {
    getMinorLimits: jest.fn(() => ({ min: 0.1, max: 1 })),
    getMajorMinorValues: jest.fn(() => ({ major: [0, 1, 2], minor: [0, 0.5, 1, 1.5, 2] })),
    generateMinorValues: jest.fn(() => ({ decimal: [0.1, 0.2, 0.5], fraction: ['1/10', '1/5', '1/2'] })),
    generateMajorValues: jest.fn(() => [0, 1, 2]),
    snapElements: jest.fn((domain, ticks, elements) => elements),
    generateMajorValuesForMinor: jest.fn(() => ({ decimal: [0, 1, 2, 3], fraction: ['0', '1', '2', '3'] })),
  },
}));

jest.mock('@pie-lib/editable-html-tip-tap', () => (props) => (
  <div data-testid="editable-html">{props.markup}</div>
));

jest.mock('@pie-lib/config-ui', () => ({
  FormSection: (props) => <div data-testid="form-section">{props.children}</div>,
  FeedbackConfig: (props) => <div data-testid="feedback-config" />,
  InputCheckbox: (props) => <div data-testid="input-checkbox" />,
  InputContainer: (props) => <div data-testid="input-container">{props.children}</div>,
  AlertDialog: (props) => props.open ? <div data-testid="alert-dialog">{props.text}</div> : null,
  layout: {
    ConfigLayout: (props) => <div data-testid="config-layout">{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div data-testid="settings-panel" onChange={props.onChange} />,
    toggle: jest.fn(),
  },
}));

describe('main', () => {
  let onChange = jest.fn();

  const wrapper = (extras) => {
    const defaultProps = {
      classes: {},
      className: 'className',
      onChange,
      onConfigurationChanged: jest.fn(),
      model: { correctResponse: [], graph: { ...defaultModel.graph } },
      configuration: { ...defaultConfig },
      imageSupport: {},
      uploadSoundSupport: {},
    };
    const props = { ...defaultProps, ...extras };
    return render(<Main {...props} />);
  };

  const createInstance = (extras) => {
    const defaultProps = {
      classes: {},
      className: 'className',
      onChange,
      onConfigurationChanged: jest.fn(),
      model: { correctResponse: [], graph: { ...defaultModel.graph } },
      configuration: { ...defaultConfig },
      imageSupport: {},
      uploadSoundSupport: {},
    };
    const props = { ...defaultProps, ...extras };
    const instance = new Main(props);
    instance.setState = jest.fn((state, callback) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
      if (callback) callback();
    });
    return instance;
  };

  beforeEach(() => {
    onChange = jest.fn();
  });

  describe('logic', () => {
    const fn = (fnName, args, expected) => {
      describe(fnName, () => {
        it(`(${args.map((a) => JSON.stringify(a)).join(',')})`, () => {
          const instance = createInstance();
          instance[fnName].apply(instance, args);
          expect(onChange).toHaveBeenCalledWith(expected);
        });
      });
    };

    fn('graphChange', [{ foo: true }], {
      graph: expect.objectContaining({ foo: true }),
    });

    fn('changeSize', [{ width: 0, height: 0 }], {
      graph: expect.objectContaining({ width: 0, height: 0 }),
    });

    describe('changeMaxNoOfPoints', () => {
      it('changes max number of points', () => {
        const instance = createInstance();
        instance.changeMaxNoOfPoints({}, 10);
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            graph: expect.objectContaining({ maxNumberOfPoints: 10 }),
          })
        );
      });
    });

    fn('changeGraphTitle', ['title'], {
      graph: expect.objectContaining({ title: 'title' }),
    });

    describe('changeTicks', () => {
      it('changes ticks', () => {
        const instance = createInstance();
        instance.changeTicks({ ticks: { minor: 1, major: 3, tickIntervalType: 'Integer' } });
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            correctResponse: [],
            graph: expect.objectContaining({
              ticks: expect.objectContaining({ minor: 1, major: 3, tickIntervalType: 'Integer' })
            }),
          })
        );
      });
    });

    fn(
      'changeArrows',
      [{ left: false, right: false }],
      expect.objectContaining({
        graph: expect.objectContaining({
          arrows: { left: false, right: false },
        }),
      }),
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
        const instance = createInstance();
        instance.props.model.correctResponse = ['Point1', 'Point2'];
        instance.clearCorrectResponse();
        expect(onChange).toHaveBeenCalledWith({ correctResponse: [] });
      });
    });

    describe('undoCorrectResponse', () => {
      it('undo correct response', () => {
        const instance = createInstance();
        instance.props.model.correctResponse = ['Point1', 'Point2'];
        instance.undoCorrectResponse();
        expect(onChange).toHaveBeenCalledWith({ correctResponse: ['Point1'] });
      });
    });

  });
});
