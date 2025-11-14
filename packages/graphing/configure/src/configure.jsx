import React from 'react';
import { styled } from '@mui/material/styles';

import { settings, layout, InputContainer } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import Typography from '@mui/material/Typography';
import EditableHtml from '@pie-lib/editable-html';
import GraphingConfig from './graphing-config';
import CorrectResponse from './correct-response';
import intersection from 'lodash/intersection';

const { Panel, toggle, radio, checkboxes, textField, dropdown } = settings;
const log = debug('@pie-element:graphing:configure');

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  display: 'block',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const StyledInputContainer = styled(InputContainer)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const Description = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(1),
}));

export class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func,
    imageSupport: PropTypes.object,
    uploadSoundSupport: PropTypes.object,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { configuration, onModelChanged, model } = this.props;
    const { availableTools, title, graphDimensions } = configuration || {};
    let { arrows, titleEnabled: showTitle, dimensionsEnabled: showDimensions } = model || {};

    // This is used for offering support for old models which have the property arrows: boolean
    // Same thing is set in the controller: packages/graphing/controller/src/index.js - model
    if (typeof arrows === 'boolean') {
      if (arrows) {
        arrows = { left: true, right: true, up: true, down: true };
      } else {
        arrows = { left: false, right: false, up: false, down: false };
      }
    }

    const toolbarTools = intersection(availableTools || [], model.toolbarTools || []);
    const titleEnabled = showTitle === undefined || showTitle === null ? title.enabled : showTitle;
    const dimensionsEnabled =
      showDimensions === undefined || showDimensions === null ? graphDimensions.enabled : showDimensions;

    onModelChanged && onModelChanged({ ...model, arrows, toolbarTools, titleEnabled, dimensionsEnabled });
  }

  onRationaleChange = (rationale) => {
    const { onModelChanged, model } = this.props;

    onModelChanged({ ...model, rationale });
  };

  onPromptChange = (prompt) => {
    const { onModelChanged, model } = this.props;

    onModelChanged({ ...model, prompt });
  };

  onTeacherInstructionsChange = (teacherInstructions) => {
    const { onModelChanged, model } = this.props;

    onModelChanged({ ...model, teacherInstructions });
  };

  render() {
    const { model, configuration, onConfigurationChanged, onModelChanged, imageSupport, uploadSoundSupport } =
      this.props;
    const {
      arrows = {},
      authoring = {},
      availableTools = [],
      baseInputConfiguration = {},
      coordinatesOnHover = {},
      contentDimensions = {},
      gridConfigurations = [],
      graphDimensions = {},
      instruction = {},
      labels = {},
      padding = {},
      prompt = {},
      rationale = {},
      scoringType = {},
      settingsPanelDisabled,
      spellCheck = {},
      studentInstructions = {},
      teacherInstructions = {},
      title = {},
      maxImageWidth = {},
      maxImageHeight = {},
      withRubric = {},
      language = {},
      languageChoices = {},
      mathMlOptions = {},
      removeIncompleteTool = false,
    } = configuration || {};
    const {
      errors = {},
      extraCSSRules,
      labelsEnabled,
      dimensionsEnabled,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      titleEnabled,
    } = model || {};
    const {
      prompt: promptError,
      rationale: rationaleError,
      teacherInstructions: teacherInstructionsError,
    } = errors || {};

    log('[render] model', model);

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;
    const labelsPlaceholders = {
      top: labels.top,
      right: labels.right,
      bottom: labels.bottom,
      left: labels.left,
    };

    const panelItemType = {
      arrows:
        arrows.settings &&
        checkboxes(arrows.label, {
          left: arrows.left,
          right: arrows.right,
          up: arrows.up,
          down: arrows.down,
        }),
      titleEnabled: title.settings && toggle(title.label),
      padding: padding.settings && toggle(padding.label),
      labelsEnabled: labels.settings && toggle(labels.label),
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
      dimensionsEnabled: graphDimensions.settings && toggle(graphDimensions.label),
      coordinatesOnHover: coordinatesOnHover.settings && toggle(coordinatesOnHover.label),
    };

    const panelProperties = {
      'authoring.enabled': authoring.settings && toggle(authoring.label, true),
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      studentInstructionsEnabled: studentInstructions.settings && toggle(studentInstructions.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      scoringType: scoringType.settings && radio(scoringType.label, ['dichotomous', 'partial scoring']),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
      instruction: instruction.settings && textField(instruction.label),
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
            onChangeModel={onModelChanged}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              Settings: panelItemType,
              Properties: panelProperties,
            }}
          />
        }
      >
        <Description component="div" variant="body1">
          {instruction?.label || ''}
        </Description>

        {teacherInstructionsEnabled && (
          <StyledInputContainer label={teacherInstructions.label}>
            <EditableHtml
              markup={model.teacherInstructions || ''}
              onChange={this.onTeacherInstructionsChange}
              imageSupport={imageSupport}
              error={teacherInstructionsError}
              nonEmpty={false}
              pluginProps={getPluginProps(teacherInstructions?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {teacherInstructionsError && <ErrorText>{teacherInstructionsError}</ErrorText>}
          </StyledInputContainer>
        )}

        {promptEnabled && (
          <StyledInputContainer label={prompt.label}>
            <EditableHtml
              markup={model.prompt}
              onChange={this.onPromptChange}
              imageSupport={imageSupport}
              error={promptError}
              nonEmpty={false}
              spellCheck={spellCheckEnabled}
              pluginProps={getPluginProps(prompt?.inputConfiguration)}
              disableUnderline
              maxImageWidth={defaultImageMaxWidth}
              maxImageHeight={defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {promptError && <ErrorText>{promptError}</ErrorText>}
          </StyledInputContainer>
        )}

        <GraphingConfig
          authoring={authoring}
          availableTools={availableTools}
          gridConfigurations={gridConfigurations}
          graphDimensions={graphDimensions}
          labelsPlaceholders={labelsPlaceholders}
          model={model}
          showLabels={labelsEnabled}
          dimensionsEnabled={dimensionsEnabled}
          showTitle={titleEnabled}
          titlePlaceholder={title.placeholder}
          onChange={this.props.onModelChanged}
          mathMlOptions={mathMlOptions}
          removeIncompleteTool={removeIncompleteTool}
        />

        <CorrectResponse
          availableTools={availableTools}
          errors={errors}
          model={model}
          onChange={this.props.onModelChanged}
          mathMlOptions={mathMlOptions}
          removeIncompleteTool={removeIncompleteTool}
        />

        {rationaleEnabled && (
          <StyledInputContainer label={rationale.label || 'Rationale'}>
            <EditableHtml
              markup={model.rationale || ''}
              onChange={this.onRationaleChange}
              imageSupport={imageSupport}
              error={rationaleError}
              spellCheck={spellCheckEnabled}
              pluginProps={getPluginProps(rationale?.inputConfiguration)}
              maxImageWidth={(maxImageWidth && maxImageWidth.rationale) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.rationale) || defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {rationaleError && <ErrorText>{rationaleError}</ErrorText>}
          </StyledInputContainer>
        )}
      </layout.ConfigLayout>
    );
  }
}

export default Configure;
