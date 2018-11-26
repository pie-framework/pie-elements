import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FeedbackConfig } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import Typography from '@material-ui/core/Typography';
import GeneralConfigBlock from './general-config-block';

const log = debug('@pie-element:math-inline:configure');

const styles = theme => ({
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit
  },
  content: {
    marginTop: theme.spacing.unit * 2
  }
});

class Configure extends React.Component {
  static propTypes = {
    onModelChanged: PropTypes.func,
    classes: PropTypes.object,
    model: PropTypes.object.isRequired
  };

  onChange = model => {
    this.props.onModelChanged(model);
  };

  onFeedbackChange = feedback => {
    const { model, onModelChanged } = this.props;
    model.feedback = feedback;
    onModelChanged(model);
  };

  render() {
    const { classes, model } = this.props;

    log('[render] model', model);

    return (
      <div>
        <div className={classes.content}>
          <Typography component="div" type="body1">
            <span>
              In Inline Math, students need to fill in the blank for an equation or a mathematical expression.
              This interaction allows for exactly one correct answer.
            </span>
          </Typography>
          <GeneralConfigBlock
            model={model}
            onChange={this.onChange}
          />
          <FeedbackConfig
            feedback={model.feedback}
            onChange={this.onFeedbackChange}
          />
        </div>
      </div>
    );
  }
}

const ConfigureMain = withStyles(styles)(Configure);

class StateWrapper extends React.Component {
  static propTypes = {
    model: PropTypes.any,
    onModelChanged: PropTypes.func
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
