import { shallow } from 'enzyme';
import React from 'react';

import { ECRToolbar } from '../ecr-toolbar';

describe('ECRToolbar', () => {
  let onChangeResponse = jest.fn();
  let onToolbarDone = jest.fn();

  const wrapper = () => {
    const defaults = {
      onChangeResponse,
      onToolbarDone,
      classes: {},
      node: {
        key: 1,
        data: {
          get: (prop) => {
            if (prop === 'index') {
              return '2';
            }

            return 'moon';
          },
          toJSON: jest.fn()
        }
      },
      value: {
        change: jest.fn().mockReturnValue({
          setNodeByKey: jest.fn().mockReturnValue({
            moveFocusTo: jest.fn().mockReturnValue({
              moveAnchorTo: jest.fn()
            })
          })
        }),
        document: {
          getNextText: jest.fn().mockReturnValue({
            key: 1
          })
        }
      },
      correctChoice: { value: '0', label: 'moon' }
    };
    const props = { ...defaults };

    return shallow(<ECRToolbar {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('onDone: calls onToolbarDone and onChangeResponse', () => {
      const w = wrapper();

      w.instance().onDone();

      expect(onToolbarDone).toBeCalled();
      expect(onChangeResponse).toBeCalled();
    });

    it('onChange', () => {
      const w = wrapper();

      w.instance().onChange({ target: { value: 'test' }});

      expect(w.instance().state).toEqual({ markup: 'test' });
    });
  });
});
