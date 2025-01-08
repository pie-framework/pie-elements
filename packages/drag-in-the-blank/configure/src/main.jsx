import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { EditableHtml, ALL_PLUGINS } from '@pie-lib/pie-toolbox/editable-html';
import { InputContainer, layout, settings } from '@pie-lib/pie-toolbox/config-ui';
import { withDragContext } from '@pie-lib/pie-toolbox/drag';
import { renderMath } from '@pie-lib/pie-toolbox/math-rendering';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

import Choices from './choices';
import { createSlateMarkup } from './markupUtils';
import { generateValidationMessage } from '../utils';

const { dropdown, toggle, Panel } = settings;

const styles = (theme) => ({
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  markup: {
    minHeight: '235px',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
    width: '100%',
    '& [data-slate-editor="true"]': {
      minHeight: '235px',
    },
  },
  choiceConfiguration: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  text: {
    fontSize: theme.typography.fontSize + 2,
  },
  tooltip: {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
  },
});

export class Main extends React.Component {
  static propTypes = {
    configuration: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    disableSidePanel: PropTypes.bool,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.object,
  };

  state = {};

  componentDidUpdate() {
    // eslint-disable-next-line
    const domNode = ReactDOM.findDOMNode(this);

    renderMath(domNode);
  }

  onModelChange = (newVal) => {
    this.props.onModelChanged({
      ...this.props.model,
      ...newVal,
    });
  };

  onPromptChanged = (prompt) => {
    this.props.onModelChanged({
      ...this.props.model,
      prompt,
    });
  };

  onRationaleChanged = (rationale) => {
    this.props.onModelChanged({
      ...this.props.model,
      rationale,
    });
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    this.props.onModelChanged({
      ...this.props.model,
      teacherInstructions,
    });
  };

  onMarkupChanged = (slateMarkup) => {
    this.props.onModelChanged({
      ...this.props.model,
      slateMarkup,
    });
  };

  onResponsesChanged = (choices) => {
    const {
      model: { correctResponse, markup },
    } = this.props;
    const slateMarkup = createSlateMarkup(markup, choices, correctResponse);

    this.props.onModelChanged({
      ...this.props.model,
      slateMarkup,
      choices,
    });
  };

  render() {
    const { classes, model, configuration, onConfigurationChanged, imageSupport, uploadSoundSupport } = this.props;
    const {
      addChoice = {},
      baseInputConfiguration = {},
      contentDimensions = {},
      duplicates = {},
      prompt = {},
      partialScoring = {},
      lockChoiceOrder = {},
      rationale = {},
      teacherInstructions = {},
      choicesPosition = {},
      spellCheck = {},
      settingsPanelDisabled,
      maxChoices,
      maxResponseAreas,
      maxImageWidth = {},
      maxImageHeight = {},
      withRubric = {},
      mathMlOptions = {},
      language = {},
      languageChoices = {},
      maxLength = {},
    } = configuration || {};
    const {
      rationaleEnabled,
      promptEnabled,
      teacherInstructionsEnabled,
      spellCheckEnabled,
      toolbarEditorPosition,
      errors,
      extraCSSRules,
    } = model || {};

    const {
      choicesError,
      correctResponseError,
      prompt: promptError,
      rationale: rationaleError,
      responseAreasError,
      teacherInstructions: teacherInstructionsError,
    } = errors || {};
    const validationMessage = generateValidationMessage(configuration);

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    const panelSettings = {
      partialScoring: partialScoring.settings && toggle(partialScoring.label),
      duplicates: duplicates.settings && toggle(duplicates.label),
      lockChoiceOrder: lockChoiceOrder.settings && toggle(lockChoiceOrder.label),
      choicesPosition: choicesPosition.settings && dropdown(choicesPosition.label, ['above', 'below', 'left', 'right']),
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
    };

    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
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
            onChangeModel={(model) => this.onModelChange(model)}
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
          <InputContainer label={prompt.label} className={classes.promptHolder}>
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={this.onPromptChanged}
              imageSupport={imageSupport}
              nonEmpty={false}
              disableUnderline
              error={promptError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(prompt?.inputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={defaultImageMaxWidth}
              maxImageHeight={defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {promptError && <div className={classes.errorText}>{promptError}</div>}
          </InputContainer>
        )}

        <div className={classes.flexContainer}>
          <Typography className={classes.text} component={'div'}>
            Define Template, Choices, and Correct Responses
          </Typography>
          <Tooltip
            classes={{ tooltip: classes.tooltip }}
            disableFocusListener
            disableTouchListener
            placement={'right'}
            title={validationMessage}
          >
            <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '5px' }} />
          </Tooltip>
        </div>

        <EditableHtml
          activePlugins={ALL_PLUGINS}
          responseAreaProps={{
            type: 'drag-in-the-blank',
            options: {
              duplicates: model.duplicates,
            },
            maxResponseAreas: maxResponseAreas,
          }}
          pluginProps={getPluginProps()}
          className={classes.markup}
          markup={model.slateMarkup}
          onChange={this.onMarkupChanged}
          imageSupport={imageSupport}
          disableImageAlignmentButtons={true}
          nonEmpty={false}
          disableUnderline
          error={responseAreasError || correctResponseError}
          toolbarOpts={toolbarOpts}
          spellCheck={spellCheckEnabled}
          uploadSoundSupport={uploadSoundSupport}
          languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
          mathMlOptions={mathMlOptions}
        />
        {responseAreasError && <div className={classes.errorText}>{responseAreasError}</div>}
        {correctResponseError && <div className={classes.errorText}>{correctResponseError}</div>}

        <Choices
          model={model}
          imageSupport={imageSupport}
          duplicates={model.duplicates}
          error={choicesError}
          onChange={this.onResponsesChanged}
          toolbarOpts={toolbarOpts}
          maxChoices={maxChoices}
          uploadSoundSupport={uploadSoundSupport}
          mathMlOptions={mathMlOptions}
          pluginProps={getPluginProps(addChoice?.inputConfiguration)}
          maxImageWidth={(maxImageWidth && maxImageWidth.choice) || defaultImageMaxWidth}
          maxImageHeight={(maxImageHeight && maxImageHeight.choice) || defaultImageMaxHeight}
          maxLength={maxLength}
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
      </layout.ConfigLayout>
    );
  }
}

const Styled = withStyles(styles)(Main);

export default withDragContext(Styled);
