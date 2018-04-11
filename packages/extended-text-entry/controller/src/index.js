export function model(model, session, env) {
  return new Promise(resolve => {
    let base = {
      disabled: env.mode !== 'gather',
      mode: env.mode,
      value: env.mode === 'evaluate' ? ((!session.value) ? '' : session.value ) : undefined
    };

    const out = Object.assign(base, model);
    resolve(out);
  });
}