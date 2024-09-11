import { shallow } from 'enzyme';
import React from 'react';
import { shallowChild } from '@pie-lib/pie-toolbox/test-utils';
import AnswerFraction from '../answer-fraction';
import { TextField } from '@material-ui/core';

jest.mock('@material-ui/core', () => ({
  TextField: (props) => <div {...props} />,
}));

describe('AnswerFraction', () => {
  const defaultProps = {
    classes: {},
    model: {
      correctResponse: [],
      title: '',
      question: '',
      modelTypeSelected: 'bar',
      maxModelSelected: 1,
      partsPerModel: 5,
      allowedStudentConfig: true,
      showGraphLabels: false,
    },
    correctAnswers: {},
    view: false,
    showCorrect: false,
    onAnswerChange: jest.fn(),
    answers: {},
  };

  let wrapper;
  let component;

  beforeEach(() => {
    wrapper = shallowChild(AnswerFraction, defaultProps, 1);
  });

  describe('render', () => {
    let w;

    beforeEach(() => {
      w = (props) => shallow(<AnswerFraction {...props} />);
    });

    it('snapshot', () => {
      expect(w(defaultProps)).toMatchSnapshot();
    });

    it('renders correctly', () => {
      component = wrapper();
      expect(component.find(TextField).length).toEqual(2);
    });

    it('onValueChange correctly update answers', () => {
      component = wrapper();
      component.instance().onValueChange('partsPerModel');
      component.instance().onValueChange('noOfModel');
    });
  });
});
