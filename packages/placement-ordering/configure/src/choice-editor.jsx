import ChoiceTile from './choice-tile';
import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';
import Button from '@material-ui/core/Button';

function findFreeChoiceSlot(choices) {
  let slot = 1;
  const ids = choices.map(c => c.id);
  while (ids.includes(`c${slot}`)) {
    slot++;
  }
  return slot;
}

const log = debug('@pie-element:placement-ordering:configure:choice-editor');

function updateResponseOrChoices(response, choices, from, to) {
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
      { movedItem: null, remainingItems: [] }
    );

    return {
      response: [
        ...remainingItems.slice(0, placeAtIndex),
        movedItem,
        ...remainingItems.slice(placeAtIndex)
      ],
      choices
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
      { movedItem: null, remainingItems: [], toIndex: null }
    );

    return {
      response,
      choices: [
        ...remainingItems.slice(0, toIndex),
        movedItem,
        ...remainingItems.slice(toIndex)
      ]
    };
  }

  return { response, choices };
}

function buildTiles(choices, response, instanceId) {
  const targets = response.map((r, index) => {
    const respId = r && r.id;

    const choice = choices.find(c => respId !== undefined && respId !== null && c.id === respId);

    return {
      type: 'target',
      instanceId,
      ...choice,
      draggable: true,
      index,
      editable: false
    };
  });

  const processedChoices = choices.map(m => {
    return Object.assign({}, m, {
      type: 'choice',
      droppable: false,
      draggable: true,
      instanceId,
      editable: true
    });
  });

  return processedChoices.concat(targets);
}

class ChoiceEditor extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    correctResponse: PropTypes.array.isRequired,
    choices: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    }),
    disableImages: PropTypes.bool,
    toolbarOpts: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.instanceId = uniqueId();

    this.onChoiceChange = choice => {
      const { choices, onChange, correctResponse, toolbarOpts } = this.props;
      const index = choices.findIndex(c => c.id === choice.id);

      choices.splice(index, 1, { ...choices[index], label: choice.label });
      onChange(choices, correctResponse);
    };

    this.onDelete = choice => {
      const { choices, onChange, correctResponse } = this.props;
      const updatedChoices = choices.filter(c => c.id !== choice.id);
      const updatedCorrectResponse = correctResponse.filter(
        v => v.id !== choice.id
      );
      onChange(updatedChoices, updatedCorrectResponse);
    };

    this.addChoice = () => {
      const { choices, correctResponse, onChange } = this.props;
      const freeId = findFreeChoiceSlot(choices);
      const id = `c${freeId}`;
      const newChoice = { id, label: '' };

      const newCorrectResponse = {
        id,
        /**
         * Note: weights are not configurable in the existing component
         * so we'll want do disable this in the controller and ignore it for now.
         */
        weight: 0
      };

      const updatedChoices = choices.concat([newChoice]);
      const updatedCorrectResponse = correctResponse.concat([
        newCorrectResponse
      ]);

      onChange(updatedChoices, updatedCorrectResponse);
    };

    this.onDropChoice = (ordering, target, source) => {
      const { onChange } = this.props;
      const from = ordering.tiles.find(
        t => t.id === source.id && t.type === source.type
      );
      const to = target;
      log('[onDropChoice] ', from, to);
      const { response, choices } = updateResponseOrChoices(ordering.response, ordering.choices, from, to);

      onChange(choices, response);
    };
  }

  render() {
    const { classes, correctResponse, choices, imageSupport, disableImages, toolbarOpts } = this.props;

    const ordering = {
      choices,
      response: !correctResponse || isEmpty(correctResponse) ? new Array(choices.length) : correctResponse,
      tiles: buildTiles(choices, correctResponse, this.instanceId),
    };

    const style = {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: `repeat(${choices.length}, 1fr)`
    };

    return (
      <div className={classes.choiceEditor}>
        <div className={classes.vtiler} style={style}>

          {ordering.tiles.map((c, index) => (
            <ChoiceTile
              choice={c}
              index={index}
              key={index}
              imageSupport={imageSupport}
              onDelete={this.onDelete.bind(this, c)}
              onChoiceChange={this.onChoiceChange}
              onDropChoice={(source, index) => this.onDropChoice(ordering, c, source, index)}
              disableImages={disableImages}
              toolbarOpts={toolbarOpts}
            />
          ))}
        </div>
        <div className={classes.controls}>
          <Button
            onClick={this.addChoice}
            size="small"
            variant="contained"
            color="default"
            classes={{
              root: classes.addButtonRoot,
              label: classes.addButtonLabel
            }}
          >
            ADD CHOICE
          </Button>
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  allToggle: {},
  choiceEditor: {
    marginTop: '10px'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  root: {
    width: '30px',
    height: '30px',
    fill: theme.palette.primary[500]
  },
  addButtonRoot: {
    marginTop: '24px',
    paddingHorizontal: '12px'
  },
  addButtonLabel: {
    transition: 'opacity 200ms linear',
    '&:hover': {
      opacity: 0.3
    }
  },
  vtiler: {
    gridAutoFlow: 'column',
    display: 'grid',
    gridGap: '10px'
  }
});

export default withStyles(styles)(ChoiceEditor);
