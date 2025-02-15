import React from 'react';
import { FeedbackSelector, InputContainer, settings, layout } from '@pie-lib/pie-toolbox/config-ui';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { EditableHtml, ALL_PLUGINS } from '@pie-lib/pie-toolbox/editable-html';

const { Panel, toggle, numberFields, dropdown } = settings;

const defaultFeedback = {
  type: 'default',
  default: 'Your answer has been submitted',
};

export class Main extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    imageSupport: PropTypes.object.isRequired,
    uploadSoundSupport: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { setDimensions: true };
  }

  onPromptChange = (markup) => {
    const { onModelChanged, model } = this.props;

    onModelChanged({ ...model, prompt: markup });
  };

  changeFeedback = (feedback) => {
    const { model, onModelChanged } = this.props;
    const update = { ...model, feedback };

    onModelChanged(update);
  };

  changeTeacherInstructions = (teacherInstructions) => {
    const { model, onModelChanged } = this.props;
    const update = { ...model, teacherInstructions };

    onModelChanged(update);
  };

  render() {
    const { model, classes, configuration, imageSupport, onConfigurationChanged, onModelChanged, uploadSoundSupport } =
      this.props;
    const {
      annotations= {},
      contentDimensions = {},
      dimensions = {},
      equationEditor = {},
      feedback = {},
      playerSpellCheck = {},
      prompt = {},
      settingsPanelDisabled,
      spanishInput = {},
      specialInput = {},
      spellCheck = {},
      studentInstructions = {},
      teacherInstructions = {},
      mathInput = {},
      maxImageWidth = {},
      maxImageHeight = {},
      multiple = {},
      withRubric = {},
      mathMlOptions = {},
      baseInputConfiguration = {},
    } = configuration || {};
    const {
      errors = {},
      extraCSSRules,
      feedbackEnabled,
      promptEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      toolbarEditorPosition,
    } = model || {};
    const { prompt: promptError, teacherInstructions: teacherInstructionsError } = errors;

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    const panelSettings = {
      mathInput: mathInput.settings && toggle(mathInput.label),
      equationEditor:
        equationEditor.enabled &&
        model.mathInput &&
        dropdown(equationEditor.label, [
          'non-negative-integers',
          'integers',
          'decimals',
          'fractions',
          'Grade 1 - 2',
          'Grade 3 - 5',
          'Grade 6 - 7',
          'Grade 8 - HS',
          'geometry',
          'advanced-algebra',
          'statistics',
          'item-authoring',
        ]),
      spanishInput: spanishInput.settings && toggle(spanishInput.label),
      specialInput: specialInput.settings && toggle(specialInput.label),
      dimensions: dimensions.settings && numberFields(dimensions.label, {
        width: { label: 'Width (px)', suffix: 'px', min: 100, max: 1200 },
        height: { label: 'Height (px)', suffix: 'px', min: 100, max: 500 },
      }),
      'multiple.enabled': multiple.settings && toggle(multiple.label, true),
      promptEnabled: prompt.settings && toggle(prompt.label),
      feedbackEnabled: feedback.settings && toggle(feedback.label),
      annotationsEnabled: annotations.settings && toggle(annotations.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      playerSpellCheckDisabled: playerSpellCheck.settings && toggle(playerSpellCheck.label),
    };
    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      studentInstructionsEnabled: studentInstructions.settings && toggle(studentInstructions.label),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
    };

    const getPluginProps = (props) => {
      return Object.assign(
          {
            ...baseInputConfiguration,
          },
          props || {},
      );
    };

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
            onChangeConfiguration={(config) => onConfigurationChanged(config)}
            groups={{
              Settings: panelSettings,
              Properties: panelProperties,
            }}
          />
        }
      >
        {teacherInstructionsEnabled && (
          <InputContainer label={teacherInstructions.label} className={classes.promptContainer}>
            <EditableHtml
              className={classes.prompt}
              markup={model.teacherInstructions || ''}
              onChange={this.changeTeacherInstructions}
              imageSupport={imageSupport}
              nonEmpty={false}
              error={teacherInstructionsError}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
              pluginProps={getPluginProps(teacherInstructions?.inputConfiguration)}
            />
            {teacherInstructionsError && <div className={classes.errorText}>{teacherInstructionsError}</div>}
          </InputContainer>
        )}

        {promptEnabled && (
          <InputContainer label={prompt.label} className={classes.promptContainer}>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              className={classes.prompt}
              markup={model.prompt || ''}
              onChange={this.onPromptChange}
              imageSupport={imageSupport}
              nonEmpty={false}
              error={promptError}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              maxImageWidth={defaultImageMaxWidth}
              maxImageHeight={defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
              pluginProps={getPluginProps(prompt?.inputConfiguration)}
            />
            {promptError && <div className={classes.errorText}>{promptError}</div>}
          </InputContainer>
        )}

        {feedbackEnabled && (
          <React.Fragment>
            <Typography className={classes.header} variant="subheading">
              Feedback
            </Typography>

            <FeedbackSelector
              label="When submitted, show"
              feedback={model.feedback || defaultFeedback}
              onChange={this.changeFeedback}
              toolbarOpts={toolbarOpts}
            />
          </React.Fragment>
        )}
      </layout.ConfigLayout>
    );
  }
}
export default withStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.unit,
  },
  promptContainer: {
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
}))(Main);
