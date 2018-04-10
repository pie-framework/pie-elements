import React from 'react';
import Main from '../main';
import { truncateSync } from 'fs';

describe('Render a calculator element', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Main model={{mode: 'basic'}} onModelChanged={() => true}/>)
  })

  it('Creates snapshot using enzyme', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('Test for onChangeHandler', () => {
    wrapper.instance().onChangeHandler('scientific');
    const twoChoice = wrapper.state('twoChoice');
    expect(twoChoice).toEqual('scientific');
  })

});