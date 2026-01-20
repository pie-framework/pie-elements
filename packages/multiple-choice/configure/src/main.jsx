import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import EditableHtml from '@pie-lib/editable-html';
import {
  AlertDialog,
  InputContainer,
  ChoiceConfiguration,
  settings,
  layout,
  choiceUtils as utils,
} from '@pie-lib/config-ui';
import { color } from '@pie-lib/render-ui';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Info from '@mui/icons-material/Info';
import merge from 'lodash/merge';
import { generateValidationMessage } from './utils';

const { Panel, toggle, radio, dropdown } = settings;

const MAX_CHOICES = 9;

const PromptHolder = styled(InputContainer)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const RationaleHolder = styled(InputContainer)(({ theme }) => ({
  flex: 1,
  marginTop: theme.spacing(1.5),
  paddingTop: theme.spacing(2),
  marginLeft: theme.spacing(3.5),
}));

const ChoiceConfigurationHolder = styled(InputContainer)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(1),
  width: '100%',
}));


const AddButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  float: 'right',
}));

const DisableButton = styled(AddButton)({
  cursor: 'not-allowed',
  pointerEvents: 'all',
  backgroundColor: color.disabled(),
  '&:hover': {
    backgroundColor: color.disabled(),
  },
  '&:focus': {
    backgroundColor: color.disabled(),
  },
});

const FlexContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.fontSize + 2,
  marginRight: theme.spacing(1),
}));

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(1),
}));

const Design = (props) => {
  const {
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
    feedbackEnabled,
    promptEnabled,
    spellCheckEnabled,
    choices,
    errors,
    toolbarEditorPosition,
    extraCSSRules,
  } = model || {};

  const {
    answerChoices: answerChoicesError,
    choices: choicesErrors,
    correctResponse: correctResponseError,
    prompt: promptError,
    rationale: rationaleErrors,
    teacherInstructions: teacherInstructionsError,
  } = errors || {};
  const nrOfColumnsAvailable = choices?.length ? Array.from({ length: choices.length }, (_, i) => `${i + 1}`) : [];

  const { baseInputConfiguration = {} } = configuration;
  const toolbarOpts = {
    position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
  };

  // if old property is used, set maxAnswerChoices to 9
  if (limitChoicesNumber) {
    maxAnswerChoices = MAX_CHOICES;
  }

  const getPluginProps = (props = {}) => ({
    ...baseInputConfiguration,
    ...props,
  });

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
    scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric']),
    rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
  };

  return (
    <layout.ConfigLayout
      dimensions={contentDimensions}
      hideSettings={settingsPanelDisabled}
      extraCSSRules={extraCSSRules}
      classes={{}}
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
        <PromptHolder label={teacherInstructions.label}>
            <EditableHtml
              markup={model.teacherInstructions || ''}
              onChange={onTeacherInstructionsChanged}
              imageSupport={imageSupport}
              nonEmpty={false}
              disableUnderline
              error={teacherInstructionsError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(configuration?.teacherInstructions?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {teacherInstructionsError && <ErrorText>{teacherInstructionsError}</ErrorText>}
        </PromptHolder>
      )}

      {promptEnabled && (
        <PromptHolder label={prompt.label}>
            <EditableHtml
              markup={model.prompt}
              onChange={onPromptChanged}
              imageSupport={imageSupport}
              nonEmpty={false}
              disableUnderline
              error={promptError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(configuration?.prompt?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={maxImageWidth && maxImageWidth.prompt}
              maxImageHeight={maxImageHeight && maxImageHeight.prompt}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {promptError && <ErrorText>{promptError}</ErrorText>}
        </PromptHolder>
      )}

      <FlexContainer>
        <TitleText component={'div'}>
          Choices
        </TitleText>
        <StyledTooltip
          disableFocusListener
          disableTouchListener
          placement={'right'}
          title={validationMessage}
        >
          <Info fontSize={'small'} color={'primary'} />
        </StyledTooltip>
      </FlexContainer>

      {choices.map((choice, index) => (
        <ChoiceConfigurationHolder key={`choice-${index}`}>
          <ChoiceConfiguration
            key={index}
            index={index + 1}
            useLetterOrdering={model.choicePrefix === 'letters'}
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
            <RationaleHolder key={`rationale-${index}`} label={rationale.label}>
                <EditableHtml
                  markup={choice.rationale || ''}
                  onChange={(c) => onChoiceChanged(index, { ...choice, rationale: c })}
                  imageSupport={imageSupport}
                  error={rationaleErrors?.[choice.value] || null}
                  toolbarOpts={toolbarOpts}
                  pluginProps={getPluginProps(configuration?.rationale?.inputConfiguration)}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
                  maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
                  uploadSoundSupport={uploadSoundSupport}
                  languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                  mathMlOptions={mathMlOptions}
                />
                {rationaleErrors?.[choice.value] && (
                  <ErrorText>{rationaleErrors?.[choice.value]}</ErrorText>
                )}
            </RationaleHolder>
          )}
        </ChoiceConfigurationHolder>
      ))}

      {correctResponseError && <ErrorText>{correctResponseError}</ErrorText>}
      {answerChoicesError && <ErrorText>{answerChoicesError}</ErrorText>}

      {addChoiceButton.settings && (
        <StyledTooltip title={addChoiceButtonTooltip}>
          {maxAnswerChoices && choices?.length >= maxAnswerChoices ? (
            <DisableButton
              variant="contained"
              color="primary"
              onClick={onAddChoice}
              disabled
            >
              {addChoiceButton.label}
            </DisableButton>
          ) : (
            <AddButton
              variant="contained"
              color="primary"
              onClick={onAddChoice}
            >
              {addChoiceButton.label}
            </AddButton>
          )}
        </StyledTooltip>
      )}
    </layout.ConfigLayout>
  );
};

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    disableSidePanel: PropTypes.bool,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
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

export default Main;
