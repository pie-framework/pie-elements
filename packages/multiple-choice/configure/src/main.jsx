import React from 'react';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import {
  InputContainer,
  ChoiceConfiguration,
  settings,
  layout,
  choiceUtils as utils,
} from '@pie-lib/config-ui';
import { color } from '@pie-lib/render-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import merge from 'lodash/merge';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Info from '@material-ui/icons/Info';
import { generateValidationMessage } from './utils';

const { Panel, toggle, radio, dropdown } = settings;

const MAX_CHOICES = 9;

const styles = (theme) => ({
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
  },
  rationaleHolder: {
    width: '70%',
  },
  accessibilityHolder: {
    width: '70%',
  },
  rationale: {
    paddingTop: theme.spacing.unit * 2,
  },
  accessibility: {
    paddingTop: theme.spacing.unit * 2,
  },
  design: {
    paddingTop: theme.spacing.unit * 3,
  },
  choiceConfigurationHolder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  choiceConfiguration: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  switchElement: {
    justifyContent: 'space-between',
    margin: 0,
  },
  addButton: {
    float: 'right',
  },
  disableButton: {
    cursor: 'not-allowed',
    pointerEvents: 'all',
    backgroundColor: color.disabled(),
    '&:hover': {
      backgroundColor: color.disabled(),
    },
    '&:focus': {
      backgroundColor: color.disabled(),
    },
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px'
  },
  titleText: {
    fontFamily: 'Cerebri Sans',
    fontSize: '18px',
    lineHeight: '19px',
    color: '#495B8F',
    marginRight: '5px'
  },
  tooltip: {
    fontSize: '12px',
    whiteSpace: 'pre',
    maxWidth: '500px'
  },
  errorText: {
    fontSize: '12px',
    color: 'red',
    paddingTop: '5px'
  }
});

const Design = withStyles(styles)((props) => {
  const {
    classes,
    model,
    configuration,
    onPromptChanged,
    onChoiceChanged,
    onRemoveChoice,
    onAddChoice,
    imageSupport,
    onChangeModel,
    onConfigurationChanged,
    onTeacherInstructionsChanged,
  } = props;
  const {
    prompt = {},
    addChoiceButton = {},
    feedback = {},
    deleteChoice = {},
    choiceMode = {},
    choicePrefix = {},
    partialScoring = {},
    lockChoiceOrder = {},
    teacherInstructions = {},
    studentInstructions = {},
    rationale = {},
    accessibility = {},
    scoringType = {},
    sequentialChoiceLabels = {},
    settingsPanelDisabled,
    choicesLayout,
    spellCheck = {},
    gridColumns
  } = configuration || {};
  let { maxAnswerChoices } = configuration || {};
  const {
    limitChoicesNumber,
    teacherInstructionsEnabled,
    rationaleEnabled,
    accessibilityLabelsEnabled,
    feedbackEnabled,
    promptEnabled,
    spellCheckEnabled,
    choices,
    // errors
  } = model || {};

  // const { choicesErrors, correctResponseError, answerChoicesError } = errors || {};
  const nrOfColumnsAvailable =
    choices && choices.length
      ? Array.from({ length: choices.length }, (_, i) => `${i + 1}`)
      : [];

  const labelPlugins = {
    audio: { disabled: true },
    video: { disabled: true },
  };

  const toolbarOpts = {};

  switch (model.toolbarEditorPosition) {
    case 'top':
      toolbarOpts.position = 'top';
      break;
    default:
      toolbarOpts.position = 'bottom';
      break;
  }

  // if old property is used, set maxAnswerChoices to 9
  if (limitChoicesNumber) {
    maxAnswerChoices = MAX_CHOICES;
  }

  const validationMessage = generateValidationMessage(configuration);

  const Content = (
    <div>
      {teacherInstructionsEnabled && (
        <InputContainer
          label={teacherInstructions.label}
          className={classes.promptHolder}
        >
          <EditableHtml
            className={classes.prompt}
            markup={model.teacherInstructions || ''}
            onChange={onTeacherInstructionsChanged}
            imageSupport={imageSupport}
            nonEmpty={false}
            toolbarOpts={toolbarOpts}
            spellCheck={spellCheckEnabled}
          />
        </InputContainer>
      )}

      {promptEnabled && (
        <InputContainer label={prompt.label} className={classes.promptHolder}>
          <EditableHtml
            className={classes.prompt}
            markup={model.prompt}
            onChange={onPromptChanged}
            imageSupport={imageSupport}
            nonEmpty={false}
            disableUnderline
            toolbarOpts={toolbarOpts}
            spellCheck={spellCheckEnabled}
          />
        </InputContainer>
      )}
      <div className={classes.flexContainer}>
        <Typography className={classes.titleText}>Choices</Typography>
        <Tooltip
          classes={{ tooltip: classes.tooltip }}
          disableFocusListener
          disableTouchListener
          placement={'right'}
          title={validationMessage}
        >
          <Info fontSize={'small'} color={'primary'}/>
        </Tooltip>
      </div>
      {correctResponseError && <div className={classes.errorText}>{correctResponseError}</div>}
      {answerChoicesError && <div className={classes.errorText}>{answerChoicesError}</div>}
      {choices.map((choice, index) => (
        <div
          key={`choice-${index}`}
          className={classes.choiceConfigurationHolder}
        >
          <ChoiceConfiguration
            key={index}
            index={index + 1}
            useLetterOrdering={model.choicePrefix === 'letters'}
            className={classes.choiceConfiguration}
            mode={model.choiceMode}
            data={choice}
            defaultFeedback={{}}
            imageSupport={imageSupport}
            onDelete={() => onRemoveChoice(index)}
            onChange={(c) => onChoiceChanged(index, c)}
            allowFeedBack={feedbackEnabled}
            allowDelete={deleteChoice.settings}
            noLabels
            toolbarOpts={toolbarOpts}
            spellCheck={spellCheckEnabled}
            // error={choicesErrors && choicesErrors[choice.value] ? choicesErrors[choice.value] : null}
            // noCorrectAnswerError={correctResponseError}
          />
          {rationaleEnabled && (
            <InputContainer
              key={`rationale-${index}`}
              label={rationale.label}
              className={classes.rationaleHolder}
            >
              <EditableHtml
                className={classes.rationale}
                markup={choice.rationale || ''}
                onChange={(c) =>
                  onChoiceChanged(index, {
                    ...choice,
                    rationale: c,
                  })
                }
                imageSupport={imageSupport}
                toolbarOpts={toolbarOpts}
                pluginProps={labelPlugins}
                spellCheck={spellCheckEnabled}
              />
            </InputContainer>
          )}
          {accessibilityLabelsEnabled && (
            <InputContainer
              key={`accessibility-${index}`}
              label={accessibility.label}
              className={classes.accessibilityHolder}
            >
              <EditableHtml
                className={classes.accessibility}
                markup={choice.accessibility || ''}
                onChange={(c) =>
                  onChoiceChanged(index, {
                    ...choice,
                    accessibility: c,
                  })
                }
                imageSupport={imageSupport}
                pluginProps={labelPlugins}
                spellCheck={spellCheckEnabled}
              />
            </InputContainer>
          )}
        </div>
      ))}
      <br />
      {addChoiceButton.settings && (
        <Tooltip
          title={
            maxAnswerChoices && model.choices.length >= maxAnswerChoices
              ? `Only ${maxAnswerChoices} allowed maximum`
              : ''
          }
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            classes={{ root: maxAnswerChoices && model.choices.length >= maxAnswerChoices && classes.disableButton }}
            className={classes.addButton}
            variant="contained"
            color="primary"
            onClick={onAddChoice}
          >
            {addChoiceButton.label}
          </Button>
        </Tooltip>
      )}
    </div>
  );

  const settingsInPanel = {
    choiceMode:
      choiceMode.settings && radio(choiceMode.label, ['checkbox', 'radio']),
    'sequentialChoiceLabels.enabled':
      sequentialChoiceLabels.settings &&
      toggle(sequentialChoiceLabels.label, true),
    choicePrefix:
      choicePrefix.settings &&
      radio(choicePrefix.label, ['numbers', 'letters']),
    partialScoring: partialScoring.settings && toggle(partialScoring.label),
    lockChoiceOrder: lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
    feedbackEnabled: feedback.settings && toggle(feedback.label),
    choicesLayout:
      choicesLayout.settings &&
      dropdown(choicesLayout.label, ['vertical', 'grid', 'horizontal']),
    gridColumns:
      choicesLayout.settings &&
      model.choicesLayout === 'grid' &&
      nrOfColumnsAvailable.length > 0 &&
      dropdown(gridColumns.label, nrOfColumnsAvailable),
  };

  return (
    <div className={classes.design}>
      {settingsPanelDisabled ? (
        Content
      ) : (
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              onChangeModel={onChangeModel}
              configuration={configuration}
              onChangeConfiguration={onConfigurationChanged}
              groups={{
                Settings: settingsInPanel,
                Properties: {
                  teacherInstructionsEnabled:
                    teacherInstructions.settings &&
                    toggle(teacherInstructions.label),
                  studentInstructionsEnabled:
                    studentInstructions.settings &&
                    toggle(studentInstructions.label),
                  promptEnabled: prompt.settings && toggle(prompt.label),
                  rationaleEnabled:
                    rationale.settings && toggle(rationale.label),
                  spellCheckEnabled:
                    spellCheck.settings && toggle(spellCheck.label),
                  accessibilityLabelsEnabled:
                    accessibility.settings && toggle(accessibility.label),
                  scoringType:
                    scoringType.settings &&
                    radio(scoringType.label, ['auto', 'rubric']),
                },
              }}
            />
          }
        >
          {Content}
        </layout.ConfigLayout>
      )}
    </div>
  );
});

const InfoDialog = ({ open, onCancel, onOk, title }) => (
  <Dialog open={open}>
    <DialogTitle>{title}</DialogTitle>
    <DialogActions>
      {onOk && (
        <Button onClick={onOk} color="primary">
          OK
        </Button>
      )}
      {onCancel && (
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

InfoDialog.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  title: PropTypes.string,
};

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    disableSidePanel: PropTypes.bool,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
  };

  state = {
    dialog: {
      open: false,
    },
  };

  onRemoveChoice = (index) => {
    const { model, configuration } = this.props;
    const { minAnswerChoices } = configuration || {};

    if (minAnswerChoices && model.choices.length === minAnswerChoices) {
      this.setState({
        dialog: {
          open: true,
          message: `There can't be less than ${minAnswerChoices} choices.`,
          onOk: () => {
            this.setState({
              dialog: {
                open: false,
              },
            });
          }
        }
      });
    } else {
      model.choices.splice(index, 1);
      this.props.onModelChanged(model);
    }
  };

  onAddChoice = () => {
    const { model, configuration } = this.props;
    let { maxAnswerChoices } = configuration || {};
    const { limitChoicesNumber } = model || {};

    // if old property is used, set maxAnswerChoices to 9
    if (limitChoicesNumber) {
      maxAnswerChoices = MAX_CHOICES;
    }

    if (maxAnswerChoices && model.choices.length >= maxAnswerChoices) {
      return;
    }

    model.choices.push({
      label: '',
      value: utils.firstAvailableIndex(model.choices.map((c) => c.value), 0),
      feedback: { type: 'none' }
    });

    this.props.onModelChanged(model);
  };

  onChoiceChanged = (index, choice) => {
    const { model } = this.props;

    if (choice.correct && model.choiceMode === 'radio') {
      model.choices = model.choices.map((c) => {
        return merge({}, c, { correct: false });
      });
    }

    model.choices.splice(index, 1, choice);
    this.props.onModelChanged(model);
  };

  onPromptChanged = (prompt) => {
    this.props.onModelChanged({
      ...this.props.model,
      prompt,
    });
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    this.props.onModelChanged({
      ...this.props.model,
      teacherInstructions,
    });
  };

  onModelChanged = (model, key) => {
    const { onModelChanged } = this.props;

    switch (key) {
      case 'choiceMode': {
        let value = model.choiceMode;

        if (value === 'radio') {
          let correctFound = false;

          model.choices = model.choices.map((c) => {
            if (correctFound) {
              c.correct = false;

              return c;
            }

            if (c.correct) {
              correctFound = true;
            }

            return c;
          });
        }

        onModelChanged(model, true);
        break;
      }
      default:
        onModelChanged(model);
        break;
    }
  };

  render() {
    const { dialog } = this.state;

    return (
      <>
        <InfoDialog
          open={dialog.open}
          title={dialog.message}
          onCancel={dialog.onCancel}
          onOk={dialog.onOk}
        />
        <Design
          {...this.props}
          onChangeModel={this.onModelChanged}
          onRemoveChoice={this.onRemoveChoice}
          onChoiceChanged={this.onChoiceChanged}
          onAddChoice={this.onAddChoice}
          onPromptChanged={this.onPromptChanged}
          onTeacherInstructionsChanged={this.onTeacherInstructionsChanged}
        />
      </>
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;
