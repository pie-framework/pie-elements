import { shallow } from 'enzyme';
import React from 'react';
import { Design } from '../design';
import defaultValues from '../defaults';

jest.mock('@pie-lib/config-ui', () => ({
  layout: {
    ConfigLayout: (props) => <div>{props.children}</div>,
  },
  settings: {
    Panel: (props) => <div oChangeModel={props.onChange} />,
    toggle: jest.fn(),
    radio: jest.fn(),
  },
}));

jest.mock('lodash/debounce', () => (fn) => fn);

describe('design', () => {
  let w;
  let onChange;
  let onChangeConfig;

  const getModel = () => ({
    tokens: [],
  });
  beforeEach(() => {
    onChange = jest.fn();
    onChangeConfig = jest.fn();
    w = shallow(
      <Design
        model={getModel()}
        configuration={defaultValues.configuration}
        classes={{}}
        className={'foo'}
        onModelChanged={onChange}
        onConfigurationChanged={onChangeConfig}
      />,
    );
  });

  describe('snapshot', () => {
    it('renders all items with defaultProps', () => {
      expect(w).toMatchSnapshot();
    });

    it('tokenizer renders with html entities', () => {
      expect(
        shallow(
          <Design
            model={{
              text: '<p>&#8220;Lucy?&#63; Are you using your time wisely to plan your project?&#33;&#33;&#33;&#8221; Mr. Wilson asked.</p><p>Lucy looked a little confused at first. &#195; Then she grinned and proudly stated, &#8220;Why, yes I am! I plan to make a bird feeder for that tree out our window!&#8221;</p>',
              tokens: [],
            }}
            configuration={defaultValues.configuration}
            classes={{}}
            className={'foo'}
            onModelChanged={onChange}
            onConfigurationChanged={onChangeConfig}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    const assert = (fn, args, expected) => {
      const e = expected(getModel());

      it(`${fn} ${JSON.stringify(args)} => ${JSON.stringify(e)}`, () => {
        const instance = w.instance();
        instance[fn].apply(instance, args);

        expect(onChange).toBeCalledWith(e);
      });
    };

    describe('changePrompt', () => {
      assert('onPromptChanged', ['New Prompt'], (m) => ({
        ...m,
        prompt: 'New Prompt',
      }));
    });
  });
});
