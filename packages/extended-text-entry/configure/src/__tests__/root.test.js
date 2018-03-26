import React from 'react';
import Root from './../root';
describe('Renders Root Component', () => {
  let wrapper, instance;
  
  let model = {}
  beforeEach(() => {
    wrapper = shallow(<Root model={model} onModelChanged={() => { }} />);
    instance = wrapper.instance();
  });

  it('should resize width and update model', () => {
    instance.handleBoxResize(10, 'width');
    const model = wrapper.state('model');
    expect(model).toEqual({width: 10});
  });

  it('should resize height and update model', () => {
    instance.handleBoxResize(20, 'height');
    const model = wrapper.state('model');
    expect(model).toEqual({height: 20});
  });
})