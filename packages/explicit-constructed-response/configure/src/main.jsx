import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import throttle from 'lodash/throttle';
import { EditableHtml, ALL_PLUGINS } from '@pie-lib/pie-toolbox/editable-html';
import { InputContainer, layout, settings } from '@pie-lib/pie-toolbox/config-ui';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

import ECRToolbar from './ecr-toolbar';
import AlternateResponses from './alternateResponses';
import { getAdjustedLength } from './markupUtils';
import { generateValidationMessage } from './utils';
import classnames from 'classnames';

const { toggle, Panel, dropdown } = settings;

const styles = (theme) => ({
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  markup: {
    minHeight: '100px',
    paddingTop: theme.spacing.unit,
    width: '100%',
    '& [data-slate-editor="true"]': {
      minHeight: '100px',
    },
  },
  choiceConfiguration: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  switchElement: {
    justifyContent: 'space-between',
    margin: 0,
  },
  addButton: {
    float: 'right',
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
  responseHeader: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit,
  },
});

const createElementFromHTML = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div;
};

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

  componentDidMount() {
    const {
      model: { slateMarkup, choices, maxLengthPerChoice = [] },
      onModelChanged,
    } = this.props;
    const undefinedLengths = !maxLengthPerChoice.length;

    this.setState({ markup: slateMarkup });

    // calculate maxLengthPerChoice array if it is not defined or defined incorrectly
    Object.values(choices).forEach((choice, index) => {
      const labelLengthsArr = (choice || []).map((choice) => (choice.label || '').length);
      const length = Math.max(...labelLengthsArr);

      if (
        undefinedLengths ||
        !maxLengthPerChoice[index] ||
        maxLengthPerChoice[index] < length ||
        maxLengthPerChoice[index] > length + 10
      ) {
        maxLengthPerChoice[index] = getAdjustedLength(length);
      }
    });

    onModelChanged({ ...this.props.model, maxLengthPerChoice });
  }

  onModelChange = (newVal) => {
    this.props.onModelChanged({ ...this.props.model, ...newVal });
  };

  onPromptChanged = (prompt) => {
    this.props.onModelChanged({ ...this.props.model, prompt });
  };

  onRationaleChanged = (rationale) => {
    this.props.onModelChanged({ ...this.props.model, rationale });
  };

  onTeacherInstructionsChanged = (teacherInstructions) => {
    const { model, onModelChanged } = this.props;

    onModelChanged({ ...model, teacherInstructions });
  };

  onMarkupChanged = (slateMarkup) => {
    this.props.onModelChanged({ ...this.props.model, slateMarkup });
  };

  onResponsesChanged = (choices) => {
    this.props.onModelChanged({ ...this.props.model, choices });
  };

  onLengthChanged = (maxLengthPerChoice) => {
    const { model, onModelChanged } = this.props;

    onModelChanged({ ...model, maxLengthPerChoice });
  };

  onChangeResponse = (index, newVal) => {
    const { model, onModelChanged } = this.props;
    const { choices } = model;
    let { maxLengthPerChoice } = model;
    const newValLength = (newVal || '').length;

    if (!choices[index]) {
      choices[index] = [{ label: newVal || '', value: '0' }];

      // add default values for missing choices up to the new index position
      const nbOfMissingChoices = index > maxLengthPerChoice.length ? index - maxLengthPerChoice.length : 0;

      maxLengthPerChoice = [...maxLengthPerChoice, ...Array(nbOfMissingChoices).fill(1)];

      maxLengthPerChoice.splice(index, 0, getAdjustedLength(newValLength));
    } else {
      choices[index][0].label = newVal || '';

      if (
        maxLengthPerChoice &&
        (maxLengthPerChoice[index] < newValLength || maxLengthPerChoice[index] > newValLength + 10)
      ) {
        maxLengthPerChoice[index] = getAdjustedLength(newValLength);
      }
    }

    onModelChanged({ ...model, choices, maxLengthPerChoice });
  };

  onChange = (markup) => {
    const {
      model: { choices, maxLengthPerChoice },
      onModelChanged,
    } = this.props;
    const domMarkup = createElementFromHTML(markup);
    const allRespAreas = domMarkup.querySelectorAll('[data-type="explicit_constructed_response"]');

    const allChoices = {};
    const updatedMaxLengthPerChoice = [];

    allRespAreas.forEach((el, index) => {
      const newChoices = cloneDeep(choices[el.dataset.index]);

      if (newChoices) {
        newChoices[0] = {
          label: el.dataset.value || '',
          value: '0',
        };

        updatedMaxLengthPerChoice[index] = maxLengthPerChoice[el.dataset.index];
      }

      allChoices[index] = newChoices;
      el.dataset.index = index;
    });

    const callback = () =>
      onModelChanged({
        ...this.props.model,
        choices: allChoices,
        slateMarkup: domMarkup.innerHTML,
        maxLengthPerChoice: updatedMaxLengthPerChoice,
      });

    this.setState({ cachedChoices: undefined }, callback);
  };

  onHandleAreaChange = throttle(
    (nodes) => {
      const {
        model: { choices },
        onModelChanged,
      } = this.props;
      const { cachedChoices } = this.state;

      if (!nodes) {
        return;
      }

      const newChoices = choices ? cloneDeep(choices) : {};
      const newCachedChoices = cachedChoices ? cloneDeep(cachedChoices) : {};

      nodes.forEach((node) => {
        const keyForNode = node.data.get('index');

        if (!newChoices[keyForNode] && newCachedChoices[keyForNode]) {
          Object.assign(newChoices, pick(newCachedChoices, keyForNode));

          if (newCachedChoices.hasOwnProperty(keyForNode)) {
            delete newCachedChoices[keyForNode];
          }
        } else {
          Object.assign(newCachedChoices, pick(newChoices, keyForNode));

          if (newChoices.hasOwnProperty(keyForNode)) {
            delete newChoices[keyForNode];
          }
        }
      });

      const callback = () => onModelChanged({ ...this.props.model, choices: newChoices });

      this.setState({ cachedChoices: newCachedChoices }, callback);
    },
    500,
    { trailing: false, leading: true },
  );

  render() {
    const { classes, model, configuration, onConfigurationChanged, imageSupport, uploadSoundSupport } = this.props;

    const {
      baseInputConfiguration = {},
      contentDimensions = {},
      maxImageWidth = {},
      maxImageHeight = {},
      maxLengthPerChoice = {},
      maxResponseAreas,
      partialScoring = {},
      playerSpellCheck = {},
      prompt = {},
      rationale = {},
      template = {},
      settingsPanelDisabled,
      spellCheck = {},
      editSource = {},
      teacherInstructions = {},
      withRubric = {},
      mathMlOptions = {},
      language = {},
      languageChoices = {},
      spanishButton = {},
      responseAreaInputConfiguration = {},
    } = configuration || {};
    const {
      errors,
      extraCSSRules,
      maxLengthPerChoiceEnabled,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      toolbarEditorPosition,
    } = model || {};

    const {
      choices: choicesErrors = {},
      prompt: promptError,
      rationale: rationaleError,
      responseAreas: responseAreasError,
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
      maxLengthPerChoiceEnabled: maxLengthPerChoice.settings && toggle(maxLengthPerChoice.label),
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
      'responseAreaInputConfiguration.inputConfiguration.characters.disabled': spanishButton.settings && toggle(spanishButton.label,true),
    };
    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      playerSpellCheckEnabled: playerSpellCheck.settings && toggle(playerSpellCheck.label),
      rubricEnabled: withRubric?.settings && toggle(withRubric?.label),
      'editSource.enabled': editSource?.settings && toggle(editSource.label, true),

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
              autoWidthToolbar
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
              autoWidthToolbar
            />
            {promptError && <div className={classes.errorText}>{promptError}</div>}
          </InputContainer>
        )}

        <div className={classes.flexContainer}>
          <Typography className={classes.text} component="div">
            Define Template, Choices, and Correct Responses
          </Typography>
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

        <EditableHtml
          activePlugins={ALL_PLUGINS}
          toolbarOpts={{ position: 'top' }}
          spellCheck={spellCheckEnabled}
          pluginProps={getPluginProps(template?.inputConfiguration)}
          responseAreaProps={{
            type: 'explicit-constructed-response',
            options: {
              duplicates: true,
            },
            maxResponseAreas: maxResponseAreas,
            respAreaToolbar: (node, value, onToolbarDone) => {
              const { model } = this.props;
              const correctChoice = (model.choices[node.data.get('index')] || [])[0];
              return () => (
                <ECRToolbar
                  onChangeResponse={(newVal) => this.onChangeResponse(node.data.get('index'), newVal)}
                  node={node}
                  value={value}
                  onToolbarDone={onToolbarDone}
                  correctChoice={correctChoice}
                  maxLengthPerChoiceEnabled={maxLengthPerChoiceEnabled}
                  pluginProps={getPluginProps(responseAreaInputConfiguration?.inputConfiguration)}
                />
              );
            },
            error: () => choicesErrors,
            onHandleAreaChange: this.onHandleAreaChange,
          }}
          className={classes.markup}
          markup={model.slateMarkup}
          onChange={this.onChange}
          imageSupport={imageSupport}
          disableImageAlignmentButtons={true}
          onBlur={this.onBlur}
          disabled={false}
          highlightShape={false}
          error={responseAreasError}
          uploadSoundSupport={uploadSoundSupport}
          languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
          mathMlOptions={mathMlOptions}
          autoWidthToolbar
        />
        {responseAreasError && <div className={classes.errorText}>{responseAreasError}</div>}

        {!isEmpty(model.choices) && (
          <Typography className={classnames(classes.text, classes.responseHeader)}>
            {`Define Alternates ${maxLengthPerChoiceEnabled ? 'and Character Limits' : ''}`}
          </Typography>
        )}
        <AlternateResponses
          model={model}
          onChange={this.onResponsesChanged}
          onLengthChange={this.onLengthChanged}
          maxLengthPerChoiceEnabled={maxLengthPerChoiceEnabled}
          spellCheck={spellCheckEnabled}
          choicesErrors={choicesErrors}
          pluginProps={getPluginProps(responseAreaInputConfiguration?.inputConfiguration)}
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
              autoWidthToolbar
            />
            {rationaleError && <div className={classes.errorText}>{rationaleError}</div>}
          </InputContainer>
        )}
      </layout.ConfigLayout>
    );
  }
}

const Styled = withStyles(styles)(Main);

export default Styled;
