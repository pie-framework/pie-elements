import { withStyles } from 'material-ui/styles';
import React from 'react';
import { Typography } from 'material-ui';
import { FeedbackConfig } from '@pie-lib/config-ui';
import debug from 'debug';
import Responses from './responses';
import PropTypes from 'prop-types';
import ModelConfig from './model-config';
import {
  modelToFeedbackConfig,
  feedbackConfigToModel
} from './feedback-mapper';
import NumberInput from './number-input';

const log = debug('@pie-element:text-entry:configure');

const styles = () => ({
  award: {
    width: '100%'
  }
});

class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func.isRequired,
    model: PropTypes.object,
    classes: PropTypes.object.isRequired
  };
  updateResponses = name => responses => {
    const { model } = this.props;
    model[name] = responses;
    log('[updateResponses]', name, 'responses: ', responses);
    this.props.onModelChanged(model);
  };

  onCorrectResponsesChanged = this.updateResponses('correctResponses');

  onPartialResponsesChanged = this.updateResponses('partialResponses');

  onModelConfigChange = cfg => {
    this.props.model.model = cfg;
    this.props.onModelChanged(this.props.model);
  };

  onFeedbackChange = feedbackConfig => {
    feedbackConfigToModel(feedbackConfig, this.props.model);
    this.props.onModelChanged(this.props.model);
  };

  onAwardPercentageChange = percent => {
    this.props.model.partialResponses.awardPercentage = percent;
    this.props.onModelChanged(this.props.model);
  };

  render() {
    const { classes, model } = this.props;

    const feedbackConfig = modelToFeedbackConfig(model);

    log('[render] model', model);

    return (
      <div>
        <Typography>
          Students will respond to a prompt (e.g., calculate, identify,
          compute), and the answer will be evaluated.
        </Typography>
        <Responses
          label="Correct Answers"
          subHeader="Additional correct answers may be added by clicking enter/return between answers."
          responses={model.correctResponses}
          onChange={this.onCorrectResponsesChanged}
          feedbackType={feedbackConfig.correctFeedbackType}
          feedback={feedbackConfig.correctFeedback}
        />
        <Responses
          label="Partial Correct Answers (optional)"
          subHeader="Additional partially correct answers may be added by clicking enter/return between answers."
          responses={model.partialResponses}
          feedbackType={feedbackConfig.partialFeedbackType}
          feedback={feedbackConfig.partialFeedback}
          onChange={this.onPartialResponsesChanged}
        >
          <div>
            <NumberInput
              className={classes.award}
              value={model.partialResponses.awardPercentage}
              onChange={this.onAwardPercentageChange}
              placeholder="Award % for partially correct answer"
            />
          </div>
        </Responses>
        <ModelConfig config={model.model} onChange={this.onModelConfigChange} />
        <FeedbackConfig
          feedback={feedbackConfig}
          onChange={this.onFeedbackChange}
        />
      </div>
    );
  }
}

const ConfigureMain = withStyles(styles)(Configure);

class StateWrapper extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    onModelChanged: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      model: props.model
    };

    this.onModelChanged = m => {
      this.setState({ model: m }, () => {
        this.props.onModelChanged(this.state.model);
      });
    };
  }

  render() {
    const { model } = this.state;
    return <ConfigureMain model={model} onModelChanged={this.onModelChanged} />;
  }
}

export default StateWrapper;
