import React from 'react';
import PropTypes from 'prop-types';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import { InputContainer, settings, layout } from '@pie-lib/pie-toolbox/config-ui';
import { withStyles } from '@material-ui/core/styles';
import MatrixColumnsSizeHeaderInput from './MatrixColumnsSizeHeaderInput';
import MatrixRowsSizeHeaderInput from './MatrixRowsSizeHeaderInput';
import MatrixLabelTypeHeaderInput from './MatrixLabelTypeHeaderInput';
import MatrixValues from './MatrixValues';

const { Panel, toggle, radio } = settings;

const styles = (theme) => ({
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  matrixHeaderOptionsHolder: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    paddingBottom: theme.spacing.unit * 2.5,
    justifyContent: 'space-around',
  },
});

const Design = withStyles(styles)((props) => {
  const {
    classes,
    model,
    configuration,
    onPromptChanged,
    imageSupport,
    uploadSoundSupport,
    onChangeModel,
    onConfigurationChanged,
    onTeacherInstructionsChanged,
  } = props;
  const {
    baseInputConfiguration = {},
    contentDimensions = {},
    prompt = {},
    scoringType = {},
    settingsPanelDisabled,
    spellCheck = {},
    teacherInstructions = {},
  } = configuration || {};
  const { teacherInstructionsEnabled, spellCheckEnabled } = model || {};

  const panelProperties = {
    teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
    spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
    scoringType: scoringType.settings && radio(scoringType.label, ['auto', 'rubric']),
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
      dimensions={contentDimensions}
      hideSettings={settingsPanelDisabled}
      settings={
        <Panel
          model={model}
          onChangeModel={onChangeModel}
          configuration={configuration}
          onChangeConfiguration={onConfigurationChanged}
          groups={{
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
            pluginProps={getPluginProps(teacherInstructions?.inputConfiguration)}
            nonEmpty={false}
            spellCheck={spellCheckEnabled}
            uploadSoundSupport={uploadSoundSupport}
          />
        </InputContainer>
      )}

      <InputContainer label={prompt.label} className={classes.promptHolder}>
        <EditableHtml
          className={classes.prompt}
          markup={model.prompt}
          onChange={onPromptChanged}
          imageSupport={imageSupport}
          pluginProps={getPluginProps(prompt?.inputConfiguration)}
          nonEmpty={!prompt.settings}
          spellCheck={spellCheckEnabled}
          uploadSoundSupport={uploadSoundSupport}
          disableUnderline
        />
      </InputContainer>

      <div className={classes.matrixHeaderOptionsHolder}>
        <MatrixRowsSizeHeaderInput model={model} onChangeModel={onChangeModel} />
        <MatrixColumnsSizeHeaderInput model={model} onChangeModel={onChangeModel} />
        <MatrixLabelTypeHeaderInput model={model} onChangeModel={onChangeModel} />
      </div>

      <MatrixValues model={model} onChangeModel={onChangeModel} />
    </layout.ConfigLayout>
  );
});

export class Main extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    disableSidePanel: PropTypes.bool,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
  };

  onPromptChanged = (prompt) => {
    this.props.onModelChanged({ ...this.props.model, prompt });
  };

  onChangeModel = (data) => {
    this.props.onModelChanged({ ...this.props.model, ...data });
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    this.props.onModelChanged({ ...this.props.model, teacherInstructions });
  };

  render() {
    return (
      <Design
        {...this.props}
        onChangeModel={this.props.onModelChanged}
        onPromptChanged={this.onPromptChanged}
        onTeacherInstructionsChanged={this.onTeacherInstructionsChanged}
      />
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;
