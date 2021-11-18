import { model } from '../index';
import isFunction from 'lodash/isFunction';
const defaults = {
  feedback: { type: 'default', default: 'this is default feedback' },
  mathInput: false,
  prompt: 'Prompt',
  dimensions: {
    width: '150',
    height: '150'
  },
  predefinedAnnotations: [
    {
      label: 'good',
      text: 'good',
      type: 'positive'
    }, {
      label: 'creative',
      text: 'creative',
      type: 'positive'
    }, {
      label: 'run-on',
      text: 'run-on',
      type: 'negative'
    }, {
      label: 'frag',
      text: 'fragment',
      type: 'negative'
    }
  ],
  teacherInstructions: 'Teacher Instructions'
};
const q = extras => ({ ...defaults, ...extras });
const s = extras => ({ ...extras });
const e = (mode = 'gather') => ({ mode });
describe('controller', () => {
  const assert = (label, question, session, env, expected) => {
    it(label, async () => {
      const result = await model(question, session, env);
      if (isFunction(expected)) {
        expected(result);
      } else {
        expect(result).toMatchObject(expected);
      }
    });
  };
  describe('model', () => {
    const question = q();
    const session = s();
    const env = e();
    describe('disabled', () => {
      assert('gather', question, session, env, { disabled: false });
      assert('view', question, session, e('view'), { disabled: true });
      assert('evaluate', question, session, e('evaluate'), { disabled: true });
    });
    describe('feedback', () => {
      assert('none for gather', question, session, env, { feedback: undefined });
      assert('none for view', question, session, e('view'), { feedback: undefined });
      assert('some for evaluate', q({ feedbackEnabled: true }), session, e('evaluate'), {
        feedback: q().feedback.default
      });
    });
    it('gather mode, promptEnabled: true', async () => {
      const result = await model(question, session, env);
      expect(result).toEqual({
        annotatorMode: false,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: false,
        disabledAnnotator: true,
        predefinedAnnotations: defaults.predefinedAnnotations,
        feedback: undefined,
        teacherInstructions: null,
        mathInput: defaults.mathInput,
        equationEditor: 'miscellaneous'
      });
    });
    it('gather mode, promptEnabled: false', async () => {
      const result = await model(q({ promptEnabled: false }), session, env);
      expect(result).toEqual({
        annotatorMode: false,
        customKeys: [],
        prompt: null,
        dimensions: defaults.dimensions,
        disabled: false,
        disabledAnnotator: true,
        predefinedAnnotations: defaults.predefinedAnnotations,
        feedback: undefined,
        teacherInstructions: null,
        mathInput: defaults.mathInput,
        equationEditor: 'miscellaneous'
      });
    });
    it('view mode, student role', async () => {
      const result = await model(question, session, { mode: 'view' });
      expect(result).toEqual({
        annotatorMode: false,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: true,
        predefinedAnnotations: defaults.predefinedAnnotations,
        feedback: undefined,
        teacherInstructions: null,
        mathInput: defaults.mathInput,
        equationEditor: 'miscellaneous'
      });
    });
    it('view mode, instructor role, teacherInstructions enabled', async () => {
      const result = await model(question, session, { mode: 'view', role: 'instructor' });
      expect(result).toEqual({
        annotatorMode: true,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: false,
        predefinedAnnotations: defaults.predefinedAnnotations,
        feedback: undefined,
        teacherInstructions: defaults.teacherInstructions,
        mathInput: defaults.mathInput,
        equationEditor: 'miscellaneous'
      });
    });
    it('view mode, instructor role, teacherInstructions disabled', async () => {
      const result = await model(q({ teacherInstructionsEnabled: false }), session, { mode: 'view', role: 'instructor' });
      expect(result).toEqual({
        annotatorMode: true,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: false,
        predefinedAnnotations: defaults.predefinedAnnotations,
        feedback: undefined,
        teacherInstructions: null,
        mathInput: defaults.mathInput,
        equationEditor: 'miscellaneous'
      });
    });
    it('evaluate mode, student role', async () => {
      const result = await model(question, session, { mode: 'evaluate' });
      expect(result).toEqual({
        annotatorMode: true,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: true,
        predefinedAnnotations: defaults.predefinedAnnotations,
        feedback: 'this is default feedback',
        teacherInstructions: null,
        mathInput: defaults.mathInput,
        equationEditor: 'miscellaneous'
      });
    });
    it('evaluate mode, instructor role, teacherInstructions enabled', async () => {
      const result = await model(question, session, { mode: 'evaluate', role: 'instructor' });
      expect(result).toEqual({
        annotatorMode: true,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: false,
        predefinedAnnotations: defaults.predefinedAnnotations,
        feedback: 'this is default feedback',
        teacherInstructions: defaults.teacherInstructions,
        mathInput: defaults.mathInput,
        equationEditor: 'miscellaneous'
      });
    });
    it('evaluate mode, instructor role, teacherInstructions disabled', async () => {
      const result = await model(q({ teacherInstructionsEnabled: false }), session, { mode: 'evaluate', role: 'instructor' });
      expect(result).toEqual({
        annotatorMode: true,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: false,
        predefinedAnnotations: defaults.predefinedAnnotations,
        feedback: 'this is default feedback',
        teacherInstructions: null,
        mathInput: defaults.mathInput,
        equationEditor: 'miscellaneous'
      });
    });
  });
});
