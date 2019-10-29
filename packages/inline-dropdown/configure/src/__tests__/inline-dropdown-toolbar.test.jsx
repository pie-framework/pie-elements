import { shallow } from 'enzyme';
import React from 'react';

import { RespAreaToolbar } from '../inline-dropdown-toolbar';

describe('Main', () => {
  let onAddChoice = jest.fn();
  let onRemoveChoice = jest.fn();
  let onSelectChoice = jest.fn();
  let onToolbarDone = jest.fn();

  const value = {
    change: jest.fn().mockReturnValue({
      setNodeByKey: jest.fn().mockReturnValue({
        moveFocusTo: jest.fn().mockReturnValue({
          moveAnchorTo: jest.fn()
        })
      })
    }),
    document: {
      getNextText: jest.fn().mockReturnValue({
        key: '1'
      })
    }
  };

  const wrapper = () => {
    const defaults = {
      onAddChoice,
      onRemoveChoice,
      onSelectChoice,
      node: {
        key: '1',
        data: {
          toJSON: jest.fn(),
          get: (key) => {
            if (key === 'index') {
              return '0';
            }

            return 'cow';
          }
        }
      },
      value,
      onToolbarDone,
      choices: [
        {
          label: 'cow ',
          value: '0',
          correct: true
        },
        {
          label: 'dog ',
          value: '1',
          correct: false
        },
        {
          label: 'cat ',
          value: '2',
          correct: false
        }
      ]
    };
    const props = { ...defaults };

    return shallow(<RespAreaToolbar {...props} />, { disableLifecycleMethods: true });
  };

  describe('snapshot', () => {
    it('Renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w;

    beforeEach(() => {
      w = wrapper();
    });

    describe('onRespAreaChange', () => {
      it('sets state', () => {
        w.instance().onRespAreaChange('<div>test</div>');

        expect(w.instance().state.respAreaMarkup).toEqual('<div>test</div>');
      });
    });

    describe('onDone', () => {
      it('does not call onAddChoice if choice is empty', () => {
        w.instance().onDone('<div><p></p></div>');

        expect(onAddChoice).not.toBeCalled();
      });

      it('calls onAddChoice if choice not empty', () => {
        w.instance().onDone('<div>test</div>');

        expect(onAddChoice).toBeCalledWith('0', '<div>test</div>');
      });
    });

    describe('onSelectChoice',  () => {
      it('calls onToolbarDone and onSelectChoice', () => {
        w.instance().onSelectChoice('cat', '2');

        expect(onToolbarDone).toBeCalled();
        expect(onSelectChoice).toBeCalledWith('2');
      });
    });

    describe('onRemoveChoice', () => {
      it('calls onToolbarChange if removed value is the one selected as correct', () => {
        w.instance().onRemoveChoice('cow', '0');

        expect(onToolbarDone).toBeCalled();
      });

      it('calls onRemoveChoice if removed value is not the one selected as correct', () => {
        w.instance().onRemoveChoice('cat', '2');

        expect(onRemoveChoice).toBeCalledWith('2');
      });
    });
  });
});
