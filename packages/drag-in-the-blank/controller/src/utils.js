import cloneDeep from 'lodash/cloneDeep';
import reduce from 'lodash/reduce';

export const getAllCorrectResponses = ({ correctResponse, alternateResponses }) => {
  return reduce(correctResponse || {}, (obj, val, key) => {
    obj[key] = [val];

    if (alternateResponses && alternateResponses[key]) {
      obj[key] = [
        ...obj[key],
        ...cloneDeep(alternateResponses[key])
      ];
    }

    return obj;
  }, {});
};
