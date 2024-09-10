import { shallow } from 'enzyme';
import React from 'react';
import Main from '../main';
import { shallowChild } from '@pie-lib/pie-toolbox/test-utils';
import AnswerFraction from '../answer-fraction';

describe('Main', () => {
  const defaultProps = {
    model: {
      correctResponse: [],
      title: '',
      question: '',
      modelTypeSelected: 'bar',
      maxModelSelected: 1,
      partsPerModel: 5,
      allowedStudentConfig: false,
      showGraphLabels: false,
    },
    session: {},
    onSessionChange: jest.fn(),
  };

  let wrapper;
  let component;

  beforeEach(() => {
    wrapper = shallowChild(Main, defaultProps, 1);
  });

  describe('render', () => {
    let w;

    beforeEach(() => {
      w = (props) => shallow(<Main {...props} />);
    });

    it('snapshot', () => {
      expect(w(defaultProps)).toMatchSnapshot();
    });

    it('renders correctly', () => {
      component = wrapper();

      expect(component.find(AnswerFraction).length).toEqual(1);

      expect(component.state()).toEqual({
        answerChangeDialog: {
          open: false,
          text: '',
        },
        fractionModelKey: 0,
        session: {
          answers: {
            response: [],
          },
        },
        showCorrect: false,
      });
    });

    it('renders correctly with a pre-filled session', () => {
      component = wrapper();
      expect(component.find(AnswerFraction).length).toEqual(1);
      component = wrapper({
        session: {
          answers: {
            noOfModel: 2,
            partsPerModel: 4,
            response: [
              { id: 1, value: 4 },
              { id: 2, value: 3 },
            ],
          },
        },
      });
      expect(component.find(AnswerFraction).length).toEqual(1);
      expect(component.state()).toEqual({
        answerChangeDialog: {
          open: false,
          text: '',
        },
        fractionModelKey: 0,
        session: {
          answers: {
            noOfModel: 2,
            partsPerModel: 4,
            response: [
              { id: 1, value: 4 },
              { id: 2, value: 3 },
            ],
          },
        },
        showCorrect: false,
      });
    });

    it('generate answers correctly from selection', () => {
      component = wrapper();
      expect(
        component.instance().generateAnswers({
          allowedStudentConfig: true,
        }),
      ).toEqual({
        noOfModel: 0,
        partsPerModel: 0,
        response: [],
      });
    });

    it('on answer change correctly after selection', () => {
      component = wrapper();
      component.instance().onAnswerChange({
        noOfModel: 4,
        partsPerModel: 2,
        response: [
          { id: 1, value: 2 },
          { id: 2, value: 2 },
          { id: 3, value: 2 },
          { id: 4, value: 1 },
        ],
      });
      expect(component.state()).toEqual({
        session: {
          answers: {
            response: [],
          },
        },
        showCorrect: false,
        answerChangeDialog: {
          newSession: {
            answers: {
              noOfModel: 4,
              partsPerModel: 2,
              response: [
                { id: 1, value: 2 },
                { id: 2, value: 2 },
                { id: 3, value: 2 },
                { id: 4, value: 1 },
              ],
            },
          },
          oldSession: {
            answers: {
              response: [],
            },
          },
          open: true,
          text: 'Changing either the Number of Models or Parts per Model will remove added answer. Are you sure you want to continue?',
        },
        fractionModelKey: 0,
      });
    });
  });
});
