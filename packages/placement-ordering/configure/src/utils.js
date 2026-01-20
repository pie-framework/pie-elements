import cloneDeep from 'lodash/cloneDeep';

export const generateValidationMessage = () => {
  const answersMessage =
    '\nThere should be at least 3 tokens.' +
    '\nThe tokens should not be empty and should be unique.' +
    '\nThe correct ordering should not be identical to the initial ordering.';

  return 'Validation requirements:' + answersMessage;
};

export function normalizeIndex(tile, ordering) {
  if (tile.type === 'target') {
    return ordering.response.findIndex(r => r.id === tile.id);
  }

  if (tile.type === 'choice') {
    return ordering.choices.findIndex(c => c.id === tile.id);
  }

  return -1;
}

export function updateResponseOrChoices(response, choices, from, to) {
  const { type: fromType, index: fromIndex } = from;
  const { type: toType, index: placeAtIndex } = to;

  if (fromType === 'target' && toType === 'target') {
    const updatedResponse = cloneDeep(response) || [];

    const { movedItem, remainingItems } = updatedResponse.reduce(
      (acc, item, index) => {
        if (index === fromIndex) {
          acc.movedItem = item;
        } else {
          acc.remainingItems.push(item);
        }

        return acc;
      },
      { movedItem: null, remainingItems: [] },
    );

    return {
      response: [...remainingItems.slice(0, placeAtIndex), movedItem, ...remainingItems.slice(placeAtIndex)],
      choices,
    };
  }

  if (fromType === 'choice' && toType === 'choice') {
    const updatedChoices = cloneDeep(choices) || [];

    const { movedItem, remainingItems, toIndex } = updatedChoices.reduce(
      (acc, item, index) => {
        if (item.id === from.id) {
          acc.movedItem = item;
        } else {
          acc.remainingItems.push(item);
        }

        if (item.id === to.id) {
          acc.toIndex = index;
        }

        return acc;
      },
      { movedItem: null, remainingItems: [], toIndex: null },
    );

    return {
      response,
      choices: [...remainingItems.slice(0, toIndex), movedItem, ...remainingItems.slice(toIndex)],
    };
  }

  return { response, choices };
}

export function buildTiles(choices, response) {
  const targets = response.map((r, index) => {
    const respId = r && r.id;
    const choice = choices.find((c) => respId !== undefined && respId !== null && c.id === respId);

    return {
      type: 'target',
      ...choice,
      draggable: true,
      index,
      editable: false,
    };
  });

  const processedChoices = choices.map((m) => {
    return Object.assign({}, m, {
      type: 'choice',
      droppable: false,
      draggable: true,
      editable: true,
    });
  });

  return processedChoices.concat(targets);
}