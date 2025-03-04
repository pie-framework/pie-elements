import { FeedbackConfig, FormSection, InputContainer, settings, layout } from '@pie-lib/pie-toolbox/config-ui';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import { withStyles } from '@material-ui/core/styles';
import { withDragContext } from '@pie-lib/pie-toolbox/drag';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

import debug from 'debug';
import cloneDeep from 'lodash/cloneDeep';
import { get, set } from 'nested-property';
import PropTypes from 'prop-types';
import React from 'react';
import pluralize from 'pluralize';

import ChoiceEditor from './choice-editor';
import { generateValidationMessage } from './utils';

const log = debug('@pie-element:placement-ordering:design');
const { Panel, toggle, radio, dropdown } = settings;

const getSingularAndPlural = (label) =>
  !pluralize.isPlural(label)
    ? {
        singularLabel: label,
        pluralLabel: pluralize(label),
      }
    : {
        singularLabel: pluralize.singular(label),
        pluralLabel: label,
      };

export class Design extends React.Component {
  static propTypes = {
    uploadSoundSupport: PropTypes.object,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.applyUpdate = (modelFn) => {
      const { model, onModelChanged } = this.props;
      const update = modelFn(cloneDeep(model));

      onModelChanged(update);
    };

    this.changeHandler = (modelPath, valuePath) => {
      return (value) => {
        log('[changeHandler] value: ', value);

        const v = valuePath ? get(value, valuePath) : value;

        this.applyUpdate((model) => {
          set(model, modelPath, v);

          return model;
        });
      };
    };

    this.onPromptChange = this.changeHandler('prompt');

    this.onTeacherInstructionsChange = this.changeHandler('teacherInstructions');

    this.onRationaleChange = this.changeHandler('rationale');

    this.onChoiceAreaLabelChange = this.changeHandler('choiceLabel', 'target.value');

    this.onAnswerAreaLabelChange = this.changeHandler('targetLabel', 'target.value');

    this.onFeedbackChange = this.changeHandler('feedback');

    this.onChoiceEditorChange = (choices, correctResponse) => {
      const { model, onModelChanged } = this.props;
      const update = cloneDeep(model);

      update.choices = choices;
      update.correctResponse = correctResponse;
      onModelChanged(update);
    };
  }

  componentDidMount() {
    const { model, onModelChanged } = this.props || {};
    const { feedback } = model || {};
    const update = cloneDeep(model);

    // requirement made in PD-2182
    if (!feedback) {
      update.feedbackEnabled = false;
      onModelChanged(update);
    }
  }

  render() {
    const { model, classes, imageSupport, uploadSoundSupport, onModelChanged, configuration, onConfigurationChanged } =
      this.props;
    const {
      baseInputConfiguration = {},
      choiceLabel = {},
      choices = {},
      contentDimensions = {},
      feedback = {},
      prompt = {},
      placementArea = {},
      maxImageWidth = {},
      maxImageHeight = {},
      numberedGuides = {},
      orientation = {},
      partialScoring = {},
      rationale = {},
      removeTilesAfterPlacing = {},
      settingsPanelDisabled,
      studentInstructions = {},
      spellCheck = {},
      scoringType = {},
      targetLabel = {},
      teacherInstructions = {},
      withRubric = {},
      mathMlOptions = {},
      language = {},
      languageChoices = {},
    } = configuration || {};
    const {
      choiceLabelEnabled,
      errors,
      extraCSSRules,
      feedbackEnabled,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      toolbarEditorPosition,
    } = model || {};
    const {
      prompt: promptError,
      rationale: rationaleError,
      teacherInstructions: teacherInstructionsError,
    } = errors || {};

    const validationMessage = generateValidationMessage();

    const { singularLabel = '', pluralLabel = '' } = (choices?.label && getSingularAndPlural(choices.label)) || {};

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;
    const maxChoicesImageWidth =
      maxImageWidth && model.placementArea
        ? maxImageWidth.choicesWithPlacementArea
        : maxImageWidth.choicesWithoutPlacementArea || defaultImageMaxWidth;
    const maxChoicesImageHeight = (maxImageHeight && maxImageHeight.choices) || defaultImageMaxHeight;

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    const panelSettings = {
      choiceLabelEnabled: choiceLabel.settings && toggle(choiceLabel.label),
      placementArea: placementArea.settings && toggle(placementArea.label),
      numberedGuides: numberedGuides.settings && model.placementArea && toggle(numberedGuides.label),
      orientation: orientation.settings && radio(orientation.label, ['vertical', 'horizontal']),
      removeTilesAfterPlacing: removeTilesAfterPlacing.settings && toggle(removeTilesAfterPlacing.label),
      partialScoring: partialScoring.settings && toggle(partialScoring.label),
      feedbackEnabled: feedback.settings && toggle(feedback.label),
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
    };

    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      studentInstructionsEnabled: studentInstructions.settings && toggle(studentInstructions.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric']),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
    };

    const getPluginProps = (props = {}) => ({
      ...baseInputConfiguration,
      ...props,
    });

    return (
      <layout.ConfigLayout
        extraCSSRules={extraCSSRules}
        dimensions={contentDimensions}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={(model) => onModelChanged(model)}
            onChangeConfiguration={(configuration) => onConfigurationChanged(configuration, true)}
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
              onChange={this.onTeacherInstructionsChange}
              imageSupport={imageSupport}
              nonEmpty={false}
              error={teacherInstructionsError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(teacherInstructions?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {teacherInstructionsError && <div className={classes.errorText}>{teacherInstructionsError}</div>}
          </InputContainer>
        )}

        {promptEnabled && (
          <InputContainer label={prompt && prompt.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={this.onPromptChange}
              imageSupport={imageSupport}
              error={promptError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(prompt?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={maxImageWidth && maxImageWidth.prompt}
              maxImageHeight={maxImageHeight && maxImageHeight.prompt}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {promptError && <div className={classes.errorText}>{promptError}</div>}
          </InputContainer>
        )}

        <FormSection
          className={classes.choicesWrapper}
          label={`Define ${pluralLabel}`}
          labelExtraStyle={{ display: 'inline-flex' }}
        >
          <div className={classes.inlineFlexContainer}>
            <Tooltip
              classes={{ tooltip: classes.tooltip }}
              disableFocusListener
              disableTouchListener
              placement={'right'}
              title={validationMessage}
            >
              <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '8px' }} />
            </Tooltip>
          </div>

          <div className={classes.row}>
            {choiceLabelEnabled && (
              <InputContainer
                label={choiceLabel && choiceLabel.label && `${singularLabel} label`}
                className={classes.promptHolder}
              >
                <EditableHtml
                  {...(model.placementArea && { autoWidthToolbar: true })}
                  className={classes.prompt}
                  markup={model.choiceLabel}
                  onChange={this.onChoiceAreaLabelChange}
                  toolbarOpts={toolbarOpts}
                  pluginProps={getPluginProps(choiceLabel?.inputConfiguration)}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={maxChoicesImageWidth}
                  maxImageHeight={maxChoicesImageHeight}
                  uploadSoundSupport={uploadSoundSupport}
                  languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                  mathMlOptions={mathMlOptions}
                />
              </InputContainer>
            )}

            {targetLabel.settings && model.placementArea && (
              <InputContainer
                label={targetLabel && targetLabel.label && targetLabel.label}
                className={classes.promptHolder}
              >
                <EditableHtml
                  autoWidthToolbar
                  className={classes.prompt}
                  markup={model.targetLabel}
                  onChange={this.onAnswerAreaLabelChange}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={(maxImageWidth && maxImageWidth.choicesWithPlacementArea) || defaultImageMaxWidth}
                  maxImageHeight={maxChoicesImageHeight}
                  uploadSoundSupport={uploadSoundSupport}
                  languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
                  mathMlOptions={mathMlOptions}
                />
              </InputContainer>
            )}
          </div>

          {choices.settings && (
            <ChoiceEditor
              correctResponse={model.correctResponse}
              choices={model.choices}
              onChange={this.onChoiceEditorChange}
              imageSupport={imageSupport}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(choices?.inputConfiguration)}
              choicesLabel={choices.label}
              placementArea={model.placementArea}
              singularChoiceLabel={singularLabel}
              pluralChoiceLabel={pluralLabel}
              spellCheck={spellCheckEnabled}
              maxImageWidth={maxChoicesImageWidth}
              maxImageHeight={maxChoicesImageHeight}
              errors={errors || {}}
              mathMlOptions={mathMlOptions}
            />
          )}
        </FormSection>

        {rationaleEnabled && (
          <InputContainer label={rationale.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.rationale || ''}
              onChange={this.onRationaleChange}
              imageSupport={imageSupport}
              error={rationaleError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(rationale?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {rationaleError && <div className={classes.errorText}>{rationaleError}</div>}
          </InputContainer>
        )}

        {feedbackEnabled && (
          <FeedbackConfig
            feedback={model.feedback}
            onChange={this.onFeedbackChange}
            imageSupport={imageSupport}
            toolbarOpts={toolbarOpts}
          />
        )}
      </layout.ConfigLayout>
    );
  }
}

Design.defaultProps = {
  onModelChanged: () => {},
  onConfigurationChanged: () => {},
};

Design.propTypes = {
  model: PropTypes.object.isRequired,
  configuration: PropTypes.object.isRequired,
  onModelChanged: PropTypes.func,
  onConfigurationChanged: PropTypes.func,
  classes: PropTypes.object.isRequired,
  imageSupport: PropTypes.object,
};

export default withDragContext(
  withStyles((theme) => ({
    promptHolder: {
      width: '100%',
      paddingTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
    },
    row: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridAutoColumns: '1fr',
      gridGap: '8px',
    },
    choicesWrapper: {
      marginTop: 0,
      marginBottom: theme.spacing.unit * 2.5,
    },
    tooltip: {
      fontSize: theme.typography.fontSize - 2,
      whiteSpace: 'pre',
      maxWidth: '500px',
    },
    inlineFlexContainer: {
      display: 'inline-flex',
      position: 'absolute',
    },
    errorText: {
      fontSize: theme.typography.fontSize - 2,
      color: theme.palette.error.main,
      paddingTop: theme.spacing.unit,
    },
  }))(Design),
);
