import React from 'react';
import PropTypes from 'prop-types';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import {
  AlertDialog,
  InputContainer,
  ChoiceConfiguration,
  settings,
  layout,
  choiceUtils as utils,
} from '@pie-lib/pie-toolbox/config-ui';
import { color } from '@pie-lib/pie-toolbox/render-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Info from '@material-ui/icons/Info';
import merge from 'lodash/merge';
import { generateValidationMessage } from './utils';

const { Panel, toggle, radio, dropdown } = settings;

const MAX_CHOICES = 9;

const styles = (theme) => ({
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  rationaleHolder: {
    flex: 1,
    marginTop: theme.spacing.unit * 1.5,
    paddingTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 3.5,
  },
  accessibilityHolder: {
    flex: 1,
    marginTop: theme.spacing.unit * 1.5,
    paddingTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 3.5,
  },
  choiceConfigurationHolder: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing.unit,
  },
  choiceConfiguration: {
    width: '100%',
  },
  switchElement: {
    justifyContent: 'space-between',
    margin: 0,
  },
  addButton: {
    marginTop: theme.spacing.unit,
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
  },
  titleText: {
    fontSize: theme.typography.fontSize + 2,
    marginRight: theme.spacing.unit,
  },
  tooltip: {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
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
    uploadSoundSupport,
    onChangeModel,
    onConfigurationChanged,
    onTeacherInstructionsChanged,
  } = props;

  const {
    addChoiceButton = {},
    contentDimensions = {},
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
    gridColumns,
    maxImageWidth = {},
    maxImageHeight = {},
    prompt = {},
    withRubric = {},
    mathMlOptions = {},
    language = {},
    languageChoices = {},
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
    errors,
    toolbarEditorPosition,
  } = model || {};

  const { choicesErrors, correctResponseError, answerChoicesError } = errors || {};
  const nrOfColumnsAvailable = choices?.length ? Array.from({ length: choices.length }, (_, i) => `${i + 1}`) : [];

  const { baseInputConfiguration = {} } = configuration;
  const toolbarOpts = {
    position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
  };

  // if old property is used, set maxAnswerChoices to 9
  if (limitChoicesNumber) {
    maxAnswerChoices = MAX_CHOICES;
  }

  const getPluginProps = (props) => {
    return Object.assign({
        ...baseInputConfiguration,
      },
      props || {},
    );
  };

  const validationMessage = generateValidationMessage(configuration);
  const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
  const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;
  const addChoiceButtonTooltip =
    maxAnswerChoices && choices?.length >= maxAnswerChoices ? `Only ${maxAnswerChoices} allowed maximum` : '';

  const panelSettings = {
    choiceMode: choiceMode.settings && radio(choiceMode.label, ['checkbox', 'radio']),
    'sequentialChoiceLabels.enabled': sequentialChoiceLabels.settings && toggle(sequentialChoiceLabels.label, true),
    choicePrefix: choicePrefix.settings && radio(choicePrefix.label, ['numbers', 'letters']),
    partialScoring: partialScoring.settings && toggle(partialScoring.label),
    lockChoiceOrder: lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
    feedbackEnabled: feedback.settings && toggle(feedback.label),
    choicesLayout: choicesLayout.settings && dropdown(choicesLayout.label, ['vertical', 'grid', 'horizontal']),
    gridColumns:
      choicesLayout.settings &&
      model.choicesLayout === 'grid' &&
      nrOfColumnsAvailable.length > 0 &&
      dropdown(gridColumns.label, nrOfColumnsAvailable),
    'language.enabled': language.settings && toggle(language.label, true),
    language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
  };

  const panelProperties = {
    teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
    studentInstructionsEnabled: studentInstructions.settings && toggle(studentInstructions.label),
    promptEnabled: prompt.settings && toggle(prompt.label),
    rationaleEnabled: rationale.settings && toggle(rationale.label),
    spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
    accessibilityLabelsEnabled: accessibility.settings && toggle(accessibility.label),
    scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric']),
    rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
  };

  return (
    <layout.ConfigLayout
      dimensions={contentDimensions}
      hideSettings={settingsPanelDisabled}
      settings={
        <Panel
          model={model}
          onChangeModel={onChangeModel}
          configuration={configuration}
          onChangeConfiguration={onConfigurationChanged}
          groups={{
            Settings: panelSettings,
            Properties: panelProperties,
          }}
        />
      }
    >
      {teacherInstructionsEnabled && (
        <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
          <EditableHtml
            className={classes.prompt}
            markup={model.teacherInstructions || ''}
            onChange={onTeacherInstructionsChanged}
            imageSupport={imageSupport}
            nonEmpty={false}
            toolbarOpts={toolbarOpts}
            pluginProps={getPluginProps(configuration?.teacherInstructions?.inputConfiguration)}
            spellCheck={spellCheckEnabled}
            maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
            maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
            uploadSoundSupport={uploadSoundSupport}
            languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            mathMlOptions={mathMlOptions}
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
            pluginProps={getPluginProps(configuration?.prompt?.inputConfiguration)}
            spellCheck={spellCheckEnabled}
            maxImageWidth={maxImageWidth && maxImageWidth.prompt}
            maxImageHeight={maxImageHeight && maxImageHeight.prompt}
            uploadSoundSupport={uploadSoundSupport}
            languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            mathMlOptions={mathMlOptions}
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
          <Info fontSize={'small'} color={'primary'} />
        </Tooltip>
      </div>

      {choices.map((choice, index) => (
        <div key={`choice-${index}`} className={classes.choiceConfigurationHolder}>
          <ChoiceConfiguration
            key={index}
            index={index + 1}
            useLetterOrdering={model.choicePrefix === 'letters'}
            className={classes.choiceConfiguration}
            mode={model.choiceMode}
            data={choice}
            defaultFeedback={{}}
            imageSupport={imageSupport}
            disableImageAlignmentButtons={true}
            onDelete={() => onRemoveChoice(index)}
            onChange={(c) => onChoiceChanged(index, c)}
            allowFeedBack={feedbackEnabled}
            allowDelete={deleteChoice.settings}
            noLabels
            pluginOpts={getPluginProps(configuration?.choices?.inputConfiguration)}
            toolbarOpts={toolbarOpts}
            spellCheck={spellCheckEnabled}
            error={choicesErrors?.[choice.value] || null}
            noCorrectAnswerError={correctResponseError}
            maxImageWidth={(maxImageWidth && maxImageWidth.choices) || defaultImageMaxWidth}
            maxImageHeight={(maxImageHeight && maxImageHeight.choices) || defaultImageMaxHeight}
            uploadSoundSupport={uploadSoundSupport}
            mathMlOptions={mathMlOptions}
          />

          {rationaleEnabled && (
            <InputContainer key={`rationale-${index}`} label={rationale.label} className={classes.rationaleHolder}>
              <EditableHtml
                className={classes.rationale}
                markup={choice.rationale || ''}
                onChange={(c) => onChoiceChanged(index, { ...choice, rationale: c })}
                imageSupport={imageSupport}
                toolbarOpts={toolbarOpts}
                pluginProps={getPluginProps(configuration?.rationale?.inputConfiguration)}
                spellCheck={spellCheckEnabled}
                maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
                maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
                uploadSoundSupport={uploadSoundSupport}
                languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                mathMlOptions={mathMlOptions}
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
                onChange={(c) => onChoiceChanged(index, { ...choice, accessibility: c })}
                imageSupport={imageSupport}
                pluginProps={getPluginProps(configuration?.accessibility?.inputConfiguration)}
                spellCheck={spellCheckEnabled}
                maxImageWidth={(maxImageWidth && maxImageWidth.choices) || defaultImageMaxWidth}
                maxImageHeight={(maxImageHeight && maxImageHeight.choices) || defaultImageMaxHeight}
                uploadSoundSupport={uploadSoundSupport}
                languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                mathMlOptions={mathMlOptions}
              />
            </InputContainer>
          )}
        </div>
      ))}

      {correctResponseError && <div className={classes.errorText}>{correctResponseError}</div>}
      {answerChoicesError && <div className={classes.errorText}>{answerChoicesError}</div>}

      {addChoiceButton.settings && (
        <Tooltip title={addChoiceButtonTooltip} classes={{ tooltip: classes.tooltip }}>
          <Button
            classes={{ root: maxAnswerChoices && choices?.length >= maxAnswerChoices && classes.disableButton }}
            className={classes.addButton}
            variant="contained"
            color="primary"
            onClick={onAddChoice}
          >
            {addChoiceButton.label}
          </Button>
        </Tooltip>
      )}
    </layout.ConfigLayout>
  );
});

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

  state = { showWarning: false };

  onRemoveChoice = (index) => {
    const { model, configuration, onModelChanged } = this.props;
    const { minAnswerChoices } = configuration || {};

    if (minAnswerChoices && model.choices.length === minAnswerChoices) {
      this.setState({ showWarning: true });

      return;
    }

    model.choices.splice(index, 1);
    onModelChanged(model);
  };

  onAddChoice = () => {
    const { model, configuration, onModelChanged } = this.props;
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
      value: utils.firstAvailableIndex(
        model.choices.map((c) => c.value),
        0,
      ),
      feedback: { type: 'none' },
    });

    onModelChanged(model);
  };

  onChoiceChanged = (index, choice) => {
    const { model, onModelChanged } = this.props;

    if (choice.correct && model.choiceMode === 'radio') {
      model.choices = model.choices.map((c) => merge({}, c, { correct: false }));
    }

    model.choices.splice(index, 1, choice);
    onModelChanged(model);
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
    const { configuration: { minAnswerChoices } = {} } = this.props;
    const { showWarning } = this.state;

    return (
      <React.Fragment>
        <AlertDialog
          open={showWarning}
          title="Warning"
          text={`There can't be less than ${minAnswerChoices || 0} choices.`}
          onConfirm={() => this.setState({ showWarning: false })}
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
      </React.Fragment>
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;
