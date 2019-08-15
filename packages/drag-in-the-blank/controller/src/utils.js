import cloneDeep from 'lodash/cloneDeep';
import reduce from 'lodash/reduce';

export const getAllCorrectResponses = ({ correctResponse, alternateResponses }) => {
  return reduce(correctResponse || {}, (obj, val, key) => {
    obj.possibleResponses[key] = [val];

    if (alternateResponses && alternateResponses[key]) {
      obj.possibleResponses[key] = [
        ...obj.possibleResponses[key],
        ...cloneDeep(alternateResponses[key])
      ];
    }

    if (obj.numberOfPossibleResponses === undefined || obj.numberOfPossibleResponses > obj.possibleResponses[key].length) {
      obj.numberOfPossibleResponses = obj.possibleResponses[key].length;
    }

    return obj;
  }, {
    possibleResponses: {},
    numberOfPossibleResponses: undefined
  });
};