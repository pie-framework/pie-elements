import debug from 'debug';
import defaults from './defaults';

const log = debug('pie-elements:drawing-response:controller');

export const normalize = (question) => ({
  promptEnabled: true,
  teacherInstructionsEnabled: true,
  studentInstructionsEnabled: true,
  backgroundImageEnabled: true,
  ...question,
});

export function model(question, session, env) {
  const normalizedQuestion = normalize(question);
  const { imageUrl, imageDimensions, prompt, promptEnabled, backgroundImageEnabled, language } = normalizedQuestion;

  return new Promise((resolve) => {
    const out = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      imageDimensions,
      imageUrl,
      prompt: promptEnabled ? prompt : null,
      backgroundImageEnabled,
      language,
    };

    if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
      out.teacherInstructions = normalizedQuestion.teacherInstructionsEnabled
        ? normalizedQuestion.teacherInstructions
        : null;
    } else {
      out.teacherInstructions = null;
    }

    resolve(out);
  });
}

export const createDefaultModel = (model = {}) =>
  new Promise((resolve) => {
    resolve({
      ...defaults,
      ...model,
    });
  });

export function outcome(/*config, session*/) {
  return new Promise((resolve) => {
    log('outcome...');
    resolve({
      score: 0,
      completed: 'n/a',
      note: 'Requires manual scoring',
    });
  });
}

// remove all html tags
const getInnerText = (html) => (html || '').replaceAll(/<[^>]*>/g, '');

// remove all html tags except img and iframe
const getContent = (html) => (html || '').replace(/(<(?!img|iframe)([^>]+)>)/gi, '');

export const validate = (model = {}, config = {}) => {
  const errors = {};

  ['teacherInstructions', 'prompt'].forEach((field) => {
    if (config[field]?.required && !getContent(model[field])) {
      errors[field] = 'This field is required.';
    }
  });

  return errors;
};
