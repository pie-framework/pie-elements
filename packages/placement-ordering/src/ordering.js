import cloneDeep from 'lodash/cloneDeep';
import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import assign from 'lodash/assign';

const log = debug('pie-elements:placement-ordering:ordering');

export const push = (arr, fromIndex, toIndex) => {
  const movedItem = arr.find((item, index) => index === fromIndex);
  const remainingItems = arr.filter((item, index) => index !== fromIndex);

  return [
    ...remainingItems.slice(0, toIndex),
    movedItem,
    ...remainingItems.slice(toIndex)
  ];
}

export const swap = (arr, fromIndex, toIndex) => {
  log('[swap]', arr, fromIndex, toIndex);
  if (
    !arr ||
    arr.length <= 1 ||
    fromIndex === undefined ||
    toIndex === undefined
  ) {
    throw new Error(
      `swap requires a non-empty array, fromIndex, toIndex: ${arr}, ${fromIndex} ${toIndex}`
    );
  }
  const update = cloneDeep(arr);
  const tmp = arr[toIndex];
  update[toIndex] = update[fromIndex];
  update[fromIndex] = tmp;
  return update;
};

function removeResponse(state, targetTile) {
  const update = cloneDeep(state.response);

  if (update[targetTile.index] === targetTile.id) {
    update[targetTile.index] = undefined;
  } else {
    throw new Error(
      `Tried to remove from index: ${
        targetTile.index
      }, but the id doesn't match: array: ${update}, target: ${targetTile.id}`
    );
  }
  return update;
}

function updateResponse(state, from, to) {
  const { response, opts } = state;
  const update = cloneDeep(response);
  if (opts.includeTargets) {
    if (from.type === 'choice' && to.type === 'target') {
      update[to.index] = from.id;
      return update;
    } else if (from.type === 'target' && to.type === 'choice') {
      update[from.index] = undefined;
      return update;
    } else if (from.type === 'target' && to.type === 'target') {
      return swap(response, from.index, to.index);
    } else {
      log('do nothing to the response');
      return response;
    }
  } else {
    const fromIndex = state.response.findIndex(
      r => r !== undefined && r === from.id
    );
    const toIndex = state.response.findIndex(
      r => r !== undefined && r === to.id
    );
    log('fromIndex: ', fromIndex, 'toIndex:', toIndex);
    return push(state.response, fromIndex, toIndex);
  }
}

function buildTiles(choices, response, outcomes, opts) {
  if (opts.includeTargets) {
    const targets = [];
    for (let i = 0; i < response.length; i++) {
      const r = response[i];

      const choice = choices.find(
        c => r !== undefined && r !== null && c.id === r
      );
      //TODO: index needs to match too!!
      const outcome = outcomes[i];

      const out = Object.assign(
        { type: 'target', index: i, empty: choice === undefined },
        choice,
        outcome,
        { draggable: choice !== undefined }
      );

      targets.push(out);
    }

    const processedChoices = choices.map(m => {
      if (response.indexOf(m.id) !== -1 && !opts.allowSameChoiceInTargets) {
        return {
          type: 'choice',
          empty: true,
          droppable: true,
          draggable: false
        };
      } else {
        return Object.assign({}, m, {
          type: 'choice',
          droppable: false,
          draggable: true
        });
      }
    });

    return processedChoices.concat(targets);
  } else {
    return response.reduce((acc, id, index) => {
      const emptyTile = Object.assign(
        { type: 'empty', draggable: false, droppable: true },
        choices.find(m => m.id === id),
        outcomes[index]
      );
      const choiceTile = Object.assign(
        { type: 'choice', draggable: true, droppable: true },
        choices.find(m => m.id === id),
        outcomes[index]
      )

      if(index === 0) {
        acc.push(emptyTile)
      }

      acc.push(choiceTile, emptyTile);

      return acc;
    }, []);
  }
}

export function buildState(choices, response, outcomes, opts) {
  opts = assign({ includeTargets: true }, opts);

  outcomes = outcomes || [];
  response =
    !response || isEmpty(response)
      ? opts.includeTargets
        ? new Array(choices.length)
        : map(choices, c => c.id)
      : response;
  return {
    choices,
    response,
    opts,
    outcomes,
    tiles: buildTiles(choices, response, outcomes, opts)
  };
}

export function reducer(action, state) {
  switch (action.type) {
    case 'move': {
      const { from, to } = action;
      const response = updateResponse(state, from, to);
      const tiles = buildTiles(
        state.choices,
        response,
        state.outcomes,
        state.opts
      );
      return Object.assign({}, state, { response, tiles });
    }
    case 'remove': {
      const { target } = action;
      const response = removeResponse(state, target);
      const tiles = buildTiles(
        state.choices,
        response,
        state.outcomes,
        state.opts
      );
      return Object.assign({}, state, { response, tiles });
    }
  }
  return state;
}
