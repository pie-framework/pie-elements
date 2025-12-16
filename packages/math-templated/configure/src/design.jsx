import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Info from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import throttle from 'lodash/throttle';
import { InputContainer, settings, layout } from '@pie-lib/config-ui';
import EditableHtml, { ALL_PLUGINS } from '@pie-lib/editable-html';
const { dropdown } = settings;

import Response from './response';
import { processMarkup, createSlateMarkup } from './markupUtils';
import { generateValidationMessage } from './utils';

const { Panel, toggle } = settings;

const StyledInputContainer = styled(InputContainer)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledEditableHtml = styled(EditableHtml)({
  width: '100%',
});

const ErrorText = styled('div')(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.75rem',
  marginTop: theme.spacing(1),
}));

const ResponseAreaError = styled('div')(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.75rem',
  marginBottom: theme.spacing(1),
}));

const StyledMarkup = styled(EditableHtml)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const StyledSelectContainer = styled(InputContainer)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
  '& > *:not(label)': {
    marginTop: theme.spacing(1),
  },
  marginBottom: theme.spacing(2),
}));

const StyledSelect = styled(Select)({
  width: '100%',
});

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.fontSize * 1.25,
  fontWeight: 'bold',
}));

const TooltipContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
}));

const createElementFromHTML = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div;
};

export class Design extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
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
    const {
      model: { slateMarkup },
    } = this.props;

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
      slateMarkup: createSlateMarkup(model.markup, model.responses),
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

    const processedMarkup = processMarkup(markup);

    const callback = () =>
      onModelChanged({
        ...this.props.model,
        slateMarkup: domMarkup.innerHTML,
        responses: newResponses,
        markup: processedMarkup,
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
    const { configuration, imageSupport, model, onConfigurationChanged, onModelChanged, uploadSoundSupport } =
      this.props;

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
          <StyledInputContainer label={teacherInstructions.label}>
            <StyledEditableHtml
              markup={model.teacherInstructions || ''}
              onChange={(value) => this.handleChange('teacherInstructions', value)}
              imageSupport={imageSupport}
              nonEmpty={false}
              error={teacherInstructionsError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(teacherInstructions?.inputConfiguration, baseInputConfiguration)}
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
            <StyledEditableHtml
              markup={model.prompt}
              onChange={(value) => this.handleChange('prompt', value)}
              imageSupport={imageSupport}
              nonEmpty={false}
              disableUnderline
              error={promptError}
              toolbarOpts={toolbarOpts}
              pluginProps={getPluginProps(teacherInstructions?.inputConfiguration, baseInputConfiguration)}
              spellCheck={spellCheckEnabled}
              maxImageWidth={defaultImageMaxWidth}
              maxImageHeight={defaultImageMaxHeight}
              uploadSoundSupport={uploadSoundSupport}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
            {promptError && <ErrorText>{promptError}</ErrorText>}
          </StyledInputContainer>
        )}
        <TooltipContainer>
          <StyledTitle component={'div'}>
            Response Template
          </StyledTitle>
          <StyledTooltip
            disableFocusListener
            disableTouchListener
            placement={'right'}
            title={validationMessage}
          >
            <Info fontSize={'small'} color={'primary'} />
          </StyledTooltip>
        </TooltipContainer>
        <StyledMarkup
          activePlugins={ALL_PLUGINS}
          toolbarOpts={{ position: 'top' }}
          spellCheck={spellCheckEnabled}
          pluginProps={getPluginProps(template?.inputConfiguration, baseInputConfiguration)}
          responseAreaProps={{
            type: 'math-templated',
            respAreaToolbar: null,
            error: () => responsesErrors,
            onHandleAreaChange: this.onHandleAreaChange,
            maxResponseAreas: maxResponseAreas,
          }}
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
        />
        {responseAreasError && <ResponseAreaError>{responseAreasError}</ResponseAreaError>}

        <StyledTitle>Define Response</StyledTitle>

        <StyledSelectContainer label="Response Template Equation Editor">
          <StyledSelect
            MenuProps={{transitionDuration: { enter: 225, exit: 195 } }}
            onChange={(event) => this.handleChange('equationEditor', event.target.value)}
            value={equationEditor}
          >
            <MenuItem value="non-negative-integers">Numeric - Non-Negative Integers</MenuItem>
            <MenuItem value="integers">Numeric - Integers</MenuItem>
            <MenuItem value="decimals">Numeric - Decimals</MenuItem>
            <MenuItem value="fractions">Numeric - Fractions</MenuItem>
            <MenuItem value={1}>Grade 1 - 2</MenuItem>
            <MenuItem value={3}>Grade 3 - 5</MenuItem>
            <MenuItem value={6}>Grade 6 - 7</MenuItem>
            <MenuItem value={8}>Grade 8 - HS</MenuItem>
            <MenuItem value={'geometry'}>Geometry</MenuItem>
            <MenuItem value={'advanced-algebra'}>Advanced Algebra</MenuItem>
            <MenuItem value={'statistics'}>Statistics</MenuItem>
            <MenuItem value={'item-authoring'}>Item Authoring</MenuItem>
          </StyledSelect>
        </StyledSelectContainer>

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
          <StyledInputContainer label={rationale.label}>
            <StyledEditableHtml
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

export default Design;
