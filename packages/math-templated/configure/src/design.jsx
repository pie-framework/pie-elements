import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import throttle from 'lodash/throttle';
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

import Response from './response';
import { processMarkup, createSlateMarkup } from './markupUtils';
import { generateValidationMessage } from './utils';

const { Panel, toggle } = settings;

const createElementFromHTML = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div;
};

export class Design extends React.Component {
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

  onResponseDone = () => {
    const { model, onModelChanged } = this.props;

    onModelChanged({
      ...model,
      slateMarkup: createSlateMarkup(model.markup, model.responses)
    });
  };

  onChangeResponse = (index, newVal) => {
    const { model, onModelChanged } = this.props;
    const { responses } = model;

    if (!responses[index]) {
      responses[index] = [{ answer: newVal || '', id: 'response' + index, allowSpaces: true }];
    } else {
      responses[index][0].answer = newVal || '';
    }

    onModelChanged({ ...model, responses });
  };

  onResponsesChanged = (responses) => {
    this.props.onModelChanged({ ...this.props.model, responses });
  };

  onChange = (markup) => {
    const {
      model: { responses, validationDefault, allowTrailingZerosDefault, ignoreOrderDefault },
      onModelChanged,
    } = this.props;
    const newResponses = {};
    const domMarkup = createElementFromHTML(markup);
    const responseAreas = domMarkup.querySelectorAll('[data-type="math_templated"]');

    responseAreas.forEach((element, index) => {
      const { value, index: dataIndex } = element.dataset;

      if (!value) {
        element.dataset.value = '';
      }

      newResponses[index] = responses[dataIndex] || {
        allowSpaces: true,
        validation: validationDefault || 'symbolic',
        allowTrailingZeros: allowTrailingZerosDefault || false,
        ignoreOrder: ignoreOrderDefault || false,
        answer: '',
        alternates: {},
      };

      element.dataset.index = index.toString();
    });

    console.log('newResponses', newResponses);

    const processedMarkup = processMarkup(markup);

    const callback = () =>
      onModelChanged({
        ...this.props.model,
        slateMarkup: domMarkup.innerHTML,
        responses: newResponses,
        markup: processedMarkup
      });

    this.setState({ cachedResponses: undefined }, callback);
  };

  onHandleAreaChange = throttle(
    (nodes) => {
      const {
        model: { responses },
        onModelChanged,
      } = this.props;
      const { cachedResponses } = this.state;

      if (!nodes) {
        return;
      }

      const newChoices = responses ? cloneDeep(responses) : {};
      const newCachedResponses = cachedResponses ? cloneDeep(cachedResponses) : {};

      nodes.forEach((node) => {
        const keyForNode = node.data.get('index');

        if (!newChoices[keyForNode] && newCachedResponses[keyForNode]) {
          Object.assign(newChoices, pick(newCachedResponses, keyForNode));

          if (newCachedResponses.hasOwnProperty(keyForNode)) {
            delete newCachedResponses[keyForNode];
          }
        } else {
          Object.assign(newCachedResponses, pick(newChoices, keyForNode));

          if (newChoices.hasOwnProperty(keyForNode)) {
            delete newChoices[keyForNode];
          }
        }
      });

      const callback = () => onModelChanged({ ...this.props.model, responses: newChoices });

      this.setState({ cachedResponses: newCachedResponses }, callback);
    },
    500,
    { trailing: false, leading: true },
  );

  onBlur = (e) => {
    const { relatedTarget, currentTarget } = e || {};

    function getParentWithRoleTooltip(element, depth = 0) {
      // only run this max 16 times
      if (!element || depth >= 16) return null;

      const parent = element.offsetParent;

      if (!parent) return null;

      if (parent.getAttribute('role') === 'tooltip') {
        return parent;
      }

      return getParentWithRoleTooltip(parent, depth + 1);
    }

    function getDeepChildDataKeypad(element, depth = 0) {
      // only run this max 4 times
      if (!element || depth >= 4) return null;

      const child = element?.children?.[0];

      if (!child) return null;

      if (child.attributes && child.attributes['data-keypad']) {
        return child;
      }

      return getDeepChildDataKeypad(child, depth + 1);
    }

    const parentWithTooltipRole = getParentWithRoleTooltip(relatedTarget);
    const childWithDataKeypad = parentWithTooltipRole ? getDeepChildDataKeypad(parentWithTooltipRole) : null;

    if (!relatedTarget || !currentTarget || !childWithDataKeypad?.attributes['data-keypad']) {
      this.setState({ activeAnswerBlock: '' });
    }
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
      editSource = {},
      ignoreOrder: cIgnoreOrder = {},
      allowTrailingZeros: cAllowTrailingZeros = {},
      partialScoring = {},
      maxResponseAreas,
    } = configuration || {};

    const {
      errors,
      extraCSSRules,
      promptEnabled,
      rationaleEnabled,
      spellCheckEnabled,
      teacherInstructionsEnabled,
      toolbarEditorPosition,
      responses,
      equationEditor,
    } = model || {};

    const {
      prompt: promptError,
      rationale: rationaleError,
      responseAreas: responseAreasError,
      teacherInstructions: teacherInstructionsError,
      responses: responsesErrors = {},
    } = errors || {};
    const validationMessage = generateValidationMessage(configuration);

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
      'editSource.enabled': editSource?.settings && toggle(editSource.label, true),
      partialScoring: partialScoring.settings && toggle(partialScoring.label),
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
        extraCSSRules={extraCSSRules}
        dimensions={contentDimensions}
        hideSettings={settingsPanelDisabled}
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={(updatedModel) => onModelChanged(updatedModel)}
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
        <div className={classes.tooltipContainer}>
          <Typography className={classes.title} component={'div'}>Response Template</Typography>
          <Tooltip
            classes={{ tooltip: classes.tooltip }}
            disableFocusListener
            disableTouchListener
            placement={'right'}
            title={validationMessage}
          >
            <Info fontSize={'small'} color={'primary'} />
          </Tooltip>
        </div>
        <EditableHtml
          activePlugins={ALL_PLUGINS}
          toolbarOpts={{ position: 'top' }}
          spellCheck={spellCheckEnabled}
          pluginProps={getPluginProps(
            template?.inputConfiguration,
            baseInputConfiguration
          )}
          responseAreaProps={{
            type: 'math-templated',
            respAreaToolbar: null,
            error: () => responsesErrors,
            onHandleAreaChange: this.onHandleAreaChange,
            maxResponseAreas: maxResponseAreas,
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
          languageCharactersProps={[
            { language: 'spanish' },
            { language: 'special' },
          ]}
          mathMlOptions={mathMlOptions}
        />
        {responseAreasError && (
          <div className={classes.responseAreaError}>{responseAreasError}</div>
        )}

        <Typography className={classes.title}>Define Response</Typography>

        <InputContainer
          label="Response Template Equation Editor"
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

        {Object.keys(responses || {}).map((responseKey, idx) => {
          const response = responses[idx];

          if (response) {
            return (
                <Response
                    key={idx}
                    responseKey={idx}
                    mode={equationEditor}
                    response={response}
                    onResponseChange={this.onResponseChange}
                    onResponseDone={this.onResponseDone}
                    index={idx}
                    cIgnoreOrder={cIgnoreOrder}
                    cAllowTrailingZeros={cAllowTrailingZeros}
                    error={responsesErrors && responsesErrors[idx]}
                />
            );
          }

          return null;
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
  responseAreaError: {
    color: theme.palette.error.main,
    fontSize: '0.75rem',
    marginBottom: theme.spacing.unit,
  },
  markup: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3,
  },
  selectContainer: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
  },
  select: {
    width: '100%',
  },
  title: {
    fontSize: theme.typography.fontSize * 1.25,
    fontWeight: 'bold',
  },
  tooltipContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tooltip: {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
}))(Design);
