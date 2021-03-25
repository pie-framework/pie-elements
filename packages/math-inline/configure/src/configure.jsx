import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  FeedbackConfig,
  settings,
  layout,
  InputContainer,
} from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import EditableHtml from '@pie-lib/editable-html';
import GeneralConfigBlock from './general-config-block';
import { ResponseTypes } from './utils';

const log = debug('@pie-element:math-inline:configure');
const { Panel, toggle, radio } = settings;

const styles = theme => ({
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit
  },
  content: {
    marginTop: theme.spacing.unit * 2
  },
  promptHolder: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
});

export class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    onConfigurationChanged: PropTypes.func,
    classes: PropTypes.object,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    imageSupport: PropTypes.object
  };

  onChange = model => {
    this.props.onModelChanged(model);
  };

  changeTeacherInstructions = teacherInstructions => {
    this.props.onModelChanged({
      ...this.props.model,
      teacherInstructions
    });
  };

  onFeedbackChange = feedback => {
    const { model, onModelChanged } = this.props;
    model.feedback = feedback;
    onModelChanged(model);
  };

  onAllowTrailingZerosChanged = allowTrailingZeros => {
    const { model, onModelChanged } = this.props;
    model.allowTrailingZeros = allowTrailingZeros;
    onModelChanged(model);
  };

  render() {
    const { classes, model, imageSupport, onModelChanged, configuration, onConfigurationChanged } = this.props;
    const {
      feedback = {},
      responseType = {},
      teacherInstructions = {},
      studentInstructions = {},
      rationale = {},
      prompt = {},
      scoringType = {},
      allowTrailingZeros = {}
    } = configuration || {};
    log('[render] model', model);
    const { rationaleEnabled, promptEnabled, teacherInstructionsEnabled, feedbackEnabled } = model || {};

    if (model.allowTrailingZeros === undefined) {
      if(allowTrailingZeros.default  !== undefined) {
        this.onAllowTrailingZerosChanged(allowTrailingZeros.default);
      }
      else {
        this.onAllowTrailingZerosChanged(false);
      }
    }

    return (
      <div>
        <layout.ConfigLayout
          settings={
            <Panel
              model={model}
              configuration={configuration}
              onChangeModel={model => onModelChanged(model)}
              onChangeConfiguration={config => onConfigurationChanged(config)}
              groups={{
                'Settings': {
                  responseType: responseType.settings &&
                    radio(responseType.label, [ResponseTypes.simple, ResponseTypes.advanced]),
                  feedbackEnabled: feedback.settings &&
                    toggle(feedback.label),
                  'promptEnabled': prompt.settings &&
                    toggle(prompt.label),
                  'allowTrailingZeros.enabled':  allowTrailingZeros.settings &&
                    toggle(allowTrailingZeros.label, true)
                },
                'Properties': {
                  teacherInstructionsEnabled: teacherInstructions.settings &&
                    toggle(teacherInstructions.label),
                  studentInstructionsEnabled: studentInstructions.settings &&
                    toggle(studentInstructions.label),
                  rationaleEnabled: rationale.settings && toggle(rationale.label),
                  scoringType: scoringType.settings &&
                    radio(scoringType.label, ['auto', 'rubric']),
                },
              }}
            />
          }
        >
          <div>
            <div className={classes.content}>
              {teacherInstructionsEnabled && (
                <InputContainer label={teacherInstructions.label} className={classes.promptHolder}>
                  <EditableHtml
                    className={classes.prompt}
                    markup={model.teacherInstructions || ''}
                    onChange={this.changeTeacherInstructions}
                    imageSupport={imageSupport}
                    nonEmpty={false}
                  />
                </InputContainer>
              )}

              <GeneralConfigBlock
                imageSupport={imageSupport}
                model={model}
                configuration={configuration}
                onChange={this.onChange}
                rationaleEnabled={rationaleEnabled}
                promptEnabled={promptEnabled}
              />
              {
                feedbackEnabled && (
                  <FeedbackConfig
                    feedback={model.feedback}
                    onChange={this.onFeedbackChange}
                  />
                )
              }
            </div>
          </div>
        </layout.ConfigLayout>
      </div>
    );
  }
}

export default withStyles(styles)(Configure);
