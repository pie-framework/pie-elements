export function updateSessionValue(session, data) {
  session.value = session.value || [];
  if (data.selected) {
    session.value = [data.value]
  } else {
    session.value = [];
  }
}
