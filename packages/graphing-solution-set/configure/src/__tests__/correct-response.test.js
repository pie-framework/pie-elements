import * as React from 'react';
import { shallow } from 'enzyme';
import { CorrectResponse } from '../correct-response';
import defaultValues from '../defaults';

describe('CorrectResponse', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange: jest.fn(),
      tools: [],
    };

    wrapper = (newProps) => {
      const configureProps = { ...props, newProps };

      return shallow(<CorrectResponse {...configureProps} />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('changeMarks calls onChange', () => {
      const component = wrapper();
      const marks = [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }];

      component.instance().changeMarks('alternateTest', marks);

      expect(component.instance().props.onChange).toBeCalledWith({
        ...defaultValues.model,
        answers: {
          ...defaultValues.model.answers,
          alternateTest: {
            marks,
          },
        },
      });
    });

    it('changeToolbarTools calls onChange', () => {
      const component = wrapper();
      component.instance().changeToolbarTools([]);

      expect(component.instance().props.model.toolbarTools).toEqual([]);
      expect(component.instance().props.onChange).toHaveBeenCalledWith({
        ...defaultValues.model,
        toolbarTools: [],
      });
    });
  });

  it('toggleToolBarTool calls onChange', () => {
    const component = wrapper();
    component.instance().toggleToolBarTool('point');

    const { props } = component.instance();

    expect(props.onChange).toHaveBeenCalledWith({ ...defaultValues.model, toolbarTools: ['line'] });
  });
});

describe('CorrectResponse: if answers is null it should still work as expected', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange: jest.fn(),
      tools: [],
    };

    props.model.answers = null;

    wrapper = (newProps) => {
      const configureProps = { ...props, newProps };

      return shallow(<CorrectResponse {...configureProps} />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('changeMarks calls onChange', () => {
      const component = wrapper();
      const marks = [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }];

      component.instance().changeMarks('alternateTest', marks);

      expect(component.instance().props.onChange).toBeCalledWith({
        ...defaultValues.model,
        answers: {
          ...defaultValues.model.answers,
          alternateTest: {
            marks,
          },
        },
      });
    });

    it('changeToolbarTools calls onChange', () => {
      const component = wrapper();
      component.instance().changeToolbarTools([]);

      expect(component.instance().props.model.toolbarTools).toEqual([]);
      expect(component.instance().props.onChange).toHaveBeenCalledWith({
        ...defaultValues.model,
        toolbarTools: [],
      });
    });
  });

  it('toggleToolBarTool calls onChange', () => {
    const component = wrapper();
    component.instance().toggleToolBarTool('point');

    const { props } = component.instance();

    expect(props.onChange).toHaveBeenCalledWith({ ...defaultValues.model, toolbarTools: ['point'] });
  });
});

describe('CorrectResponse: if answers is undefined it should still work as expected', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange: jest.fn(),
      tools: [],
    };

    props.model.answers = undefined;

    wrapper = (newProps) => {
      const configureProps = { ...props, newProps };

      return shallow(<CorrectResponse {...configureProps} />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('changeMarks calls onChange', () => {
      const component = wrapper();
      const marks = [{ type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, fill: 'Solid' }];

      component.instance().changeMarks('alternateTest', marks);

      expect(component.instance().props.onChange).toBeCalledWith({
        ...defaultValues.model,
        answers: {
          ...defaultValues.model.answers,
          alternateTest: {
            marks,
          },
        },
      });
    });

    it('changeToolbarTools calls onChange', () => {
      const component = wrapper();
      component.instance().changeToolbarTools([]);

      expect(component.instance().props.model.toolbarTools).toEqual([]);
      expect(component.instance().props.onChange).toHaveBeenCalledWith({
        ...defaultValues.model,
        toolbarTools: [],
      });
    });
  });

  it('toggleToolBarTool calls onChange', () => {
    const component = wrapper();
    component.instance().toggleToolBarTool('point');

    const { props } = component.instance();

    expect(props.onChange).toHaveBeenCalledWith({ ...defaultValues.model, toolbarTools: ['point'] });
  });
});
