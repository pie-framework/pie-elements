export function model(question, session, env) {
  return Promise.resolve({
    disabled: env.mode !== 'gather'
  });
}