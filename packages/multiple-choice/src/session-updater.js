import concat from 'lodash/concat';
import uniq from 'lodash/uniq';
import without from 'lodash/without';

export function updateSessionValue(session, choiceMode, data) {
  session.value = session.value || [];
  if (choiceMode === 'checkbox') {
    if (data.selected) {
      session.value = uniq(concat(session.value, [data.value]));
    } else {
      session.value = without(session.value, data.value);
    }
  }


  if (choiceMode === 'radio') {
    if (data.selected) {
      session.value = [data.value]
    } else {
      session.value = [];
    }
  }
}
