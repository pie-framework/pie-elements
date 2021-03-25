export function updateSessionValue(session, data) {
  session.value = data.value || session.value || {};
}
