import isEqual from 'lodash/isEqual';

export const getCorrectResponse = (choices) =>
  choices
    .filter((c) => c.correct)
    .map((c) => c.value)
    .sort();

export const isResponseCorrect = (question, session) => {
  let correctResponse = getCorrectResponse(question.choices);
  return session && isEqual((session.value || []).sort(), correctResponse);
};

export const parseHTML = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
};
