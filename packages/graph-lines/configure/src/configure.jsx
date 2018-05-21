import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ChartConfig from '@pie-lib/charting-config';
import { FeedbackConfig } from '@pie-lib/config-ui';
import PropTypes from 'prop-types';
import debug from 'debug';
import Typography from '@material-ui/core/Typography';
import GeneralConfigBlock from './general-config-block';

const log = debug('@pie-element:graph-lines:configure');

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

  constructor(props) {
    super(props);

    this.defaults = JSON.parse(JSON.stringify(props.model));
  }

  resetToDefaults = () => {
    this.props.onModelChanged(JSON.parse(JSON.stringify(this.defaults)));
  };

  onChange = (config, name) => {
    this.props.model.model.config = { ...config };

    // if the correct line changed, we need to update the correct response too on the model
    if (name === 'correctLine') {
      this.props.model.correctResponse = config.correctLine;
    }

    this.props.onModelChanged(this.props.model);
  };

  onFeedbackChange = feedback => {
    const { model, onModelChanged } = this.props;
    model.feedback = feedback;
    onModelChanged(model);
  };

  render() {
    const { classes, model } = this.props;
    const config = model.model.config;

    log('[render] model', model);

    return (
      <div className={classes.content}>
        <Typography component="div" type="body1">
          <span>
            This interaction asks a student to draw a line that meets specific criteria.
            The student will draw the line by clicking on two points on the graph.
          </span>
          <h2>Lines</h2>
          <span>Line equations must be in y=mx+b form. Only whole number coordinates can be plotted.</span>
        </Typography>
        <GeneralConfigBlock
          config={config}
          onChange={this.onChange}
        />
        <ChartConfig
          config={config}
          onChange={this.onChange}
          resetToDefaults={this.resetToDefaults}
        />
        <FeedbackConfig
          allowPartial={false}
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
