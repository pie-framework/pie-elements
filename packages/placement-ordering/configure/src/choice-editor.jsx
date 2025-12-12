import PropTypes from 'prop-types';
import React from 'react';
import debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import shuffle from 'lodash/shuffle';
import isEqual from 'lodash/isEqual';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { InputContainer } from '@pie-lib/render-ui';
import { AlertDialog } from '@pie-lib/config-ui';

import { buildTiles } from './utils';
import ChoiceTile from './choice-tile';

function findFreeChoiceSlot(choices) {
  let slot = 1;
  const ids = choices.map((c) => c.id);

  while (ids.includes(`c${slot}`)) {
    slot++;
  }

  return slot;
}

const log = debug('@pie-element:placement-ordering:configure:choice-editor');

const StyledControls = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const StyledAddButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2.5),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  '& .MuiButton-label': {
    transition: 'opacity 200ms linear',
    '&:hover': {
      opacity: 0.3,
    },
  },
}));

const StyledVTiler = styled('div')(({ theme }) => ({
  gridAutoFlow: 'column',
  display: 'grid',
  gridGap: '10px',
  alignItems: 'center',
}));

const StyledColumnLabel = styled(InputContainer)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(1),
}));

class ChoiceEditor extends React.Component {
  static propTypes = {
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
  }

  render() {
    const {
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
      ordering,
    } = this.props;
    const { warning } = this.state;
    const { choicesErrors, orderError } = errors || {};

    const vTilerStyle = {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: `repeat(${choices.length}, 1fr)`,
    };

    return (
      <div>
        <StyledVTiler style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <StyledColumnLabel label={`Student ${choicesLabel || 'Choices'}`} />
          <StyledColumnLabel label="Correct Order" />
        </StyledVTiler>
        <StyledVTiler style={vTilerStyle}>
          {ordering.tiles.map((choice, index) => (
            <ChoiceTile
              key={`${choice.type}-${choice.id}`}
              choice={choice}
              index={index}
              imageSupport={imageSupport}
              onDelete={this.onDelete.bind(this, choice)}
              onChoiceChange={this.onChoiceChange}
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
        </StyledVTiler>
        {orderError && <ErrorText>{orderError}</ErrorText>}
        <StyledControls>
          <StyledAddButton
            onClick={this.shuffleChoices}
            size="small"
            variant="contained">
            {`SHUFFLE ${pluralChoiceLabel}`.toUpperCase()}
          </StyledAddButton>

          <StyledAddButton
            onClick={this.addChoice}
            size="small"
            variant="contained">
            {`ADD ${singularChoiceLabel}`.toUpperCase()}
          </StyledAddButton>
        </StyledControls>
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

export default ChoiceEditor;
