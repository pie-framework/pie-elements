import { InputSwitch } from '@pie-lib/config-ui';

import AddCircle from '@material-ui/icons/AddCircle';
import ChoiceTile from './choice-tile';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import compact from 'lodash/compact';
import debug from 'debug';
import { swap } from '@pie-ui/placement-ordering';
import { withStyles } from '@material-ui/core/styles';

function findFreeChoiceSlot(choices) {
  let slot = 1;
  const ids = choices.map(c => c.id);
  while (ids.includes(`c${slot}`)) {
    slot++;
  }
  return slot;
}

const log = debug('@pie-element:placement-ordering:configure:choice-editor');

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
    configuration: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.moveChoice = (from, to) => {
      const { correctResponse, onChange, choices } = this.props;
      log('[moveChoice]: ', from, to);
      const update = swap(correctResponse, from, to);
      log('update: ', update);
      onChange(choices, update);
    };

    this.onChoiceChange = choice => {
      const { choices, onChange, correctResponse } = this.props;
      const index = choices.findIndex(c => c.id === choice.id);
      choices.splice(index, 1, choice);
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

    this.toggleAllOnDrag = () => {
      const { correctResponse, choices, onChange } = this.props;
      const allMoveOnDrag =
        choices.find(c => c.moveOnDrag === false) === undefined;
      choices.forEach(c => (c.moveOnDrag = !allMoveOnDrag));
      onChange(choices, correctResponse);
    };
  }

  render() {
    const { classes, correctResponse, choices, imageSupport, configuration } = this.props;
    const {
      removeTilesLabel,
      enableRemoveTiles
    } = configuration;

    const sortedChoices = compact(
      correctResponse.map(cr => choices.find(c => c.id === cr.id))
    );

    const allMoveOnDrag =
      choices.find(c => c.moveOnDrag === false) === undefined;

    return (
      <div className={classes.choiceEditor}>
        {sortedChoices.map((c, index) => (
          <ChoiceTile
            choice={c}
            onMoveChoice={this.moveChoice}
            onDelete={this.onDelete.bind(this, c)}
            onChoiceChange={this.onChoiceChange}
            index={index}
            key={index}
            imageSupport={imageSupport}
          />
        ))}
        {
          enableRemoveTiles &&
          <div className={classes.controls}>
            <InputSwitch
              className={classes.allToggle}
              checked={allMoveOnDrag}
              onChange={this.toggleAllOnDrag}
              value="allMoveOnDrag"
              label={removeTilesLabel}
            />
            <IconButton
              onClick={this.addChoice}
              classes={{
                root: classes.addButtonRoot,
                label: classes.addButtonLabel
              }}
            >
              <AddCircle classes={{ root: classes.root }} />
            </IconButton>
          </div>
        }
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
    top: '-5px'
  },
  addButtonLabel: {
    transition: 'opacity 200ms linear',
    '&:hover': {
      opacity: 0.3
    }
  }
});

export default withStyles(styles)(ChoiceEditor);
