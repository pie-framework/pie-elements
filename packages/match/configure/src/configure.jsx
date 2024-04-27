import { getPluginProps } from './utils';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FeedbackConfig, settings, layout, InputContainer, AlertDialog } from '@pie-lib/pie-toolbox/config-ui';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import { withDragContext } from '@pie-lib/pie-toolbox/drag';
import PropTypes from 'prop-types';
import debug from 'debug';
import GeneralConfigBlock from './general-config-block';
import AnswerConfigBlock from './answer-config-block';

const log = debug('@pie-element:match:configure');
const { Panel, toggle, radio, dropdown } = settings;

const styles = (theme) => ({
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
});

class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func,
    classes: PropTypes.object,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {
    classes: {},
  };

  constructor(props) {
    super(props);

    let maxId = 0;

    if (props.model.rows && props.model.rows.length > 0) {
      maxId = Math.max(...props.model.rows.map((row) => row.id));
    }

    this.rowIdCounter = maxId + 1;

    this.state = {
      activeTab: 0,
      dialog: {
        open: false,
        text: '',
      },
    };
  }

  componentDidMount() {
    const { updatedRows, wasChanged } = this.validateRowsID(this.props.model.rows);

    if (wasChanged) {
      const newModel = { ...this.props.model, rows: updatedRows };
      this.props.onModelChanged(newModel);
    }
  }

  validateRowsID(rows) {
    let wasChanged = false;

    const updatedRows = (rows || []).map((row, index) => {
      if (row.id !== index + 1) {
        wasChanged = true;

        return { ...row, id: index + 1 };
      }

      return row;
    });

    return { updatedRows, wasChanged };
  }

  onTabChange = (event, value) => {
    this.setState({ activeTab: value });
  };

  onChangeTabIndex = (index) => {
    this.setState({ activeTab: index });
  };

  onChange = (model) => {
    this.props.onModelChanged(model);
  };

  onFeedbackChange = (feedback) => {
    const { model, onModelChanged } = this.props;
    model.feedback = feedback;

    onModelChanged(model);
  };

  onDeleteRow = (rowIndex) => {
    const { model } = this.props;
    const newModel = { ...model };

    newModel.rows.splice(rowIndex, 1);

    this.onChange(newModel);
  };

  onAddRow = () => {
    const { model, configuration } = this.props;
    const newModel = { ...model };
    const { maxQuestions } = configuration || {};

    if (maxQuestions && (newModel.rows || []).length >= maxQuestions) {
      this.setState({
        dialog: {
          open: true,
          text: `There can be maximum ${maxQuestions} question row` + (maxQuestions > 1 ? 's' : '') + '.',
        },
      });
      return;
    }

    newModel.rows = newModel.rows.concat({
      id: this.rowIdCounter + 1,
      title: `Question Text ${(newModel.rows || []).length + 1}`,
      values: new Array(model.layout - 1).fill(false),
    });

    this.rowIdCounter += 1;

    this.onChange(newModel);
  };

  onLayoutChange = (newLayout) => {
    const { model } = this.props;
    const oldLayout = model.layout;
    const newModel = { ...model };

    if (newLayout > oldLayout) {
      for (let i = 0; i < newLayout - oldLayout; i++) {
        newModel.headers.push(`Column ${newModel.headers.length + 1}`);
      }

      newModel.rows.forEach((row) => {
        for (let i = 0; i < newLayout - oldLayout; i++) {
          row.values.push(false);
        }
      });
    } else if (newLayout < oldLayout) {
      newModel.headers.splice(newLayout);

      newModel.rows.forEach((row) => {
        row.values.splice(newLayout - 1);
      });
    }

    newModel.layout = newLayout;

    this.onChange(newModel);
  };

  onResponseTypeChange = (newChoiceMode) => {
    const { model } = this.props;
    const newModel = { ...model };

    // if we're switching to radio and we have more than one true, reset
    if (newChoiceMode === 'radio') {
      newModel.rows.forEach((row) => {
        const trueCount = row.values.reduce((total, current) => (current === true ? total + 1 : total));

        if (trueCount > 1) {
          row.values = new Array(model.layout - 1).fill(false);
        }
      });
    }

    newModel.choiceMode = newChoiceMode;

    this.onChange(newModel);
  };

  onPartialScoringChange = (partialScoring) => {
    this.props.model.partialScoring = partialScoring;

    this.props.onModelChanged(this.props.model);
  };

  onPromptChanged = (prompt) => {
    this.props.onModelChanged({ ...this.props.model, prompt });
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    this.props.onModelChanged({ ...this.props.model, teacherInstructions });
  };

  onRationaleChanged = (rationale) => {
    this.props.onModelChanged({ ...this.props.model, rationale });
  };

  render() {
    const { classes, model, imageSupport, onModelChanged, configuration, onConfigurationChanged, uploadSoundSupport } =
      this.props;
    const {
      baseInputConfiguration = {},
      contentDimensions = {},
      enableImages = {},
      feedback = {},
      lockChoiceOrder = {},
      maxImageWidth = {},
      maxImageHeight = {},
      partialScoring = {},
      prompt = {},
      rationale = {},
      settingsPanelDisabled,
      scoringType = {},
      spellCheck = {},
      studentInstructions = {},
      teacherInstructions = {},
      withRubric = {},
      language = {},
      languageChoices = {},
    } = configuration || {};
    const {
      errors,
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
    const { dialog } = this.state;

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    const panelSettings = {
      enableImages: enableImages.settings && toggle(enableImages.label),
      partialScoring: partialScoring.settings && toggle(partialScoring.label),
      lockChoiceOrder: lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
      feedbackEnabled: feedback.settings && toggle(feedback.label),
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

    log('[render] model', model);

    return (
      <layout.ConfigLayout
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
          <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.teacherInstructions || ''}
              onChange={this.onTeacherInstructionsChanged}
              imageSupport={imageSupport}
              error={teacherInstructionsError}
              nonEmpty={false}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(teacherInstructions?.inputConfiguration, baseInputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            />
            {teacherInstructionsError && <div className={classes.errorText}>{teacherInstructionsError}</div>}
          </InputContainer>
        )}

        {promptEnabled && (
          <InputContainer label={prompt.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={this.onPromptChanged}
              imageSupport={imageSupport}
              error={promptError}
              nonEmpty={false}
              disableUnderline
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(prompt?.inputConfiguration, baseInputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={maxImageWidth && maxImageWidth.prompt}
              maxImageHeight={maxImageHeight && maxImageHeight.prompt}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            />
            {promptError && <div className={classes.errorText}>{promptError}</div>}
          </InputContainer>
        )}

        <GeneralConfigBlock
          model={model}
          configuration={configuration}
          onResponseTypeChange={this.onResponseTypeChange}
          onLayoutChange={this.onLayoutChange}
        />

        <AnswerConfigBlock
          model={model}
          configuration={configuration}
          imageSupport={imageSupport}
          onChange={this.onChange}
          onAddRow={this.onAddRow}
          onDeleteRow={this.onDeleteRow}
          toolbarOpts={toolbarOpts}
          spellCheck={spellCheckEnabled}
          uploadSoundSupport={uploadSoundSupport}
        />

        {rationaleEnabled && (
          <InputContainer label={rationale.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.rationale || ''}
              onChange={this.onRationaleChanged}
              imageSupport={imageSupport}
              error={rationaleError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(rationale?.inputConfiguration, baseInputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
            />
            {rationaleError && <div className={classes.errorText}>{rationaleError}</div>}
          </InputContainer>
        )}

        {feedbackEnabled && (
          <FeedbackConfig feedback={model.feedback} onChange={this.onFeedbackChange} toolbarOpts={toolbarOpts} />
        )}
        <AlertDialog
          open={dialog.open}
          title="Warning"
          text={dialog.text}
          onConfirm={() => this.setState({ dialog: { open: false } })}
        />
      </layout.ConfigLayout>
    );
  }
}

export const Config = Configure;

export default withDragContext(withStyles(styles)(Configure));
