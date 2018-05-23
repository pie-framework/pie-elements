export function model(question, session, env) {
  return new Promise((resolve, reject) => {
    const out = {
      id: question.id,
      element: question.element,
      prompt: question.prompt,
      choiceMode: question.choiceMode,
      keyMode: question.keyMode,
      activeLang: question.activeLang,
      defaultLang: question.defaultLang,
      responseType: question.responseType,
      disabled: question.disabled,
      labelType: question.labelType,
      choices: question.choices,
      graphicsType: question.graphicsType,
      reverse: question.reverse
    };
    resolve(out);
  })
}