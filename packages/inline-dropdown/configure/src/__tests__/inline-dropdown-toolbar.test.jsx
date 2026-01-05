import { render } from '@testing-library/react';
import React from 'react';

import RespAreaToolbar from '../inline-dropdown-toolbar';

describe('Main', () => {
  let onAddChoice = jest.fn();
  let onRemoveChoice = jest.fn();
  let onSelectChoice = jest.fn();
  let onToolbarDone = jest.fn();

  const value = {
    change: jest.fn().mockReturnValue({
      setNodeByKey: jest.fn().mockReturnValue({
        moveFocusTo: jest.fn().mockReturnValue({
          moveAnchorTo: jest.fn(),
        }),
      }),
    }),
    document: {
      getNextText: jest.fn().mockReturnValue({
        key: '1',
      }),
    },
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
          },
        },
      },
      value,
      onToolbarDone,
      choices: [
        {
          label: 'cow ',
          value: '0',
          correct: true,
        },
        {
          label: 'dog ',
          value: '1',
          correct: false,
        },
        {
          label: 'cat ',
          value: '2',
          correct: false,
        },
      ],
    };
    const props = { ...defaults };

    return render(<RespAreaToolbar {...props} />);
  };

  const createInstance = () => {
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
          },
        },
      },
      value,
      onToolbarDone,
      choices: [
        {
          label: 'cow ',
          value: '0',
          correct: true,
        },
        {
          label: 'dog ',
          value: '1',
          correct: false,
        },
        {
          label: 'cat ',
          value: '2',
          correct: false,
        },
      ],
    };

    // Access the actual class component from the default export
    const ComponentClass = RespAreaToolbar.type || RespAreaToolbar;
    const instance = new ComponentClass(defaults);

    // Mock setState to execute updates immediately for testing
    instance.setState = jest.fn((state) => {
      Object.assign(instance.state, typeof state === 'function' ? state(instance.state) : state);
    });

    return instance;
  };

  describe('snapshot', () => {
    it('Renders', () => {
      const { container } = wrapper();
      expect(container).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let instance;

    beforeEach(() => {
      onAddChoice.mockClear();
      onRemoveChoice.mockClear();
      onSelectChoice.mockClear();
      onToolbarDone.mockClear();
      instance = createInstance();
    });

    describe('onRespAreaChange', () => {
      it('sets state', () => {
        instance.onRespAreaChange('<div>test</div>');

        expect(instance.state.respAreaMarkup).toEqual('<div>test</div>');
      });
    });

    describe('onDone', () => {
      it('does not call onAddChoice if choice is empty', () => {
        instance.onDone('<div><p></p></div>');

        expect(onAddChoice).not.toBeCalled();
      });

      it('calls onAddChoice if choice not empty', () => {
        instance.onDone('<div>test</div>');

        expect(onAddChoice).toBeCalledWith('0', '<div>test</div>', -1);
      });
    });

    describe('onSelectChoice', () => {
      it('calls onToolbarDone and onSelectChoice', () => {
        instance.onSelectChoice('cat', '2');

        expect(onToolbarDone).toBeCalled();
        expect(onSelectChoice).toBeCalledWith('2');
      });
    });

    describe('onRemoveChoice', () => {
      it('calls onToolbarChange if removed value is the one selected as correct', () => {
        instance.onRemoveChoice('cow', '0');

        expect(onToolbarDone).toBeCalled();
      });

      it('calls onRemoveChoice if removed value is not the one selected as correct', () => {
        instance.onRemoveChoice('cat', '2');

        expect(onRemoveChoice).toBeCalledWith('2');
      });
    });
  });
});
