import {buildState, reducer} from '../ordering';
import _ from 'lodash';

describe('ordering', () => {
  const toLabel = a => `${a[0]}->${a[1]}`;

  const choice = id => ({
    type: 'choice',
    id,
    draggable: true,
    droppable: false
  });

  const target = (id, index) => ({
    id,
    index,
    type: 'target',
    draggable: id !== undefined,
    empty: id === undefined
  });

  const buildArgs = choiceArg => {
    if (Array.isArray(choiceArg)) {
      return {
        choices: choiceArg,
        response: [],
        outcome: []
      };
    }

    return {response: [], outcome: [], ...choiceArg};
  };

  const buildEndState = (input, actions, action, opts) => {
    const {choices, response, outcome} = buildArgs(input);
    const choiceIds = choices.map(id => ({id}));
    const initialState = buildState(choiceIds, response, outcome, opts);

    return (actions || []).reduce((state, [fromIndex, toIndex]) => {
      let tiles;

      if (!opts.includeTargets) {
        tiles = state.tiles.filter(tile => tile.type === 'choice');
      } else {
        tiles = state.tiles;
      }

      const from = tiles[fromIndex];
      const to = tiles[toIndex];

      return reducer({...action, from, to}, state);
    }, initialState);
  };

  describe('reducer', () => {
    const assertPushLabel = (i, actions, e) =>
      `${i.tiles.map(t => t.id)} + ${actions.map(toLabel).join(', ')} = ${e}`;

    const assertMoveLabel = (i, actions, expected) => {
      const tiles = _.take(i.tiles, 4).map(t => t.id);

      return `${tiles} + ${actions.map(toLabel)} = ${expected.choices
        .map(c => c || '_')}|${expected.targets.map(t => t || '_')}`;
    };

    const assertResponseLabel = (s, actions, expected) =>
      `${actions.map(toLabel)} = response: ${expected.map(v => v || '_')}`;
    const allProps = {includeTargets: true, allowSameChoiceInTargets: true};
    const withoutTargets = {includeTargets: false};
    const uniqueChoiceInTargets = {includeTargets: true, allowSameChoiceInTargets: false};
    const moveAction = {type: 'move'};
    const simpleInput = [1, 2, 3, 4];
    const shortInput = [1, 2];
    const responseInput = {choices: [1, 2], response: [undefined, 1]};

    describe.each([
      [
        simpleInput,
        [[0, 1]],
        moveAction,
        withoutTargets,
        [2, 1, 3, 4]
      ],
      [
        simpleInput,
        [[0, 1], [2, 1]],
        moveAction,
        withoutTargets,
        [2, 3, 1, 4]
      ],
      [
        simpleInput,
        [[0, 4]],
        moveAction,
        uniqueChoiceInTargets,
        {
          choices: [undefined, 2, 3, 4],
          targets: [1, undefined, undefined, undefined]
        }
      ],
      [simpleInput,
        [[0, 4]],
        moveAction,
        allProps,
        {
          choices: [1, 2, 3, 4],
          targets: [1, undefined, undefined, undefined]
        }
      ],
      [
        simpleInput,
        [[0, 4], [2, 7]],
        moveAction,
        uniqueChoiceInTargets,
        {
          choices: [undefined, 2, undefined, 4],
          targets: [1, undefined, undefined, 3]
        }
      ],
      [
        shortInput,
        [[0, 3]],
        moveAction,
        allProps,
        [choice(1), choice(2), target(undefined, 0), target(1, 1)]
      ],
      [
        shortInput,
        [[0, 3]],
        moveAction,
        allProps,
        {response: [undefined, 1]}
      ],
      [
        shortInput,
        [[0, 2]],
        moveAction,
        allProps,
        {response: [1, undefined]}
      ],
      [
        responseInput,
        [[3, 0]],
        moveAction,
        allProps,
        {response: [undefined, undefined]}
      ],
      [
        responseInput,
        [[3, 1]],
        moveAction,
        allProps,
        {response: [undefined, undefined]}
      ],
      [
        responseInput,
        [[3, 2]],
        moveAction,
        allProps,
        {response: [1, undefined]}
      ],
    ])("$input => $expected", (input, actions, actionType, opts, expected) => {
      const state = buildEndState(input, actions, actionType, opts);

      if (!opts.includeTargets) {
        const label = assertPushLabel(state, actions, expected);

        it(label, () => {
          expect(state.tiles
            .map(t => t.id)
            .filter((item, index, array) => array.indexOf(item) === index))
            .toEqual(expected);
        });
      } else if (expected.choices) {
        const label = assertMoveLabel(state, actions, expected);

        it(label, () => {
          let [choiceTiles, targetTiles] = _.chunk(state.tiles, 4);

          expect(choiceTiles.map(t => t.id)).toEqual(expected.choices);
          expect(targetTiles.map(t => t.id)).toEqual(expected.targets);
        });
      } else if (expected.response) {
        const label = assertResponseLabel(state, actions, expected.response);

        it(label, () => {
          expect(state.response).toEqual(expected.response);
        });
      } else {
        it('works', () => {
          expect(state.tiles).toEqual(expected);
        });
      }
    });
  });
});
