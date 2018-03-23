export function model(question, session, env) {
  return new Promise((resolve, reject) => {
    resolve({
      disabled: env.mode !== 'gather',
      out: env.mode === 'evaluate' ? ((!session.value) ? '' : session.value ) : undefined
    });
  });
}