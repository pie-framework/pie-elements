export function updateSessionValue(session, choiceMode, data) {
  session.value = session.value || [];
  if (choiceMode === 'checkbox') {
    if (data.selected) {
      session.value = Array.from(new Set([...session.value, data.value]));
    } else {
      session.value = session.value.filter(v => v !== data.value);
    }
  }

  if (choiceMode === 'radio') {
    if (data.selected) {
      session.value = [data.value];
    } else {
      session.value = [];
    }
  }
  
  //update session value metadata
  session.selector = data.selector; //the input method used to select the choice (e.g. mouse, keyboard)
}

export function updateSessionMetadata(session, metadata) {
  session.audioStartTime = session.audioStartTime || metadata.audioStartTime; //timestamp when auto-played audio started playing
  session.audioEndTime = session.audioEndTime || metadata.audioEndTime; //timestamp when auto-played audio completed playing
  
  if(!session.waitTime && session.audioStartTime && session.audioEndTime) {
    // waitTime is elapsed time the user waited for auto-played audio to finish
    session.waitTime = (session.audioEndTime - session.audioStartTime);
  }
}
