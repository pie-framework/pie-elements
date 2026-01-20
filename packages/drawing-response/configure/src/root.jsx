import React from 'react';
import { settings, layout, InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import EditableHtml from '@pie-lib/editable-html';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import ImageContainer from './image-container';
import cloneDeep from 'lodash/cloneDeep';

const { Panel, toggle, dropdown } = settings;

const PromptHolder = styled(InputContainer)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  width: '100%',
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(1),
}));

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
    const { configuration, imageSupport, model, onConfigurationChanged, onModelChanged, uploadSoundSupport } =
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
      extraCSSRules,
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
        extraCSSRules={extraCSSRules}
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
          <PromptHolder label={teacherInstructions.label}>
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
            {teacherInstructionsError && <ErrorText>{teacherInstructionsError}</ErrorText>}
          </PromptHolder>
        )}

        {promptEnabled && (
          <PromptHolder label="Item Stem">
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
            {promptError && <ErrorText>{promptError}</ErrorText>}
          </PromptHolder>
        )}

        {backgroundImageEnabled && (
          <React.Fragment>
            <Typography variant="h6">Define Background Image</Typography>

            <ImageContainer
              imageUrl={model.imageUrl}
              onUpdateImageDimension={this.onUpdateImageDimension}
              onImageUpload={this.onImageUpload}
              imageDimensions={model.imageDimensions}
              insertImage={imageSupport && imageSupport.add}
            />
          </React.Fragment>
        )}
      </layout.ConfigLayout>
    );
  }
}

Root.propTypes = {
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

export default Root;
