import * as React from 'react';
import { shallow } from 'enzyme';

import { Tools, CorrectResponse } from '../correct-response';
import defaultValues from '../defaults';

describe('Tools', () => {
  describe('renders', () => {
    it('snapshot', () => {
      const props = {
        classes: {},
        toolbarTools: [],
        toggleToolBarTool: jest.fn()
      };

      expect(shallow(<Tools {...props} />)).toMatchSnapshot();
    })
  });
});

describe('CorrectResponse', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      classes: {},
      model: defaultValues.model,
      onChange: jest.fn(),
      tools: []
    };

    wrapper = newProps => {
      const configureProps = { ...props, newProps };

      return shallow(<CorrectResponse {...configureProps} />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    })
  });

  describe('logic', () => {
    it('changeMarks calls onChange', () => {
      const component = wrapper();
      const marks = [{ x: 1, y: 1, type: 'point' }];

      component.instance().changeMarks('alternateTest', marks);

      expect(component.instance().props.onChange).toBeCalledWith({
        ...defaultValues.model,
        answers: {
          ...defaultValues.model.answers,
          alternateTest: {
            marks
          }
        }
      });
    });

    it('changeToolbarTools calls onChange', () => {
      const component = wrapper();
      component.instance().changeToolbarTools([]);

      expect(component.instance().props.model.toolbarTools).toEqual([]);
      expect(component.instance().props.onChange).toHaveBeenCalledWith({
        ...defaultValues.model,
        toolbarTools: []
      })
    });
  });

  it('toggleToolBarTool calls onChange', () => {
    const component = wrapper();
    component.instance().toggleToolBarTool('point');

    const { props } = component.instance();

    expect(props.model.toolbarTools).toEqual(['point']);
    expect(props.onChange).toHaveBeenCalledWith({ ...defaultValues.model, toolbarTools: ['point'] });
  });

  it('addAlternateResponse calls onChange', () => {
    const component = wrapper();
    component.instance().addAlternateResponse();

    const { props } = component.instance();

    const answers = props.model.answers;

    answers.alternate1 = { marks: [], name: 'Alternate 1' };

    expect(props.model.answers).toEqual(answers);
    expect(props.onChange).toHaveBeenCalledWith({ ...defaultValues.model, answers });
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
      tools: []
    };

    props.model.answers = null;

    wrapper = newProps => {
      const configureProps = { ...props, newProps };

      return shallow(<CorrectResponse {...configureProps} />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    })
  });

  describe('logic', () => {
    it('changeMarks calls onChange', () => {
      const component = wrapper();
      const marks = [{ x: 1, y: 1, type: 'point' }];

      component.instance().changeMarks('alternateTest', marks);

      expect(component.instance().props.onChange).toBeCalledWith({
        ...defaultValues.model,
        answers: {
          ...defaultValues.model.answers,
          alternateTest: {
            marks
          }
        }
      });
    });

    it('changeToolbarTools calls onChange', () => {
      const component = wrapper();
      component.instance().changeToolbarTools([]);

      expect(component.instance().props.model.toolbarTools).toEqual([]);
      expect(component.instance().props.onChange).toHaveBeenCalledWith({
        ...defaultValues.model,
        toolbarTools: []
      })
    });
  });

  it('toggleToolBarTool calls onChange', () => {
    const component = wrapper();
    component.instance().toggleToolBarTool('point');

    const { props } = component.instance();

    expect(props.model.toolbarTools).toEqual(['point']);
    expect(props.onChange).toHaveBeenCalledWith({ ...defaultValues.model, toolbarTools: ['point'] });
  });

  it('addAlternateResponse calls onChange', () => {
    const component = wrapper();
    component.instance().addAlternateResponse();

    const { props } = component.instance();

    const answers = props.model.answers;

    answers.alternate1 = { marks: [], name: 'Alternate 1' };

    expect(props.model.answers).toEqual(answers);
    expect(props.onChange).toHaveBeenCalledWith({ ...defaultValues.model, answers });
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
      tools: []
    };

    props.model.answers = undefined;

    wrapper = newProps => {
      const configureProps = { ...props, newProps };

      return shallow(<CorrectResponse {...configureProps} />);
    };
  });

  describe('renders', () => {
    it('snapshot', () => {
      expect(wrapper()).toMatchSnapshot();
    })
  });

  describe('logic', () => {
    it('changeMarks calls onChange', () => {
      const component = wrapper();
      const marks = [{ x: 1, y: 1, type: 'point' }];

      component.instance().changeMarks('alternateTest', marks);

      expect(component.instance().props.onChange).toBeCalledWith({
        ...defaultValues.model,
        answers: {
          ...defaultValues.model.answers,
          alternateTest: {
            marks
          }
        }
      });
    });

    it('changeToolbarTools calls onChange', () => {
      const component = wrapper();
      component.instance().changeToolbarTools([]);

      expect(component.instance().props.model.toolbarTools).toEqual([]);
      expect(component.instance().props.onChange).toHaveBeenCalledWith({
        ...defaultValues.model,
        toolbarTools: []
      })
    });
  });

  it('toggleToolBarTool calls onChange', () => {
    const component = wrapper();
    component.instance().toggleToolBarTool('point');

    const { props } = component.instance();

    expect(props.model.toolbarTools).toEqual(['point']);
    expect(props.onChange).toHaveBeenCalledWith({ ...defaultValues.model, toolbarTools: ['point'] });
  });

  it('addAlternateResponse calls onChange', () => {
    const component = wrapper();
    component.instance().addAlternateResponse();

    const { props } = component.instance();

    const answers = props.model.answers;

    answers.alternate1 = { marks: [], name: 'Alternate 1' };

    expect(props.model.answers).toEqual(answers);
    expect(props.onChange).toHaveBeenCalledWith({ ...defaultValues.model, answers });
  });
});
