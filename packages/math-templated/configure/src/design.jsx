import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash/cloneDeep';
import {
  InputContainer,
  settings,
  layout,
} from '@pie-lib/pie-toolbox/config-ui';
import {
  ALL_PLUGINS,
  EditableHtml,
} from '@pie-lib/pie-toolbox/editable-html';
import { dropdown } from '@pie-lib/pie-toolbox/code/config-ui/settings';
import Typography from '@material-ui/core/Typography';
import MathTemplatedToolbar from './math-templated-toolbar';
import Response from '@pie-element/math-inline-configure/src/response';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const { Panel, toggle } = settings;

const createElementFromHTML = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div;
};

class Design extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.object,
  };

  state = {};

  componentDidMount() {
    const { model: { slateMarkup } } = this.props;

    this.setState({ markup: slateMarkup });

  }

  handleChange = (key, value) => {
    const { onModelChanged, model } = this.props;
    const updatedModel = cloneDeep(model);
    updatedModel[key] = value;
    onModelChanged(updatedModel);
  };

  onResponseChange = (response, index) => {
    const { model, onModelChanged } = this.props;
    const newModel = { ...model };

    newModel.responses[index] = response;
    onModelChanged(newModel);
  };

  onChangeResponse = (index, newVal) => {
    const { model, onModelChanged } = this.props;
    const { reponses } = model;

    if (!reponses[index]) {
      reponses[index] = [{ answer: newVal || '', id: '0', allowSpaces: true }];
    } else {
      reponses[index][0].answer = newVal || '';
    }

    onModelChanged({ ...model, reponses });
  };

  onResponsesChanged = (choices) => {
    this.props.onModelChanged({ ...this.props.model, choices });
  };

  onChange = (markup) => {
    const {
      model: { responses },
      onModelChanged,
    } = this.props;
    const domMarkup = createElementFromHTML(markup);
    const allRespAreas = domMarkup.querySelectorAll('[data-type="explicit_constructed_response"]');

    const allResponses = {};

    allRespAreas.forEach((el, index) => {
      const newResponses = cloneDeep(responses[el.dataset.index]);

      if (newResponses) {
        newResponses[0] = {
          answer: el.dataset.value || '',
          allowSpaces: true
        };
      }

      allResponses[index] = newResponses;
      el.dataset.index = index;
    });

    const callback = () =>
      onModelChanged({
        ...this.props.model,
        responses: allResponses,
        slateMarkup: domMarkup.innerHTML,
      });

    this.setState({ cachedChoices: undefined }, callback);
  };

  render() {
    const {
      classes,
      configuration,
      imageSupport,
      model,
      onConfigurationChanged,
      onModelChanged,
      uploadSoundSupport,
    } = this.props;

    const {
      baseInputConfiguration = {},
      contentDimensions = {},
      prompt = {},
      rationale = {},
      settingsPanelDisabled,
      teacherInstructions = {},
      language = {},
      languageChoices = {},
      spellCheck = {},
      playerSpellCheck = {},
      maxImageWidth = {},
      maxImageHeight = {},
      mathMlOptions = {},
      template = {},
    } = configuration || {};

    const {
      errors,
      maxLengthPerChoiceEnabled,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      toolbarEditorPosition,
      responses,
      equationEditor,
    } = model || {};

    const {
      choices: choicesErrors = {},
      prompt: promptError,
      rationale: rationaleError,
      responseAreas: responseAreasError,
      teacherInstructions: teacherInstructionsError,
      responses: responsesErrors,
    } = errors || {};

    const panelSettings = {
      'language.enabled': language.settings && toggle(language.label, true),
      language: language.settings && language.enabled && dropdown(languageChoices.label, languageChoices.options),
    };

    const panelProperties = {
      teacherInstructionsEnabled: teacherInstructions.settings && toggle(teacherInstructions.label),
      rationaleEnabled: rationale.settings && toggle(rationale.label),
      promptEnabled: prompt.settings && toggle(prompt.label),
      spellCheckEnabled: spellCheck.settings && toggle(spellCheck.label),
      playerSpellCheckEnabled: playerSpellCheck.settings && toggle(playerSpellCheck.label),
    };

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    const toolbarOpts = {
      position: toolbarEditorPosition === 'top' ? 'top' : 'bottom',
    };

    const getPluginProps = (props = {}, baseInputConfiguration = {}) => ({
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
            configuration={configuration}
            onChangeModel={onModelChanged}
            onChangeConfiguration={onConfigurationChanged}
            groups={{
              Settings: panelSettings,
              Properties: panelProperties,
            }}
          />
        }
      >
        {teacherInstructionsEnabled && (
          <InputContainer
            label={teacherInstructions.label}
            className={classes.promptHolder}
          >
            <EditableHtml
              className={classes.prompt}
              markup={model.teacherInstructions || ''}
              onChange={(value) => this.handleChange('teacherInstructions', value)}
              imageSupport={imageSupport}
              nonEmpty={false}
              error={teacherInstructionsError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(
                teacherInstructions?.inputConfiguration,
                baseInputConfiguration
              )}
              spellCheck={spellCheckEnabled}
              maxImageWidth={
                (maxImageWidth && maxImageWidth.teacherInstructions) ||
                defaultImageMaxWidth
              }
              maxImageHeight={
                (maxImageHeight && maxImageHeight.teacherInstructions) ||
                defaultImageMaxHeight
              }
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[
                { language: 'spanish' },
                { language: 'special' },
              ]}
              mathMlOptions={mathMlOptions}
            />
            {teacherInstructionsError && (
              <div className={classes.errorText}>{teacherInstructionsError}</div>
            )}
          </InputContainer>
        )}

        {promptEnabled && (
          <InputContainer
            label={prompt.label}
            className={classes.promptHolder}
          >
            <EditableHtml
              className={classes.prompt}
              markup={model.prompt}
              onChange={(value) => this.handleChange('prompt', value)}
              imageSupport={imageSupport}
              nonEmpty={false}
              disableUnderline
              error={promptError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(
                teacherInstructions?.inputConfiguration,
                baseInputConfiguration
              )}
              spellCheck={spellCheckEnabled}
              maxImageWidth={defaultImageMaxWidth}
              maxImageHeight={defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[
                { language: 'spanish' },
                { language: 'special' },
              ]}
              mathMlOptions={mathMlOptions}
            />
            {promptError && (
              <div className={classes.errorText}>{promptError}</div>
            )}
          </InputContainer>
        )}

        <Typography>Define Template</Typography>

        <EditableHtml
          activePlugins={ALL_PLUGINS}
          toolbarOpts={{ position: 'top' }}
          spellCheck={spellCheckEnabled}
          pluginProps={getPluginProps(
            template?.inputConfiguration,
            baseInputConfiguration
          )}
          responseAreaProps={{
            type: 'explicit-constructed-response',
            options: {
              duplicates: true,
            },
            respAreaToolbar: (node, value, onToolbarDone) => {
              const { model } = this.props;
              const correctChoice = (model.responses[node.data.get('index')] || [])[0];

              return () => (
                <MathTemplatedToolbar
                  onChangeResponse={() => {}}
                  node={node}
                  value={value}
                  onToolbarDone={onToolbarDone}
                  correctChoice={correctChoice}
                  maxLengthPerChoiceEnabled={maxLengthPerChoiceEnabled}
                />
              );
            },
            error: () => choicesErrors,
            onHandleAreaChange: () => {
            },
          }}
          className={classes.markup}
          markup={model.slateMarkup}
          onChange={() => {}}
          imageSupport={imageSupport}
          disableImageAlignmentButtons={true}
          onBlur={this.onBlur}
          disabled={false}
          highlightShape={false}
          error={responseAreasError}
          uploadSoundSupport={uploadSoundSupport}
          languageCharactersProps={[
            { language: 'spanish' },
            { language: 'special' },
          ]}
          mathMlOptions={mathMlOptions}
        />

        <div
          className={classes.flexContainer}
          style={{ justifyContent: 'flex-start' }}
        >
          <Typography>Define Correct Responses</Typography>
        </div>

        <InputContainer
          label="Equation Editor"
          className={classes.selectContainer}
        >
          <Select
            className={classes.select}
            onChange={(event) =>
              this.handleChange('equationEditor', event.target.value)
            }
            value={equationEditor}
          >
            <MenuItem value="non-negative-integers">
              Numeric - Non-Negative Integers
            </MenuItem>
            <MenuItem value="integers">Numeric - Integers</MenuItem>
            <MenuItem value="decimals">Numeric - Decimals</MenuItem>
            <MenuItem value="fractions">Numeric - Fractions</MenuItem>
            <MenuItem value={1}>Grade 1 - 2</MenuItem>
            <MenuItem value={3}>Grade 3 - 5</MenuItem>
            <MenuItem value={6}>Grade 6 - 7</MenuItem>
            <MenuItem value={8}>Grade 8 - HS</MenuItem>
            <MenuItem value={'geometry'}>Geometry</MenuItem>
            <MenuItem value={'advanced-algebra'}>
              Advanced Algebra
            </MenuItem>
            <MenuItem value={'statistics'}>Statistics</MenuItem>
            <MenuItem value={'item-authoring'}>Item Authoring</MenuItem>
          </Select>
        </InputContainer>

        {Object.values(responses).map((responseArray, idx) => {
          if (!responseArray || responseArray.length === 0) {
            return null;
          }

          const primaryResponse = responseArray.length ? responseArray[0] : responseArray;

          return (
            <Response
              key={primaryResponse.id}
              mode={equationEditor}
              response={primaryResponse}
              defaultResponse={true}
              onResponseChange={this.onResponseChange}
              index={idx}
              cIgnoreOrder={true}
              cAllowTrailingZeros={true}
              error={responsesErrors && responsesErrors[idx]}
            />
          );
        })}

        {rationaleEnabled && (
          <InputContainer
            label={rationale.label}
            className={classes.promptHolder}
          >
            <EditableHtml
              className={classes.prompt}
              markup={model.rationale || ''}
              onChange={(value) => this.handleChange('rationale', value)}
              imageSupport={imageSupport}
              nonEmpty={false}
              error={rationaleError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(rationale?.inputConfiguration, {
                ...baseInputConfiguration,
                math: {
                  controlledKeypadMode: false,
                },
              })}
              spellCheck={spellCheckEnabled}
              maxImageWidth={
                (maxImageWidth && maxImageWidth.rationale) ||
                defaultImageMaxWidth
              }
              maxImageHeight={
                (maxImageHeight && maxImageHeight.rationale) ||
                defaultImageMaxHeight
              }
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[
                { language: 'spanish' },
                { language: 'special' },
              ]}
              mathMlOptions={mathMlOptions}
            />
            {rationaleError && (
              <div className={classes.errorText}>{rationaleError}</div>
            )}
          </InputContainer>
        )}
      </layout.ConfigLayout>
    );
  }
}

export default withStyles((theme) => ({
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  prompt: {
    width: '100%',
  },
  errorText: {
    color: theme.palette.error.main,
    fontSize: '0.75rem',
    marginTop: theme.spacing.unit,
  },
  markup: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  flexContainer: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing.unit * 2,
  },
  selectContainer: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
  },
  select: {
    width: '100%',
  },
}))(Design);
