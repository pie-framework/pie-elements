import {
  FeedbackConfig,
  FormSection,
  InputContainer,
} from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';

import { get, set } from 'nested-property';

import ChoiceEditor from './choice-editor';
import PropTypes from 'prop-types';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import getSideMenuItems from './settings';
import { layout } from '@pie-lib/config-ui';

const log = debug('@pie-element:placement-ordering:design');

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

    this.onPromptChange = this.changeHandler('itemStem');
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
    const { model, classes, imageSupport } = this.props;
    const {
      configure: {
        choiceLabel,
        choices,
        feedback,
        targetLabel,
        itemStem
      },
    } = model;

    return (
      <layout.ConfigLayout
        settings={getSideMenuItems(this.props)}
      >
        {
          itemStem.settings &&
          <FormSection label="Ordering">
            <InputContainer label={itemStem && itemStem.label && itemStem.label.toUpperCase()}
                            className={classes.promptHolder}>
              <EditableHtml
                className={classes.prompt}
                markup={model.itemStem}
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
  design: {
    paddingTop: '10px',
    flexDirection: 'row',
    display: 'flex'
  },
  langControls: {
    marginTop: '0px',
    marginBottom: '0px'
  },
  choices: {
    marginTop: '20px',
    marginBottom: '20px'
  },
  orientation: {
    marginTop: '0px',
    marginBottom: '0px'
  },
  settings: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '10px'
  }
}))(Design);
