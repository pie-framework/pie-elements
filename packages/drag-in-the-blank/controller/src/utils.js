import reduce from 'lodash/reduce';
import find from 'lodash/find';

export const getAllCorrectResponses = ({ correctResponse, alternateResponses }) => {
  return reduce(correctResponse || {}, (obj, val, key) => {
    obj[key] = [val];

    if (alternateResponses && alternateResponses[key]) {
      obj[key] = [
        ...obj[key],
        ...alternateResponses[key]
      ];
    }

    return obj;
  }, {});
};
