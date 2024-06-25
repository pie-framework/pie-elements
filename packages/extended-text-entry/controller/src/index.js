import debug from 'debug';
import { getFeedback } from '@pie-lib/pie-toolbox/feedback';
import defaults from './defaults';

const log = debug('@pie-element:extended-text-entry:controller');

export async function createDefaultModel(model = {}) {
  log('[createDefaultModel]', model);

  return { ...defaults, ...model };
}


export const normalize = (question) => ({ ...defaults, ...question });

export async function model(question, session, env) {
  log('[question]', question);
  const normalizedQuestion = normalize(question);

  const fb =
    env.mode === 'evaluate' && normalizedQuestion.feedbackEnabled
      ? getFeedback(normalizedQuestion.feedback, 'Your answer has been submitted')
      : Promise.resolve(undefined);

  let teacherInstructions = null;
  if (env.role === 'instructor' && (env.mode === 'view' || env.mode === 'evaluate')) {
    teacherInstructions = normalizedQuestion.teacherInstructionsEnabled ? normalizedQuestion.teacherInstructions : null;
  } else {
    teacherInstructions = null;
  }

  let equationEditor = normalizedQuestion.equationEditor || 'miscellaneous';

  switch (normalizedQuestion.equationEditor) {
    case 'Grade 1 - 2':
      equationEditor = 1;
      break;
    case 'Grade 3 - 5':
      equationEditor = 3;
      break;
    case 'Grade 6 - 7':
      equationEditor = 6;
      break;
    case 'Grade 8 - HS':
      equationEditor = 8;
      break;
    default:
      break;
  }

  const annotatorMode = normalizedQuestion.annotationsEnabled && (env.role === 'instructor' || env.mode === 'evaluate');

  return fb.then((feedback) => ({
    prompt: normalizedQuestion.promptEnabled ? normalizedQuestion.prompt : null,
    dimensions: normalizedQuestion.dimensions,
    customKeys: normalizedQuestion.customKeys || [],
    id: normalizedQuestion.id,
    disabled: env.mode !== 'gather',
    feedback,
    teacherInstructions,
    language:normalizedQuestion.language,
    mathInput: normalizedQuestion.mathInput,
    spanishInput: normalizedQuestion.spanishInput,
    specialInput: normalizedQuestion.specialInput,
    equationEditor,
    spellCheckEnabled: !normalizedQuestion.playerSpellCheckDisabled,
    playersToolbarPosition: normalizedQuestion.playersToolbarPosition || 'bottom',
    annotatorMode,
    disabledAnnotator: normalizedQuestion.annotationsEnabled ? env.role !== 'instructor' : true,
    predefinedAnnotations: normalizedQuestion.annotationsEnabled ? normalizedQuestion.predefinedAnnotations : [],
  }));
}

export async function outcome(/*question, session, env*/) {
  return {
    score: 0,
    completed: 'n/a',
    note: 'Requires manual scoring',
  };
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
