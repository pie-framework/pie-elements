import { shallow } from 'enzyme';
import React from 'react';

import { Choices } from '../choices';
import sensibleDefaults from '../defaults';
import { createSlateMarkup, processMarkup } from '../markupUtils';

jest.mock('@pie-lib/config-ui', () => ({
  choiceUtils: {
    firstAvailableIndex: jest.fn()
  },
  settings: {
    Panel: props => <div {...props} />,
    toggle: jest.fn(),
    radio: jest.fn(),
    dropdown: jest.fn()
  },
  layout: {
    ConfigLayout: props => <div>{props.children}</div>
  }
}));

const model = {
  markup: '{{0}} + {{1}} = 15',
  prompt: '<p>Solve the equation below.</p>',
  choices: [
    { value: '<div>6</div>', id: '0' },
    { value: '<div>9</div>', id: '1' },
    { value: '<div>12</div>', id: '2' },
  ],
  choicesPosition: 'below',
  correctResponse: {
    '0': '0',
    '1': '1'
  },
  duplicates: true,
  alternateResponses: [
    ['1'],
    ['0']
  ],
  rationale: '<p>A correct response is shown below:</p><ul><li>2/6 = 1/3</li><li>4/8 = 1/2</li><li>6/10 = 3/5</li><li>9/12 = 3/4</li></ul>'
};

const prepareModel = (model = {}) => {
  const joinedObj = {
    ...sensibleDefaults.model,
    ...model
  };
  const slateMarkup = model.slateMarkup ||
    createSlateMarkup(joinedObj.markup, joinedObj.choices, joinedObj.correctResponse);
  const processedMarkup = processMarkup(slateMarkup);

  return {
    ...joinedObj,
    slateMarkup,
    markup: processedMarkup.markup,
    correctResponse: processedMarkup.correctResponse
  };
};

describe('Choices', () => {
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
  });

  const wrapper = extras => {
    const defaults = {
      onChange,
      classes: {},
      model: prepareModel(model),
      duplicates: true,
      ...extras
    };
    const props = { ...defaults };

    return shallow(<Choices {...props} />, { disableLifecycleMethods: true });
  };

  describe('snapshot', () => {
    it('renders with duplicates', () => {
      expect(wrapper()).toMatchSnapshot();
    });

    it('renders without duplicates', () => {
      expect(wrapper({ duplicates: false })).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w;

    beforeEach(() => {
      w = wrapper();
    });

    describe('onChoiceChanged', () => {
      it('removes a choice if its new value is empty', () => {
        w.instance().onChoiceChanged('<div>12</div>', '', '2');

        expect(onChange).toBeCalledWith([
          { value: '<div>6</div>', id: '0' },
          { value: '<div>9</div>', id: '1' }
        ]);
      });

      it('does not add new choice if it is identical to another choice', () => {
        w.instance().onChoiceChanged('', '<div>9</div>', '2');

        expect(onChange).toBeCalledWith([
          { value: '<div>6</div>', id: '0' },
          { value: '<div>9</div>', id: '1' }
        ]);
      });

      it('does not change choice if it would be identical to another choice', () => {
        w.instance().onChoiceChanged('<div>6</div>', '<div>9</div>', '0');

        expect(onChange).toHaveBeenCalledTimes(0);
      });

      it('does not remove a choice if its new value is empty, but is used in correct response', () => {
        const jsdomAlert = window.alert;  // remember the jsdom alert

        window.alert = () => {
        };

        w.instance().onChoiceChanged('<div>9</div>', '', '1');

        expect(onChange).not.toBeCalled();

        window.alert = jsdomAlert;
      });

      it('does not remove a choice if its new value is empty, but is used in alternate response', () => {
        const jsdomAlert = window.alert;  // remember the jsdom alert

        window.alert = () => {
        };

        wrapper({ markup: '{{0}}' })
          .instance().onChoiceChanged('<div>9</div>', '', '1');

        expect(onChange).not.toBeCalled();

        window.alert = jsdomAlert;
      });

      it('does not remove a choice if its new value is empty, but the old value was empty as well (at focusing a new choice without editing)', () => {
        const jsdomAlert = window.alert;  // remember the jsdom alert

        window.alert = () => {
        };

        wrapper({ markup: '{{0}}' })
          .instance().onChoiceChanged('', '', '1');

        expect(onChange).not.toBeCalled();

        window.alert = jsdomAlert;
      });


      it('updates choices', () => {
        w.instance().onChoiceChanged('<div>9</div>', '<div>3*3</div>', '1');

        expect(onChange).toBeCalledWith([
          { value: '<div>6</div>', id: '0' },
          { value: '<div>3*3</div>', id: '1' },
          { value: '<div>12</div>', id: '2' }
        ]);
      });
    });

    describe('onChoiceFocus', () => {
      it('sets focused element id on state', () => {
        w.instance().onChoiceFocus('1');

        expect(w.instance().state.focusedEl).toEqual('1');
      });
    });

    describe('onAddChoice', () => {
      it('adds a choice', () => {
        wrapper().instance().onAddChoice();

        expect(onChange).toBeCalledWith([
          ...model.choices,
          { id: '3', value: '' }
        ]);
      });
    });

    describe('handleChoiceRemove', () => {
      it('removes a choice', () => {
        wrapper().instance().handleChoiceRemove('1');

        expect(onChange).toBeCalledWith([
          { value: '<div>6</div>', id: '0' },
          { value: '<div>12</div>', id: '2' }
        ]);
      });
    });

    describe('getVisibleChoices', () => {
      it('choices are null => returns []', () => {
        const visibleChoices = wrapper({ model: { choices: null } }).instance().getVisibleChoices();

        expect(visibleChoices).toEqual([]);
      });

      it('duplicates = true', () => {
        const choices = [
          { value: '<div>6</div>', id: '0' },
          { value: '<div>9</div>', id: '1' },
          { value: '<div>12</div>', id: '2' },
        ];
        const visibleChoices = wrapper({
          model: {
            duplicates: true,
            choices: choices,
            correctResponse: {
              '0': '0',
              '1': '1'
            },
          }
        }).instance().getVisibleChoices();

        expect(visibleChoices).toEqual(choices);
      });

      it('duplicates = false', () => {
        const choices = [
          { value: '<div>6</div>', id: '0' },
          { value: '<div>9</div>', id: '1' },
          { value: '<div>12</div>', id: '2' },
        ];
        const visibleChoices = wrapper({
          duplicates: false,
          model: {
            choices: choices,
            correctResponse: {
              '0': '0',
              '1': '1'
            },
          }
        }).instance().getVisibleChoices();

        expect(visibleChoices).toEqual([{ value: '<div>12</div>', id: '2' }]);
      });

      it('duplicates = false, empty correctResponse', () => {
        const choices = [
          { value: '<div>6</div>', id: '0' },
          { value: '<div>9</div>', id: '1' },
          { value: '<div>12</div>', id: '2' },
        ];
        const visibleChoices = wrapper({
          duplicates: false,
          model: {
            choices: choices,
            correctResponse: {},
          }
        }).instance().getVisibleChoices();

        expect(visibleChoices).toEqual(choices);
      });

      it('duplicates = false, correctResponse = null', () => {
        const choices = [
          { value: '<div>6</div>', id: '0' },
          { value: '<div>9</div>', id: '1' },
          { value: '<div>12</div>', id: '2' },
        ];
        const visibleChoices = wrapper({
          duplicates: false,
          model: {
            choices: choices,
            correctResponse: null,
          }
        }).instance().getVisibleChoices();

        expect(visibleChoices).toEqual(choices);
      });

    });
  });
});
