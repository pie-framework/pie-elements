export function updateSessionValue(session, model, data) {
  const { id, selected } = data;
  const { multipleCorrect } = model || {};
  session.answers = session.answers || [];

  if (!selected) {
    session.answers = session.answers.filter((answer) => answer.id !== id);
  } else {
    const item = { id };
    if (multipleCorrect) {
      session.answers.push(item);
    } else {
      session.answers = [item];
    }

    //update session metadata
    session.selector = data.selector;
  }
}

export function updateSessionMetadata(session, metadata) {
  session.audioStartTime = session.audioStartTime || metadata.audioStartTime; //timestamp when auto-played audio started playing
  session.audioEndTime = session.audioEndTime || metadata.audioEndTime; //timestamp when auto-played audio completed playing

  if (!session.waitTime && session.audioStartTime && session.audioEndTime) {
    // waitTime is elapsed time the user waited for auto-played audio to finish
    session.waitTime = session.audioEndTime - session.audioStartTime;
  }
}
