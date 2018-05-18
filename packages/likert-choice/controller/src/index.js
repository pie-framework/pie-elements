export function model(question, session, env) {
  return new Promise(resolve => {
    console.log(question,session,env);
  });
}