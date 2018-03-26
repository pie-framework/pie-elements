import React from 'react';
import Main from './../main';

describe('Render Main Component', () => {

  let wrapper;
  
  let model = {}
  beforeEach(() => {
    wrapper = shallow(<Main model={model} handleBoxResize={() => {}}/>);
  });

  it('Match Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  })
})