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
      'choiceAreaLabel',
      'target.value'
    );
    this.onAnswerAreaLabelChange = this.changeHandler(
      'answerAreaLabel',
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
        itemStemLabel,
        choiceLabel,
        choicesLabel,
        settingsItemStemChange,
        settingsChoicesLabel,
        settingsFeedback,
        settingsPlacementAreaLabel,
        answerLabel,
      },
    } = model;

    return (
      <div className={classes.design}>
        <div className={classes.settings}>
          {getSideMenuItems(this.props)}
        </div>

        {
          settingsItemStemChange &&
          <FormSection label="Ordering">
            <InputContainer label={itemStemLabel && itemStemLabel.toUpperCase()} className={classes.promptHolder}>
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
              model.configure.editableChoiceLabel && (
                <InputContainer label={choiceLabel && choiceLabel.toUpperCase()} className={classes.promptHolder}>
                  <EditableHtml
                    className={classes.prompt}
                    markup={model.choiceAreaLabel}
                    onChange={this.onChoiceAreaLabelChange}
                  />
                </InputContainer>
              )}

            {(settingsPlacementAreaLabel && model.placementArea === true) && (
              <InputContainer label={answerLabel && answerLabel.toUpperCase()} className={classes.promptHolder}>
                <EditableHtml
                  className={classes.prompt}
                  markup={model.answerAreaLabel}
                  onChange={this.onAnswerAreaLabelChange}
                />
              </InputContainer>
            )}
          </div>

          {
            settingsChoicesLabel &&
            <InputContainer label={choicesLabel && choicesLabel.toUpperCase()} className={classes.promptHolder}>
              <ChoiceEditor
                correctResponse={model.correctResponse}
                choices={model.choices}
                onChange={this.onChoiceEditorChange}
                imageSupport={imageSupport}
                disableImages={model.configure && !model.configure.imagesEnabled}
              />
            </InputContainer>
          }

        </FormSection>

        {
          settingsFeedback &&
          <FeedbackConfig
            feedback={model.feedback}
            onChange={this.onFeedbackChange}
            imageSupport={imageSupport}
          />
        }

      </div>
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
    paddingTop: '10px'
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
    flexWrap: 'wrap'
  }
}))(Design);