import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  InputContainer,
  NumberTextField,
  FeedbackConfig,
} from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';
import debug from 'debug';
import Responses from './responses';
import PropTypes from 'prop-types';
import ModelConfig from './model-config';

const log = debug('@pie-element:text-entry:configure');

const styles = (theme) => ({
  award: {
    width: '100%'
  },
  inputHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
  input: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
});

class Configure extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    configuration: PropTypes.object,
    imageSupport: PropTypes.object,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
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
    const { model, onModelChanged } = this.props;
    const update = { ...model, ...cfg };
    onModelChanged(update);
  };

  onFeedbackChange = feedback => {
    const { model, onModelChanged } = this.props;
    model.feedback = feedback;
    onModelChanged(model);
  };

  onTeacherInstructionsChange = teacherInstructions => {
    const { model, onModelChanged } = this.props;
    model.teacherInstructions = teacherInstructions;
    onModelChanged(model);
  };

  onAwardPercentageChange = (event, percent) => {
    const { model, onModelChanged } = this.props;
    model.partialResponses.awardPercentage = percent;
    onModelChanged(model);
  };

  render() {
    const { classes, model, configuration, imageSupport } = this.props;
    const { teacherInstructions = {} } = configuration || {};
    const { teacherInstructionsEnabled } = model || {};

    // const feedbackConfig = modelToFeedbackConfig(model);

    log('[render] model', model);

    return (
      <div>
        <Typography>
          Students will respond to a prompt (e.g., calculate, identify,
          compute), and the answer will be evaluated.
        </Typography>

        {teacherInstructionsEnabled && (
          <InputContainer label={teacherInstructions.label} className={classes.inputHolder}>
            <EditableHtml
              className={classes.input}
              markup={model.teacherInstructions || ''}
              onChange={this.onTeacherInstructionsChange}
              imageSupport={imageSupport}
              nonEmpty={false}
            />
          </InputContainer>
        )}

        <Responses
          label="Correct Answers"
          subHeader="Additional correct answers may be added by clicking enter/return between answers."
          responses={model.correctResponses}
          onChange={this.onCorrectResponsesChanged}
        />
        <Responses
          label="Partial Correct Answers (optional)"
          subHeader="Additional partially correct answers may be added by clicking enter/return between answers."
          responses={model.partialResponses}
          onChange={this.onPartialResponsesChanged}
        >
          <div>
            <NumberTextField
              label={'Award % for partially correct answer'}
              min={0}
              max={100}
              className={classes.award}
              value={parseInt(model.partialResponses.awardPercentage, 10)}
              onChange={this.onAwardPercentageChange}
            />
          </div>
        </Responses>
        <ModelConfig config={model} onChange={this.onModelConfigChange} />
        <FeedbackConfig
          feedback={model.feedback}
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
    configuration: PropTypes.object,
    imageSupport: PropTypes.object,
    onModelChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired
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
    const { configuration, onConfigurationChanged, imageSupport } = this.props;

    return <ConfigureMain
      model={model}
      onModelChanged={this.onModelChanged}
      configuration={configuration}
      onConfigurationChanged={onConfigurationChanged}
      imageSupport={imageSupport}
    />;
  }
}

export default StateWrapper;
