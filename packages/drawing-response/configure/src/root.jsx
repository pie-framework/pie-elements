import React from 'react';
import { settings, layout, InputContainer } from '@pie-lib/pie-toolbox/config-ui';
import PropTypes from 'prop-types';
import { EditableHtml } from '@pie-lib/pie-toolbox/editable-html';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import ImageContainer from './image-container';
import cloneDeep from 'lodash/cloneDeep';

const { Panel, toggle, dropdown } = settings;

export class Root extends React.Component {
  onPromptChanged = (prompt) => {
    const { model, onModelChanged } = this.props;
    const update = cloneDeep(model);

    onModelChanged({ ...update, prompt });
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    const { model, onModelChanged } = this.props;

    onModelChanged({ ...model, teacherInstructions });
  };

  onUpdateImageDimension = (dimensions) => {
    const { model, onModelChanged } = this.props;

    onModelChanged({ ...model, imageDimensions: dimensions });
  };

  onImageUpload = (imageUrl) => {
    const { model, onModelChanged } = this.props;

    onModelChanged({ ...model, imageUrl });
  };

  render() {
    const { classes, configuration, imageSupport, model, onConfigurationChanged, onModelChanged, uploadSoundSupport } =
      this.props;
    const {
      baseInputConfiguration = {},
      backgroundImage = {},
      contentDimensions = {},
      maxImageWidth = {},
      maxImageHeight = {},
      prompt = {},
      settingsPanelDisabled,
      spellCheck = {},
      teacherInstructions = {},
      withRubric = {},
      language = {},
      languageChoices = {},
      mathMlOptions = {},
    } = configuration || {};
    const {
      backgroundImageEnabled,
      errors = {},
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
      backgroundImageEnabled: backgroundImage.settings && toggle(backgroundImage.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
    };

    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
    };

    const getPluginProps = (props = {}) => ({
      ...baseInputConfiguration,
      ...props,
    });

    return (
      <layout.ConfigLayout
        dimensions={contentDimensions}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            onChangeModel={onModelChanged}
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
              markup={model.teacherInstructions || ''}
              onChange={this.onTeacherInstructionsChanged}
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
          <InputContainer label="Item Stem" className={classes.promptHolder}>
            <EditableHtml
              markup={model.prompt}
              onChange={this.onPromptChanged}
              error={promptError}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              pluginProps={getPluginProps(prompt?.inputConfiguration)}
              imageSupport={imageSupport}
              maxImageWidth={defaultImageMaxWidth}
              maxImageHeight={defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {promptError && <div className={classes.errorText}>{promptError}</div>}
          </InputContainer>
        )}

        {backgroundImageEnabled && (
          <React.Fragment>
            <Typography variant="subheading">Define Background Image</Typography>

            <ImageContainer
              imageUrl={model.imageUrl}
              onUpdateImageDimension={this.onUpdateImageDimension}
              onImageUpload={this.onImageUpload}
              imageDimensions={model.imageDimensions}
            />
          </React.Fragment>
        )}
      </layout.ConfigLayout>
    );
  }
}

const styles = (theme) => ({
  promptHolder: {
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
});

Root.propTypes = {
  classes: PropTypes.object.isRequired,
  configuration: PropTypes.object,
  model: PropTypes.object.isRequired,
  imageSupport: PropTypes.shape({
    add: PropTypes.func,
    delete: PropTypes.func,
  }),
  uploadSoundSupport: PropTypes.shape({
    add: PropTypes.func,
    delete: PropTypes.func,
  }),
  onModelChanged: PropTypes.func.isRequired,
  onConfigurationChanged: PropTypes.func.isRequired,
};

export default withStyles(styles)(Root);
