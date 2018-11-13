import { shallow } from 'enzyme';
import React from 'react';
import Design from '../design';
import defaultValues from '../defaultConfiguration';

describe('design', () => {
  let w;
  let onChange;
  let onModelChange;

  const getModel = () => ({
    tokens: [],
    configure: defaultValues
  });
  beforeEach(() => {
    onChange = jest.fn();
    onModelChange = jest.fn();
    w = shallow(
      <Design
        model={getModel()}
        classes={{}}
        className={'foo'}
        onChange={onChange}
        onModelChange={onModelChange}
      />
    );
  });

  describe('snapshot', () => {
    it('renders all items with defaultProps', () => {
      expect(w).toMatchSnapshot();
    });

    it('renders all items except feedback', () => {
      const defaultModel = getModel();

      defaultModel.configure.enableFeedback = false;

      const wrapper = shallow(
        <Design
          model={getModel()}
          classes={{}}
          className={'foo'}
          onChange={onChange}
          onModelChange={onModelChange}
        />
      );

      expect(wrapper).toMatchSnapshot();
    });

    it('renders all items except the prompt input', () => {
      const defaultModel = getModel();

      defaultModel.configure.enablePromptChange = false;

      const wrapper = shallow(
        <Design
          model={getModel()}
          classes={{}}
          className={'foo'}
          onChange={onChange}
          onModelChange={onModelChange}
        />
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});
