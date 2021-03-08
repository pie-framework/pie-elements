import React from 'react';
import { Main } from '../main';
import { shallow } from 'enzyme';

describe('Render Main Component', () => {
  let model = { width: 100, height: 50 };

  it('should match snapshot', () => {
    let wrapper = shallow(
      <Main
        model={model}
        session={{ value: 'hi' }}
        onChange={() => {
        }}
        classes={{}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should match snapshot with teacher instructions', () => {
    let wrapper = shallow(
      <Main
        model={{ ...model, teacherInstructions: 'Teacher Instructions' }}
        session={{ value: 'hi' }}
        onChange={() => {
        }}
        classes={{}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
