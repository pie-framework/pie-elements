export function model(model, session, env) {
  return new Promise(resolve => {
    const modelResult = !model ? {} : model;
    resolve((env && env.role && env.role === 'instructor') ? modelResult : {});
  });
}
