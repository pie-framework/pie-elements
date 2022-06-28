import {
  FeedbackConfig,
  FormSection,
  InputContainer,
  settings,
  layout
} from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';
import { withStyles } from '@material-ui/core/styles';
import { withDragContext } from '@pie-lib/drag';
import Info from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

import debug from 'debug';
import cloneDeep from 'lodash/cloneDeep';
import { get, set } from 'nested-property';
import PropTypes from 'prop-types';
import React from 'react';
import pluralize from 'pluralize';

import ChoiceEditor from './choice-editor';
import { generateValidationMessage } from './utils';

const log = debug('@pie-element:placement-ordering:design');
const { Panel, toggle, radio } = settings;

const getSingularAndPlural = label => {
  return !pluralize.isPlural(label) ? {
    singularLabel: label,
    pluralLabel: pluralize(label)
  } : {
    singularLabel: pluralize.singular(label),
    pluralLabel: label
  };
};

export class Design extends React.Component {
  constructor(props) {
    super(props);

    this.applyUpdate = modelFn => {
      const { model, onModelChanged } = this.props;
      const update = modelFn(cloneDeep(model));

      onModelChanged(update);
    };

    this.changeHandler = (modelPath, valuePath) => {
      return value => {
        log('[changeHandler] value: ', value);

        const v = valuePath ? get(value, valuePath) : value;

        this.applyUpdate(model => {
          set(model, modelPath, v);
          return model;
        });
      };
    };

    this.onPromptChange = this.changeHandler('prompt');
    this.onTeacherInstructionsChange = this.changeHandler(
      'teacherInstructions'
    );
    this.onRationaleChange = this.changeHandler('rationale');
    this.onChoiceAreaLabelChange = this.changeHandler(
      'choiceLabel',
      'target.value'
    );
    this.onAnswerAreaLabelChange = this.changeHandler(
      'targetLabel',
      'target.value'
    );
    this.onFeedbackChange = this.changeHandler('feedback');

    this.onChoiceEditorChange = (choices, correctResponse) => {
      const { model, onModelChanged } = this.props;
      const update = cloneDeep(model);

      update.choices = choices;
      update.correctResponse = correctResponse;
      onModelChanged(update);
    };
  }

  render() {
    const {
      model,
      classes,
      imageSupport,
      onModelChanged,
      configuration,
      onConfigurationChanged
    } = this.props;
    const {
      choiceLabel = {},
      choices = {},
      feedback = {},
      targetLabel = {},
      prompt = {},
      placementArea = {},
      numberedGuides = {},
      enableImages = {},
      orientation = {},
      removeTilesAfterPlacing = {},
      partialScoring = {},
      teacherInstructions = {},
      studentInstructions = {},
      rationale = {},
      spellCheck = {},
      scoringType = {},
      maxImageWidth = {},
      maxImageHeight = {}
    } = configuration || {};
    const { teacherInstructionsEnabled, promptEnabled, rationaleEnabled, feedbackEnabled, choiceLabelEnabled, spellCheckEnabled, errors } =
      model || {};
    const { orderError } = errors || {};
    const validationMessage = generateValidationMessage();

    const toolbarOpts = {};
    const {
      singularLabel = '',
      pluralLabel = ''
    } = choices && choices.label && getSingularAndPlural(choices.label) || {};

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;
    const maxChoicesImageWidth = maxImageWidth && model.placementArea ? maxImageWidth.choicesWithPlacementArea : maxImageWidth.choicesWithoutPlacementArea || defaultImageMaxWidth;
    const maxChoicesImageHeight = maxImageHeight && maxImageHeight.choices || defaultImageMaxHeight;

    switch (model.toolbarEditorPosition) {
      case 'top':
        toolbarOpts.position = 'top';
        break;
      default:
        toolbarOpts.position = 'bottom';
        break;
    }
    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={model => onModelChanged(model)}
            onChangeConfiguration={configuration =>
              onConfigurationChanged(configuration, true)
            }
            groups={{
              Settings: {
                choiceLabelEnabled:
                  choiceLabel.settings && toggle(choiceLabel.label),
                placementArea:
                  placementArea.settings && toggle(placementArea.label),
                numberedGuides:
                  numberedGuides.settings &&
                  model.placementArea &&
                  toggle(numberedGuides.label),
                enableImages:
                  enableImages.settings && toggle(enableImages.label),
                orientation:
                  orientation.settings &&
                  radio(orientation.label, ['vertical', 'horizontal']),
                removeTilesAfterPlacing:
                  removeTilesAfterPlacing.settings &&
                  toggle(removeTilesAfterPlacing.label),
                partialScoring:
                  partialScoring.settings && toggle(partialScoring.label),
                feedbackEnabled:
                  feedback.settings && toggle(feedback.label)
              },
              Properties: {
                teacherInstructionsEnabled:
                  teacherInstructions.settings &&
                  toggle(teacherInstructions.label),
                studentInstructionsEnabled:
                  studentInstructions.settings &&
                  toggle(studentInstructions.label),
                rationaleEnabled: rationale.settings && toggle(rationale.label),
                promptEnabled: prompt.settings && toggle(prompt.label),
                spellCheckEnabled:
                spellCheck.settings && toggle(spellCheck.label),
                scoringType:
                  scoringType.settings &&
                  radio(scoringType.label, ['auto', 'rubric'])
              }
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
              onChange={this.onTeacherInstructionsChange}
              imageSupport={imageSupport}
              nonEmpty={false}
              toolbarOpts={toolbarOpts}
              spellCheck={spellCheckEnabled}
              maxImageWidth={maxImageWidth && maxImageWidth.teacherInstructions || defaultImageMaxWidth}
              maxImageHeight={maxImageHeight && maxImageHeight.teacherInstructions || defaultImageMaxHeight}
            />
          </InputContainer>
        )}

        {promptEnabled && (
          <FormSection label="Ordering">
            <InputContainer
              label={prompt && prompt.label && prompt.label.toUpperCase()}
              className={classes.promptHolder}
            >
              <EditableHtml
                className={classes.prompt}
                markup={model.prompt}
                onChange={this.onPromptChange}
                imageSupport={imageSupport}
                toolbarOpts={toolbarOpts}
                spellCheck={spellCheckEnabled}
                maxImageWidth={maxImageWidth && maxImageWidth.prompt}
                maxImageHeight={maxImageHeight && maxImageHeight.prompt}
              />
            </InputContainer>
            {rationaleEnabled && (
              <InputContainer
                label={rationale.label}
                className={classes.promptHolder}
              >
                <EditableHtml
                  className={classes.prompt}
                  markup={model.rationale || ''}
                  onChange={this.onRationaleChange}
                  imageSupport={imageSupport}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={maxImageWidth && maxImageWidth.rationale || defaultImageMaxWidth}
                  maxImageHeight={maxImageHeight && maxImageHeight.rationale || defaultImageMaxHeight}
                />
              </InputContainer>
            )}
          </FormSection>
        )}

        <FormSection label={`Define ${pluralLabel}`} labelExtraStyle={{display: 'inline-flex'}}>
          <div className={classes.inlineFlexContainer}>
          <Tooltip
            classes={{tooltip: classes.tooltip}}
            disableFocusListener
            disableTouchListener
            placement={'right'}
            title={validationMessage}
          >
            <Info fontSize={'small'} color={'primary'} style={{marginLeft: '5px'}}/>
          </Tooltip>
          </div>
          {orderError && <div className={classes.errorText}>{orderError}</div>}
          <div className={classes.row}>
            {choiceLabelEnabled && (
              <InputContainer
                label={
                  choiceLabel &&
                  choiceLabel.label &&
                  `${singularLabel} label`.toUpperCase()
                }
                className={classes.promptHolder}
              >
                <EditableHtml
                  className={classes.prompt}
                  markup={model.choiceLabel}
                  onChange={this.onChoiceAreaLabelChange}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={maxChoicesImageWidth}
                  maxImageHeight={maxChoicesImageHeight}
                />
              </InputContainer>
            )}

            {targetLabel.settings && model.placementArea && (
              <InputContainer
                label={
                  targetLabel &&
                  targetLabel.label &&
                  targetLabel.label.toUpperCase()
                }
                className={classes.promptHolder}
              >
                <EditableHtml
                  className={classes.prompt}
                  markup={model.targetLabel}
                  onChange={this.onAnswerAreaLabelChange}
                  toolbarOpts={toolbarOpts}
                  spellCheck={spellCheckEnabled}
                  maxImageWidth={maxImageWidth && maxImageWidth.choicesWithPlacementArea || defaultImageMaxWidth}
                  maxImageHeight={maxChoicesImageHeight}
                />
              </InputContainer>
            )}
          </div>

          {choices.settings && (
            <InputContainer
              label={choices && choices.label && pluralLabel.toUpperCase()}
              className={classes.promptHolder}
            >
              <ChoiceEditor
                correctResponse={model.correctResponse}
                choices={model.choices}
                onChange={this.onChoiceEditorChange}
                imageSupport={imageSupport}
                disableImages={!model.enableImages}
                toolbarOpts={toolbarOpts}
                choicesLabel={choices.label}
                placementArea={model.placementArea}
                singularChoiceLabel={singularLabel}
                pluralChoiceLabel={pluralLabel}
                spellCheck={spellCheckEnabled}
                maxImageWidth={maxChoicesImageWidth}
                maxImageHeight={maxChoicesImageHeight}
              />
            </InputContainer>
          )}
        </FormSection>

        {feedbackEnabled && (
          <FeedbackConfig
            feedback={model.feedback}
            onChange={this.onFeedbackChange}
            imageSupport={imageSupport}
            toolbarOpts={toolbarOpts}
          />
        )}
      </layout.ConfigLayout>
    );
  }
}

Design.defaultProps = {
  onModelChanged: () => {},
  onConfigurationChanged: () => {}
};

Design.propTypes = {
  model: PropTypes.object.isRequired,
  configuration: PropTypes.object.isRequired,
  onModelChanged: PropTypes.func,
  onConfigurationChanged: PropTypes.func,
  classes: PropTypes.object.isRequired,
  imageSupport: PropTypes.object
};

export default withDragContext(
  withStyles(theme => ({
    promptHolder: {
      width: '100%',
      paddingTop: '12px',
      marginTop: '24px'
    },
    prompt: {
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit
    },
    row: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridAutoColumns: '1fr',
      gridGap: '8px'
    },
    tooltip: {
      fontSize: '12px',
      whiteSpace: 'pre',
      maxWidth: '500px'
    },
    errorText: {
      fontSize: '12px',
      color: 'red',
      padding: '5px 0'
    },
    inlineFlexContainer: {
      display: 'inline-flex',
      position: 'absolute'
    }
  }))(Design)
);
