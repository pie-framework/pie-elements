export function updateSessionValue(session, model, data) {
  const { id, selected } = data;
  const { multipleCorrect } = model;
  session.answers = session.answers || [];

  if (!selected) {
    session.answers = session.answers.filter(answer => answer.id !== id);
  } else {
    const item = { id };
    if (multipleCorrect) {
      session.answers.push(item);
    } else {
      session.answers = [item];
    }
  }
}
