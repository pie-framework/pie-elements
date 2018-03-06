import * as feedbackMapper from '../feedback-mapper';
import _ from 'lodash';

describe('feedback-mapper', () => {
  describe('modelToFeedbackConfig', () => {

    it('returns data', () => {

      const model = {
        correctResponses: {
          feedback: {
            type: 'default'
          }
        },
        partialResponses: {
          feedback: {
            type: 'custom',
            value: 'foo'
          }
        },
        incorrectFeedback: {
          type: 'none'
        }
      }

      const result = feedbackMapper.modelToFeedbackConfig(model);

      expect(result).toEqual({
        correctFeedback: undefined,
        correctFeedbackType: 'default',
        incorrectFeedback: undefined,
        incorrectFeedbackType: 'none',
        partialFeedback: 'foo',
        partialFeedbackType: 'custom'
      });
    });
  });

  describe('feedbackConfigToModel', () => {

    it('returns model', () => {


      const model = {
        correctResponses: {
          values: ['a']
        }
      };
      const feedback = {
        correctFeedback: undefined,
        correctFeedbackType: 'default',
        incorrectFeedback: undefined,
        incorrectFeedbackType: 'none',
        partialFeedback: 'foo',
        partialFeedbackType: 'custom'
      }
      const result = feedbackMapper.feedbackConfigToModel(feedback, model);

      expect(result.correctResponses.values).toEqual(['a']);

      expect(result.correctResponses.feedback).toEqual({
        type: 'default'
      });
      expect(result.partialResponses.feedback).toEqual({
        type: 'custom',
        value: 'foo'
      });
      expect(result.incorrectFeedback).toEqual({
        type: 'none'
      });
    });
  });
});