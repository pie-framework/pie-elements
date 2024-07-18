import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Choice from './choice';
import Header from '../header';
import every from 'lodash/every';
import Config from './config';
import { choiceUtils as utils } from '@pie-lib/pie-toolbox/config-ui';
import { removeAllChoices } from '@pie-lib/pie-toolbox/categorize';
import { rearrangeChoices } from '@pie-lib/pie-toolbox/categorize';

export class Choices extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
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
    return every(choices, (c) => c.categoryCount === count);
  };

  addChoice = () => {
    const { onModelChanged, model, choices: oldChoices } = this.props;
    let { maxAnswerChoices } = model || {};

    if (maxAnswerChoices && model.choices?.length >= maxAnswerChoices) {
      return;
    }

    const id = utils.firstAvailableIndex(
      model.choices.map((a) => a.id),
      0,
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

  rearrangeChoices = (indexFrom, indexTo) => {
    const { model, onModelChanged } = this.props || {};
    let { choices } = model || [];
    choices = rearrangeChoices(choices, indexFrom, indexTo);
    onModelChanged({ choices });
  };

  render() {
    const { focusedEl } = this.state;
    const {
      classes,
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
      <div className={classNames(classes.choices, className)}>
        <Header
          label="Choices"
          buttonLabel="ADD A CHOICE"
          onAdd={this.addChoice}
          buttonDisabled={maxAnswerChoices && choices && maxAnswerChoices === choices?.length}
          tooltip={addChoiceButtonTooltip}
        />

        <Config config={model} onModelChanged={onModelChanged} spellCheck={spellCheck} />

        <div className={classes.choiceHolder} style={choiceHolderStyle}>
          {choices.map((h, index) => {
            return (
              <Choice
                choice={h}
                focusedEl={focusedEl}
                deleteFocusedEl={this.deleteFocusedEl}
                correctResponseCount={h.correctResponseCount}
                allowMultiplePlacements={allowMultiplePlacementsEnabled}
                lockChoiceOrder={lockChoiceOrder}
                index={index}
                key={index}
                imageSupport={imageSupport}
                onChange={this.changeChoice}
                onDelete={() => this.deleteChoice(h)}
                rearrangeChoices={(indexFrom, indexTo) => this.rearrangeChoices(indexFrom, indexTo)}
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
        </div>
        {choicesError && <div className={classes.errorText}>{choicesError}</div>}
      </div>
    );
  }
}

const styles = (theme) => ({
  choiceHolder: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    display: 'grid',
    gridRowGap: `${theme.spacing.unit}px`,
    gridColumnGap: `${theme.spacing.unit}px`,
  },
  choices: {
    marginBottom: theme.spacing.unit * 2.5,
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit / 2,
  },
});

export default withStyles(styles)(Choices);
