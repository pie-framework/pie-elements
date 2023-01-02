import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FeedbackConfig, settings, layout, InputContainer } from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';
import { withDragContext } from '@pie-lib/drag';
import PropTypes from 'prop-types';
import debug from 'debug';
import GeneralConfigBlock from './general-config-block';
import AnswerConfigBlock from './answer-config-block';

const log = debug('@pie-element:match:configure');
const { Panel, toggle, radio } = settings;

const styles = (theme) => ({
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  content: {
    marginTop: theme.spacing.unit * 2,
  },
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%',
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

    this.rowIdCounter = props.model.rows[props.model.rows.length - 1].id + 1;

    this.state = {
      activeTab: 0,
    };
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
    const { model } = this.props;
    const newModel = { ...model };

    newModel.rows = newModel.rows.concat({
      id: this.rowIdCounter + 1,
      title: `Question Text ${newModel.rows.length + 1}`,
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

  onRationaleChanged = (rationale) => {
    this.props.onModelChanged({
      ...this.props.model,
      rationale,
    });
  };

  render() {
    const { classes, model, imageSupport, onModelChanged, configuration, onConfigurationChanged, uploadSoundSupport } =
      this.props;
    const {
      enableImages = {},
      partialScoring = {},
      teacherInstructions = {},
      studentInstructions = {},
      rationale = {},
      lockChoiceOrder = {},
      scoringType = {},
      prompt = {},
      feedback = {},
      spellCheck = {},
      maxImageWidth = {},
      maxImageHeight = {},
      withRubric = {},
    } = configuration || {};
    const {
      teacherInstructionsEnabled,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      feedbackEnabled,
      rubricEnabled,
    } = model || {};

    const toolbarOpts = {};

    switch (model.toolbarEditorPosition) {
      case 'top':
        toolbarOpts.position = 'top';
        break;
      default:
        toolbarOpts.position = 'bottom';
        break;
    }

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    log('[render] model', model);

    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={(model) => onModelChanged(model)}
            onChangeConfiguration={(config) => onConfigurationChanged(config)}
            groups={{
              Settings: {
                enableImages: enableImages.settings && toggle(enableImages.label),
                partialScoring: partialScoring.settings && toggle(partialScoring.label),
                lockChoiceOrder: lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
                feedbackEnabled: feedback.settings && toggle(feedback.label),
              },
              Properties: {
                teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
                studentInstructionsEnabled: studentInstructions.settings && toggle(studentInstructions.label),
                promptEnabled: prompt.settings && toggle(prompt.label),
                rationaleEnabled: rationale.settings && toggle(rationale.label),
                spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
                scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric']),
                rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
              },
            }}
          />
        }
      >
        <div className={classes.content}>
          {teacherInstructionsEnabled && (
            <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
              <EditableHtml
                className={classes.prompt}
                markup={model.teacherInstructions || ''}
                onChange={this.onTeacherInstructionsChanged}
                imageSupport={imageSupport}
                nonEmpty={false}
                toolbarOpts={toolbarOpts}
                spellCheck={spellCheckEnabled}
                maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
                maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
                uploadSoundSupport={uploadSoundSupport}
                languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              />
            </InputContainer>
          )}

          {promptEnabled && (
            <InputContainer label={prompt.label} className={classes.promptHolder}>
              <EditableHtml
                className={classes.prompt}
                markup={model.prompt}
                onChange={this.onPromptChanged}
                imageSupport={imageSupport}
                nonEmpty={false}
                disableUnderline
                toolbarOpts={toolbarOpts}
                spellCheck={spellCheckEnabled}
                maxImageWidth={maxImageWidth && maxImageWidth.prompt}
                maxImageHeight={maxImageHeight && maxImageHeight.prompt}
                uploadSoundSupport={uploadSoundSupport}
                languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              />
            </InputContainer>
          )}

          {rationaleEnabled && (
            <InputContainer label={rationale.label} className={classes.promptHolder}>
              <EditableHtml
                className={classes.prompt}
                markup={model.rationale || ''}
                onChange={this.onRationaleChanged}
                imageSupport={imageSupport}
                toolbarOpts={toolbarOpts}
                spellCheck={spellCheckEnabled}
                maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
                maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
                uploadSoundSupport={uploadSoundSupport}
                languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              />
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
          {feedbackEnabled && (
            <FeedbackConfig feedback={model.feedback} onChange={this.onFeedbackChange} toolbarOpts={toolbarOpts} />
          )}
        </div>
      </layout.ConfigLayout>
    );
  }
}

export const Config = Configure;

export default withDragContext(withStyles(styles)(Configure));
