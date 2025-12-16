import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import EditableHtml, { ALL_PLUGINS } from '@pie-lib/editable-html';
import { layout, settings } from '@pie-lib/config-ui';
import { InputContainer } from '@pie-lib/render-ui';
import { DragProvider } from '@pie-lib/drag';
import { renderMath } from '@pie-lib/math-rendering';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Info from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { DragOverlay } from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';

import Choice from './choice';
import Choices from './choices';
import { createSlateMarkup } from './markupUtils';
import { generateValidationMessage } from '../utils';

const { dropdown, toggle, Panel } = settings;

const StyledInputContainer = styled(InputContainer)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledMarkup = styled('div')(({ theme }) => ({
  minHeight: '235px',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  width: '100%',
  '& [data-slate-editor="true"]': {
    minHeight: '235px',
  },
}));

const StyledText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.fontSize + 2,
}));

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    fontSize: theme.typography.fontSize - 2,
    whiteSpace: 'pre',
    maxWidth: '500px',
  },
}));

const ErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
  paddingTop: theme.spacing(1),
}));

const FlexContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export class Main extends React.Component {
  static propTypes = {
    configuration: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    disableSidePanel: PropTypes.bool,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.object,
  };

  state = {
    activeDragItem: null,
  };

  constructor(props) {
    super(props);
    this.markupRef = React.createRef();
  }

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
    const { model, configuration, onConfigurationChanged, imageSupport, uploadSoundSupport } = this.props;
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


    const onDragEnd = ({ active, over }) => {
      // check if item was placed as a correct answer and then dropped outside of StyledMarkup component
      if (active && !over) {
        const drag = active.data.current;

        if (drag && drag.type === 'drag-in-the-blank-placed-choice') {
          if (this.markupRef.current) {
            const markupBounds = this.markupRef.current.getBoundingClientRect();
            const dropX = active.rect.current.translated?.x || 0;
            const dropY = active.rect.current.translated?.y || 0;

            const isOutsideMarkup = (
              dropX < markupBounds.left ||
              dropX > markupBounds.right ||
              dropY < markupBounds.top ||
              dropY > markupBounds.bottom
            );

            if (isOutsideMarkup && drag.onRemove && typeof drag.onRemove === 'function') {
              drag.onRemove(drag);
            }
          }
        }
      }

      if (!active || !over) {
        this.setState({
          activeDragItem: null,
        });
        return;
      }

      const drag = active.data.current;
      const drop = over.data.current;

      if (drop && typeof drop.onDrop === "function") {
        drop.onDrop(drag, drop);
        return;
      }

      if (drag && typeof drag.onDrop === "function") {
        drag.onDrop(drag, drop);
      }

      this.setState({
        activeDragItem: null,
      });
    };

    const onDragStart = (event) => {
      const { active } = event;

      if (active?.data?.current) {
        this.setState({
          activeDragItem: active.data.current,
        });
      }
    };

    const renderDragOverlay = () => {
      const { activeDragItem } = this.state;
      const { model } = this.props;

      if (!activeDragItem) return null;

      if ((activeDragItem.type === 'drag-in-the-blank-choice' || activeDragItem.type === 'drag-in-the-blank-placed-choice') && activeDragItem.value) {
        const choice = model.choices?.find(c => c.id === activeDragItem.value.id);

        if (!choice) return null;

        return <Choice choice={choice} />;
      }
    };

    return (
      <DragProvider onDragEnd={onDragEnd} onDragStart={onDragStart}>
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
            <StyledInputContainer label={teacherInstructions.label}>
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
            </StyledInputContainer>
          )}

          {promptEnabled && (
            <StyledInputContainer label={prompt.label}>
              <EditableHtml
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
              {promptError && <ErrorText>{promptError}</ErrorText>}
            </StyledInputContainer>
          )}

          <FlexContainer>
            <StyledText component={'div'}>
              Define Template, Choices, and Correct Responses
            </StyledText>
            <StyledTooltip
              disableFocusListener
              disableTouchListener
              placement={'right'}
              title={validationMessage}
            >
              <Info fontSize={'small'} color={'primary'} style={{ marginLeft: '5px' }} />
            </StyledTooltip>
          </FlexContainer>

          <StyledMarkup ref={this.markupRef}>
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
          </StyledMarkup>
          {responseAreasError && <ErrorText>{responseAreasError}</ErrorText>}
          {correctResponseError && <ErrorText>{correctResponseError}</ErrorText>}

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
            <StyledInputContainer label={rationale.label}>
              <EditableHtml
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
              {rationaleError && <ErrorText>{rationaleError}</ErrorText>}
            </StyledInputContainer>
          )}
        </layout.ConfigLayout>
        <DragOverlay>
          {renderDragOverlay()}
        </DragOverlay>
      </DragProvider>
    );
  }
}

export default Main;
