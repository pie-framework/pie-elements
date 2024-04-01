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
import { InputContainer } from '@pie-lib/pie-toolbox/render-ui';
import { AlertDialog } from '@pie-lib/pie-toolbox/config-ui';

function findFreeChoiceSlot(choices) {
  let slot = 1;
  const ids = choices.map((c) => c.id);

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

function buildTiles(choices, response, instanceId) {
  const targets = response.map((r, index) => {
    const respId = r && r.id;
    const choice = choices.find((c) => respId !== undefined && respId !== null && c.id === respId);

    return {
      type: 'target',
      instanceId,
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
      instanceId,
      editable: true,
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
      delete: PropTypes.func.isRequired,
    }),
    maxImageHeight: PropTypes.object,
    maxImageWidth: PropTypes.object,
    toolbarOpts: PropTypes.object,
    pluginProps: PropTypes.object,
    placementArea: PropTypes.bool,
    singularChoiceLabel: PropTypes.string,
    pluralChoiceLabel: PropTypes.string,
    choicesLabel: PropTypes.string,
    errors: PropTypes.object,
    spellCheck: PropTypes.bool,
  };

  state = { warning: { open: false } };

  constructor(props) {
    super(props);

    this.instanceId = uniqueId();

    this.onChoiceChange = (choice) => {
      const { choices, onChange, correctResponse } = this.props;
      const index = choices.findIndex((c) => c.id === choice.id);

      choices.splice(index, 1, { ...choices[index], label: choice.label });
      onChange(choices, correctResponse);
    };

    this.onDelete = (choice) => {
      const { choices, onChange, correctResponse, choicesLabel } = this.props;

      if (choices && choices.length === 3) {
        this.setState({
          warning: {
            open: true,
            text: `There have to be at least 3 ${choicesLabel}.`,
          },
        });
      } else {
        const updatedChoices = choices.filter((c) => c.id !== choice.id);
        const updatedCorrectResponse = correctResponse.filter((v) => v.id !== choice.id);

        onChange(updatedChoices, updatedCorrectResponse);
      }
    };

    this.addChoice = () => {
      const { choices, correctResponse, onChange, choicesLabel } = this.props;

      if (choices && choices.length === 10) {
        this.setState({
          warning: {
            open: true,
            text: `There can be maximum 10 ${choicesLabel}.`,
          },
        });
      } else {
        const freeId = findFreeChoiceSlot(choices);
        const id = `c${freeId}`;
        const newChoice = { id, label: '' };

        const newCorrectResponse = {
          id,
          /**
           * Note: weights are not configurable in the existing component
           * so we'll want do disable this in the controller and ignore it for now.
           */
          weight: 0,
        };

        const updatedChoices = choices.concat([newChoice]);
        const updatedCorrectResponse = correctResponse.concat([newCorrectResponse]);

        onChange(updatedChoices, updatedCorrectResponse);
      }
    };

    this.shuffleChoices = () => {
      const { onChange, choices, correctResponse, placementArea } = this.props;
      let shuffled = shuffle(choices);

      // if placementArea is disabled, make sure we don't shuffle choices in the correct order
      const shuffledCorrect =
        !placementArea &&
        isEqual(
          shuffled.map((item) => item.id),
          correctResponse.map((item) => item.id),
        );

      if (shuffledCorrect) {
        const shuffledTwice = shuffle(shuffled);

        onChange(shuffledTwice, correctResponse);
      } else {
        onChange(shuffled, correctResponse);
      }
    };

    this.onDropChoice = (ordering, target, source) => {
      const { onChange } = this.props;
      const from = ordering.tiles.find((t) => t.id === source.id && t.type === source.type);
      const to = target;
      log('[onDropChoice] ', from, to);
      const { response, choices } = updateResponseOrChoices(ordering.response, ordering.choices, from, to);

      onChange(choices, response);
    };
  }

  render() {
    const {
      classes,
      correctResponse,
      choices,
      imageSupport,
      toolbarOpts,
      pluginProps,
      singularChoiceLabel,
      pluralChoiceLabel,
      choicesLabel,
      spellCheck,
      maxImageWidth,
      maxImageHeight,
      errors,
      mathMlOptions = {},
    } = this.props;
    const { warning } = this.state;
    const { choicesErrors, orderError } = errors || {};

    const ordering = {
      choices,
      response: !correctResponse || isEmpty(correctResponse) ? new Array(choices.length) : correctResponse,
      tiles: buildTiles(choices, correctResponse, this.instanceId),
    };

    const vTilerStyle = {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: `repeat(${choices.length}, 1fr)`,
    };

    return (
      <div className={classes.choiceEditor}>
        <div className={classes.vtiler} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <InputContainer label={`Student ${choicesLabel || 'Choices'}`} className={classes.columnLabel} />
          <InputContainer label="Correct Order" className={classes.columnLabel} />
        </div>

        <div className={classes.vtiler} style={vTilerStyle}>
          {ordering.tiles.map((choice, index) => (
            <ChoiceTile
              choice={choice}
              index={index}
              key={index}
              imageSupport={imageSupport}
              onDelete={this.onDelete.bind(this, choice)}
              onChoiceChange={this.onChoiceChange}
              onDropChoice={(source, index) => this.onDropChoice(ordering, choice, source, index)}
              toolbarOpts={toolbarOpts}
              pluginProps={pluginProps}
              choices={choices}
              choicesLabel={choicesLabel}
              spellCheck={spellCheck}
              maxImageWidth={maxImageWidth}
              maxImageHeight={maxImageHeight}
              error={choicesErrors?.[choice.id] || (orderError && ' ') || null}
              mathMlOptions={mathMlOptions}
            />
          ))}
        </div>

        {orderError && <div className={classes.errorText}>{orderError}</div>}

        <div className={classes.controls}>
          <Button
            onClick={this.shuffleChoices}
            size="small"
            variant="contained"
            color="default"
            classes={{ root: classes.addButtonRoot, label: classes.addButtonLabel }}
          >
            {`SHUFFLE ${pluralChoiceLabel}`.toUpperCase()}
          </Button>

          <Button
            onClick={this.addChoice}
            size="small"
            variant="contained"
            color="default"
            classes={{ root: classes.addButtonRoot, label: classes.addButtonLabel }}
          >
            {`ADD ${singularChoiceLabel}`.toUpperCase()}
          </Button>
        </div>

        <AlertDialog
          open={warning.open}
          title="Warning"
          text={warning.text}
          onConfirm={() => this.setState({ warning: { open: false } })}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  allToggle: {},
  choiceEditor: {},
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  root: {
    width: '30px',
    height: '30px',
    fill: theme.palette.primary[500],
  },
  addButtonRoot: {
    marginTop: theme.spacing.unit * 2.5,
    paddingHorizontal: theme.spacing.unit * 1.5,
  },
  addButtonLabel: {
    transition: 'opacity 200ms linear',
    '&:hover': {
      opacity: 0.3,
    },
  },
  vtiler: {
    gridAutoFlow: 'column',
    display: 'grid',
    gridGap: '10px',
  },
  columnLabel: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
});

export default withStyles(styles)(ChoiceEditor);
