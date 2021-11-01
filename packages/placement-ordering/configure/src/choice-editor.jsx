import ChoiceTile from './choice-tile';
import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';
import shuffle from 'lodash/shuffle';
import isEqual from 'lodash/isEqual';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

export const InfoDialog = ({ title, open, onOk }) => (
  <Dialog open={open}>
    <DialogTitle>{title}</DialogTitle>
    <DialogActions>
      {onOk && (
        <Button onClick={onOk} color="primary">
          OK
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

InfoDialog.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  onOk: PropTypes.func,
};

function findFreeChoiceSlot(choices) {
  let slot = 1;
  const ids = choices.map(c => c.id);
  while (ids.includes(`c${slot}`)) {
    slot++;
  }
  return slot;
}

const log = debug('@pie-element:placement-ordering:configure:choice-editor');

function updateResponse(response, from, to) {
  const update = cloneDeep(response);
  const { type: fromType } = from;
  const { type: toType, index: placeAtIndex } = to;

  if ((fromType === 'choice' && toType === 'target') || (fromType === 'target' && toType === 'target')) {
    const optionToSwitch = update[placeAtIndex];

    const currentPositionOfOption = update.findIndex(up => up.id === from.id);
    const option = update.find(up => up.id === from.id);

    update[placeAtIndex] = option;
    update[currentPositionOfOption] = optionToSwitch;

    return update;
  }

  return response;
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
    toolbarOpts: PropTypes.object,
    placementArea: PropTypes.bool,
    singularChoiceLabel: PropTypes.string,
    pluralChoiceLabel: PropTypes.string,
    choicesLabel: PropTypes.string
  };

  state = {
    dialog: {
      open: false
    }
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
      const { choices, onChange, correctResponse, choicesLabel } = this.props;

      if (choices && choices.length === 3) {
        this.setState({
          dialog: {
            open: true,
            message: `There have to be at least 3 ${choicesLabel}.`,
            onOk: () => {
              this.setState(
                {
                  dialog: {
                    open: false,
                  }
                }
              );
            }
          }
        });
      }
      else {
        const updatedChoices = choices.filter(c => c.id !== choice.id);
        const updatedCorrectResponse = correctResponse.filter(
          v => v.id !== choice.id
        );
        onChange(updatedChoices, updatedCorrectResponse);
      }
    };

    this.addChoice = () => {
      const { choices, correctResponse, onChange, choicesLabel } = this.props;

      if (choices && choices.length === 10) {
        this.setState({
          dialog: {
            open: true,
            message: `There can be maximum 10 ${choicesLabel}.`,
            onOk: () => {
              this.setState(
                {
                  dialog: {
                    open: false,
                  }
                }
              );
            }
          }
        });
      }
      else {
        const freeId = findFreeChoiceSlot(choices);
        const id = `c${freeId}`;
        const newChoice = {id, label: ''};

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
      }
    };

    this.shuffleChoices = () => {
      const { onChange, choices, correctResponse, placementArea } = this.props;
      let shuffled = shuffle(choices);

      // if placementArea is disabled, make sure we don't shuffle choices in the correct order
      const shuffledCorrect = !placementArea && isEqual(shuffled.map(item => item.id), correctResponse.map(item => item.id));

      if (shuffledCorrect) {
        const shuffledTwice = shuffle(shuffled);

        onChange(shuffledTwice, correctResponse);
      } else {
        onChange(shuffled, correctResponse);
      }
    };

    this.onDropChoice = (ordering, target, source) => {
      const { onChange, choices } = this.props;
      const from = ordering.tiles.find(
        t => t.id === source.id && t.type === source.type
      );
      const to = target;
      log('[onDropChoice] ', from, to);
      const response = updateResponse(ordering.response, from, to);

      onChange(choices, response);
    };
  }

  render() {
    const {
      classes,
      correctResponse,
      choices,
      imageSupport,
      disableImages,
      toolbarOpts,
      singularChoiceLabel,
      pluralChoiceLabel,
      choicesLabel
    } = this.props;
    const { dialog } = this.state;

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
              choices={choices}
              choicesLabel={choicesLabel}
            />
          ))}
        </div>
        <div className={classes.controls}>
          <Button
            onClick={this.shuffleChoices}
            size="small"
            variant="contained"
            color="default"
            classes={{
              root: classes.addButtonRoot,
              label: classes.addButtonLabel
            }}
          >
            {`SHUFFLE ${pluralChoiceLabel}`.toUpperCase()}
          </Button>
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
            {`ADD ${singularChoiceLabel}`.toUpperCase()}
          </Button>
        </div>
        <InfoDialog
          title={dialog.message}
          open={dialog.open}
          onOk={dialog.onOk}
        />
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
