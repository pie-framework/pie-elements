import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Choice from './choice';
import Header from '../header';
import Config from './config';
import { choiceUtils as utils } from '@pie-lib/config-ui';
import { removeAllChoices } from '@pie-lib/categorize';

const ChoicesContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
}));

const ChoiceHolder = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  display: 'grid',
  gridRowGap: `${theme.spacing(1)}px`,
  gridColumnGap: `${theme.spacing(1)}px`,
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(0.5),
}));

export class Choices extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    className: PropTypes.string,
    choices: PropTypes.array.isRequired,
    defaultImageMaxWidth: PropTypes.number,
    defaultImageMaxHeight: PropTypes.number,
    onModelChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    toolbarOpts: PropTypes.object,
    spellCheck: PropTypes.bool,
  };

  static defaultProps = {};

  state = {
    focusedEl: null,
  };

  changeChoice = (choice) => {
    const { choices, onModelChanged } = this.props;
    const index = choices.findIndex((h) => h.id === choice.id);
    if (index !== -1) {
      choices.splice(index, 1, choice);
      onModelChanged({ choices });
    }
  };

  allChoicesHaveCount = (count) => {
    const { choices } = this.props;
    return Array.isArray(choices) && choices.every((c) => c.categoryCount === count);
  };

  addChoice = () => {
    const { onModelChanged, model, choices: oldChoices } = this.props;
    let { maxAnswerChoices } = model || {};

    if (maxAnswerChoices && model.choices?.length >= maxAnswerChoices) {
      return;
    }

    const id = utils.firstAvailableIndex(
      model.choices.map((a) => a.id),
      1,
    );
    const data = { id, content: 'Choice ' + id };

    this.setState(
      {
        focusedEl: oldChoices.length,
      },
      () => {
        onModelChanged({ choices: model.choices.concat([data]) });
      },
    );
  };

  deleteFocusedEl = () => {
    this.setState({
      focusedEl: null,
    });
  };

  deleteChoice = (choice) => {
    const { model, onModelChanged } = this.props;
    const index = model.choices.findIndex((a) => a.id === choice.id);
    if (index !== -1) {
      model.choices.splice(index, 1);
      model.correctResponse = removeAllChoices(choice.id, model.correctResponse);
      onModelChanged(model);
    }
  };

  render() {
    const { focusedEl } = this.state;
    const {
      className,
      choices,
      model,
      imageSupport,
      uploadSoundSupport,
      onModelChanged,
      spellCheck,
      toolbarOpts,
      configuration,
      defaultImageMaxWidth,
      defaultImageMaxHeight,
    } = this.props;
    const { errors, allowMultiplePlacementsEnabled, lockChoiceOrder, maxAnswerChoices } = model;
    const { choicesError, choicesErrors } = errors || {};
    const { maxImageWidth = {}, maxImageHeight = {} } = configuration || {};
    const choiceHolderStyle = {
      gridTemplateColumns: `repeat(${model.categoriesPerRow}, 1fr)`,
    };
    const addChoiceButtonTooltip =
      maxAnswerChoices && choices?.length >= maxAnswerChoices ? `Only ${maxAnswerChoices} allowed maximum` : '';

    return (
      <ChoicesContainer className={className}>
        <Header
          label="Choices"
          buttonLabel="ADD A CHOICE"
          onAdd={this.addChoice}
          buttonDisabled={maxAnswerChoices && choices && choices?.length >= maxAnswerChoices}
          tooltip={addChoiceButtonTooltip}
        />

        <Config config={model} onModelChanged={onModelChanged} spellCheck={spellCheck} />

        <ChoiceHolder style={choiceHolderStyle}>
          {choices.map((h, index) => {
            return (
              <Choice
                key={h.id}
                choice={h}
                focusedEl={focusedEl}
                deleteFocusedEl={this.deleteFocusedEl}
                correctResponseCount={h.correctResponseCount}
                allowMultiplePlacements={allowMultiplePlacementsEnabled}
                lockChoiceOrder={lockChoiceOrder}
                index={index}
                imageSupport={imageSupport}
                onChange={this.changeChoice}
                onDelete={() => this.deleteChoice(h)}
                toolbarOpts={toolbarOpts}
                spellCheck={spellCheck}
                error={choicesErrors && choicesErrors[h.id]}
                maxImageWidth={(maxImageWidth && maxImageWidth.choice) || defaultImageMaxWidth}
                maxImageHeight={(maxImageHeight && maxImageHeight.choice) || defaultImageMaxHeight}
                uploadSoundSupport={uploadSoundSupport}
                configuration={configuration}
              />
            );
          })}
        </ChoiceHolder>
        {choicesError && <ErrorText>{choicesError}</ErrorText>}
      </ChoicesContainer>
    );
  }
}

export default Choices;
