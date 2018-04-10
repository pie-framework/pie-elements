export const model = (question, session, env) => {
  const { model } = question;
debugger;
  return Promise.resolve({
    width: model.width,
    height: model.height,
    disabled: env.mode !== 'gather',
    pointLabels: model.pointLabels,
    domain: model.domain,
    range: model.range,
  });
};
