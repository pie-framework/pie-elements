import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FeedbackConfig, settings, layout, InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import EditableHtml from '@pie-lib/editable-html';
import GeneralConfigBlock from './general-config-block';
import { ResponseTypes } from './utils';

const log = debug('@pie-element:math-inline:configure');
const { Panel, toggle, radio } = settings;

const styles = (theme) => ({
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

export class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func,
    classes: PropTypes.object,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    imageSupport: PropTypes.object,
    uploadSoundSupport: PropTypes.object,
  };

  onChange = (model) => {
    this.props.onModelChanged(model);
  };

  changeTeacherInstructions = (teacherInstructions) => {
    this.props.onModelChanged({
      ...this.props.model,
      teacherInstructions,
    });
  };

  onFeedbackChange = (feedback) => {
    const { model, onModelChanged } = this.props;
    model.feedback = feedback;
    onModelChanged(model);
  };

  render() {
    const { classes, model, imageSupport, onModelChanged, configuration, onConfigurationChanged, uploadSoundSupport } =
      this.props;
    const {
      allowTrailingZeros = {},
      feedback = {},
      ignoreOrder = {},
      maxImageWidth = {},
      maxImageHeight = {},
      prompt = {},
      rationale = {},
      responseType = {},
      scoringType = {},
      settingsPanelDisabled,
      spellCheck = {},
      studentInstructions = {},
      teacherInstructions = {},
      withRubric = {},
    } = configuration || {};
    const {
      feedbackEnabled,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      toolbarEditorPosition,
    } = model || {};

    log('[render] model', model);

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    const panelSettings = {
      responseType: responseType.settings && radio(responseType.label, [ResponseTypes.simple, ResponseTypes.advanced]),
      feedbackEnabled: feedback.settings && toggle(feedback.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
    };
    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      studentInstructionsEnabled: studentInstructions.settings && toggle(studentInstructions.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric']),
      'ignoreOrder.enabled': ignoreOrder.settings && toggle(ignoreOrder.label),
      'allowTrailingZeros.enabled': allowTrailingZeros.settings && toggle(allowTrailingZeros.label),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
    };

    return (
      <layout.ConfigLayout
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
              onChange={this.changeTeacherInstructions}
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

        <GeneralConfigBlock
          imageSupport={imageSupport}
          uploadSoundSupport={uploadSoundSupport}
          model={model}
          configuration={configuration}
          onChange={this.onChange}
          rationaleEnabled={rationaleEnabled}
          promptEnabled={promptEnabled}
          toolbarOpts={toolbarOpts}
          spellCheck={spellCheckEnabled}
        />

        {feedbackEnabled && (
          <FeedbackConfig feedback={model.feedback} onChange={this.onFeedbackChange} toolbarOpts={toolbarOpts} />
        )}
      </layout.ConfigLayout>
    );
  }
}

export default withStyles(styles)(Configure);
