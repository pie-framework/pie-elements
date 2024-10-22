import { model } from '../index';
import isFunction from 'lodash/isFunction';

import defaultValues from '../defaults';

const defaults = {
  ...defaultValues,
  feedback: { type: 'default', default: 'this is default feedback' },
};

const q = (extras) => ({ ...defaults, ...extras });
const s = (extras) => ({ ...extras });
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
        feedback: q().feedback.default,
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
        predefinedAnnotations: [],
        feedback: undefined,
        teacherInstructions: null,
        spellCheckEnabled: false,
        mathInput: defaults.mathInput,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
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
        predefinedAnnotations: [],
        feedback: undefined,
        teacherInstructions: null,
        mathInput: defaults.mathInput,
        spellCheckEnabled: false,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
      });
    });

    it('gather mode, annotations enabled', async () => {
      const result = await model(q({ annotationsEnabled: true }), session, env);

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
        spellCheckEnabled: false,
        mathInput: defaults.mathInput,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
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
        predefinedAnnotations: [],
        feedback: undefined,
        teacherInstructions: null,
        spellCheckEnabled: false,
        mathInput: defaults.mathInput,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
      });
    });

    it('view mode, student role, annotations enabled', async () => {
      const result = await model(q({ annotationsEnabled: true }), session, { mode: 'view' });

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
        spellCheckEnabled: false,
        mathInput: defaults.mathInput,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
      });
    });

    it('view mode, instructor role, teacherInstructions enabled', async () => {
      const result = await model(question, session, { mode: 'view', role: 'instructor' });

      expect(result).toEqual({
        annotatorMode: false,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: true,
        predefinedAnnotations: [],
        feedback: undefined,
        teacherInstructions: defaults.teacherInstructions,
        mathInput: defaults.mathInput,
        spellCheckEnabled: false,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
      });
    });

    it('view mode, instructor role, teacherInstructions disabled', async () => {
      const result = await model(q({ teacherInstructionsEnabled: false }), session, {
        mode: 'view',
        role: 'instructor',
      });

      expect(result).toEqual({
        annotatorMode: false,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: true,
        predefinedAnnotations: [],
        feedback: undefined,
        teacherInstructions: null,
        mathInput: defaults.mathInput,
        spellCheckEnabled: false,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
      });
    });

    it('view mode, instructor role, annotations enabled', async () => {
      const result = await model(q({ annotationsEnabled: true }), session, {
        mode: 'view',
        role: 'instructor',
      });

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
        spellCheckEnabled: false,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
      });
    });

    it('evaluate mode, student role', async () => {
      const result = await model({ ...question, feedbackEnabled: true }, session, { mode: 'evaluate' });

      expect(result).toEqual({
        annotatorMode: false,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: true,
        predefinedAnnotations: [],
        feedback: defaults.feedback.default,
        teacherInstructions: null,
        mathInput: defaults.mathInput,
        spellCheckEnabled: false,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
      });
    });

    it('evaluate mode, student role, annotations enabled', async () => {
      const result = await model({ ...question, feedbackEnabled: true, annotationsEnabled: true }, session, {
        mode: 'evaluate',
      });

      expect(result).toEqual({
        annotatorMode: true,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: true,
        predefinedAnnotations: defaults.predefinedAnnotations,
        feedback: defaults.feedback.default,
        teacherInstructions: null,
        mathInput: defaults.mathInput,
        spellCheckEnabled: false,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
      });
    });

    it('evaluate mode, instructor role, teacherInstructions enabled', async () => {
      const result = await model({ ...question, feedbackEnabled: true }, session, {
        mode: 'evaluate',
        role: 'instructor',
      });

      expect(result).toEqual({
        annotatorMode: false,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: true,
        predefinedAnnotations: [],
        feedback: defaults.feedback.default,
        spellCheckEnabled: false,
        teacherInstructions: defaults.teacherInstructions,
        mathInput: defaults.mathInput,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
      });
    });

    it('evaluate mode, instructor role, teacherInstructions disabled', async () => {
      const result = await model(q({ teacherInstructionsEnabled: false, feedbackEnabled: true }), session, {
        mode: 'evaluate',
        role: 'instructor',
      });

      expect(result).toEqual({
        annotatorMode: false,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: true,
        predefinedAnnotations: [],
        feedback: defaults.feedback.default,
        spellCheckEnabled: false,
        teacherInstructions: null,
        mathInput: defaults.mathInput,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
      });
    });

    it('evaluate mode, instructor role, annotations enabled', async () => {
      const result = await model(q({ annotationsEnabled: true }), session, { mode: 'evaluate', role: 'instructor' });

      expect(result).toEqual({
        annotatorMode: true,
        customKeys: [],
        prompt: defaults.prompt,
        dimensions: defaults.dimensions,
        disabled: true,
        disabledAnnotator: false,
        predefinedAnnotations: defaults.predefinedAnnotations,
        feedback: undefined,
        spellCheckEnabled: false,
        teacherInstructions: defaults.teacherInstructions,
        mathInput: defaults.mathInput,
        playersToolbarPosition: 'bottom',
        equationEditor: 8,
      });
    });
  });
});
