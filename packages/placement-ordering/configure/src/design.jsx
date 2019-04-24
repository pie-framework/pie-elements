import {
  FeedbackConfig,
  FormSection,
  InputContainer,
  settings,
  layout
} from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';
import { withStyles } from '@material-ui/core/styles';

import debug from 'debug';
import cloneDeep from 'lodash/cloneDeep';
import { get, set } from 'nested-property';
import PropTypes from 'prop-types';
import React from 'react';

import ChoiceEditor from './choice-editor';

const log = debug('@pie-element:placement-ordering:design');
const { Panel, toggle, radio } = settings;

export class Design extends React.Component {
  constructor(props) {
    super(props);

    this.applyUpdate = modelFn => {
      const { model, updateModel } = this.props;
      const update = modelFn(cloneDeep(model));

      updateModel(update);
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
      const { model, updateModel } = this.props;
      const update = cloneDeep(model);

      update.choices = choices;
      update.correctResponse = correctResponse;
      updateModel(update);
    };
  }

  render() {
    const { model, classes, imageSupport, updateModel, configuration, onConfigurationChanged } = this.props;
    const {
      choiceLabel,
      choices,
      feedback,
      targetLabel,
      prompt,

      placementArea,
      numberedGuides,
      enableImages,
      orientation,
      removeTilesAfterPlacing,
      partialScoring,
      lockChoiceOrder,

      teacherInstructions,
      studentInstructions,
      rationale,
      scoringType,
    } = configuration;

    return (
      <layout.ConfigLayout
        settings={
          <Panel
            model={model}
            configuration={configuration}
            onChangeModel={(model, key) => updateModel(model)}
            onChangeConfiguration={(configuration, key) => onConfigurationChanged(configuration, true)}
            groups={{
              'Item Type': {
                'choiceLabel.enabled': choiceLabel.settings &&
                  toggle(choiceLabel.label, true),
                placementArea: placementArea.settings &&
                  toggle(placementArea.label),
                numberedGuides: (numberedGuides.settings &&
                  model.placementArea) && toggle(numberedGuides.label),
                enableImages: enableImages.settings &&
                  toggle(enableImages.label),
                orientation: orientation.settings &&
                  radio(orientation.label, ['vertical', 'horizontal']),
                removeTilesAfterPlacing: removeTilesAfterPlacing.settings &&
                  toggle(removeTilesAfterPlacing.label),
                partialScoring: partialScoring.settings &&
                  toggle(partialScoring.label),
              },
              'Properties': {
                'teacherInstructions.enabled': teacherInstructions.settings &&
                  toggle(teacherInstructions.label, true),
                'studentInstructions.enabled': studentInstructions.settings &&
                  toggle(studentInstructions.label, true),
                'rationale.enabled': rationale.settings &&
                  toggle(rationale.label, true),
                lockChoiceOrder: lockChoiceOrder.settings &&
                  toggle(lockChoiceOrder.label),
                scoringType: scoringType.settings &&
                  radio(scoringType.label, ['auto', 'rubric']),
              },
            }}
          />
        }
      >
        {
          prompt.settings &&
          <FormSection label="Ordering">
            <InputContainer label={prompt && prompt.label && prompt.label.toUpperCase()}
                            className={classes.promptHolder}>
              <EditableHtml
                className={classes.prompt}
                markup={model.prompt}
                onChange={this.onPromptChange}
                imageSupport={imageSupport}
              />
            </InputContainer>
          </FormSection>
        }

        <FormSection label="Define Choices">
          <div className={classes.row}>
            {
              choiceLabel.enabled && (
                <InputContainer label={choiceLabel && choiceLabel.label && choiceLabel.label.toUpperCase()}
                                className={classes.promptHolder}>
                  <EditableHtml
                    className={classes.prompt}
                    markup={model.choiceLabel}
                    onChange={this.onChoiceAreaLabelChange}
                  />
                </InputContainer>
              )}

            {(targetLabel.settings && model.placementArea) && (
              <InputContainer label={targetLabel && targetLabel.label && targetLabel.label.toUpperCase()}
                              className={classes.promptHolder}>
                <EditableHtml
                  className={classes.prompt}
                  markup={model.targetLabel}
                  onChange={this.onAnswerAreaLabelChange}
                />
              </InputContainer>
            )}
          </div>

          {
            choices.settings &&
            <InputContainer label={choices && choices.label && choices.label.toUpperCase()}
                            className={classes.promptHolder}>
              <ChoiceEditor
                correctResponse={model.correctResponse}
                choices={model.choices}
                onChange={this.onChoiceEditorChange}
                imageSupport={imageSupport}
                disableImages={!model.enableImages}
              />
            </InputContainer>
          }

        </FormSection>

        {
          feedback.settings &&
          <FeedbackConfig
            feedback={model.feedback}
            onChange={this.onFeedbackChange}
            imageSupport={imageSupport}
          />
        }
      </layout.ConfigLayout>
    );
  }
}

Design.propTypes = {
  model: PropTypes.object.isRequired,
  updateModel: PropTypes.func,
  classes: PropTypes.object.isRequired,
  imageSupport: PropTypes.object
};

export default withStyles(theme => ({
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
}))(Design);
