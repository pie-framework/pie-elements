import { withStyles } from 'material-ui/styles';
import { FeedbackConfig, Checkbox } from '@pie-lib/config-ui';
import { HintsPopover } from '@pie-ui/function-entry';
import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import Input from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import ModelConfig from './model-config';
import { modelToFeedbackConfig, feedbackConfigToModel } from './feedback-mapper';

const log = debug('@pie-element:text-entry:configure');

const styles = theme => ({
  title: {
    'font-size': '1.1rem',
    display: 'block',
    'margin-top': theme.spacing.unit * 2,
    'margin-bottom': theme.spacing.unit,
  },
  'equation-row-container': {
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    'margin-top': theme.spacing.unit * 2,
    'margin-bottom': theme.spacing.unit * 2,
  },
  'equation-label': {
    'margin-right': theme.spacing.unit,
  },
});

class Configure extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    model: PropTypes.any,
    onModelChanged: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      hintsAnchorEl: null,
      anchorReference: 'anchorEl',
      hintsOpen: true,
    };
  }

  onModelConfigChange = (cfg) => {
    this.props.model.model = cfg;
    this.props.onModelChanged(this.props.model);
  }

  onEquationChange = (event) => {
    this.props.model.correctResponse.equation = event.target.value;
    this.props.onModelChanged(this.props.model);
  }

  onFormattingHelpChange = (event) => {
    this.props.model.showFormattingHelp = event.target.value;
    this.props.onModelChanged(this.props.model);
  }

  handleHintsPopoverOpen = event => {
    this.setState({ hintsAnchorEl: event.target });
  };

  handleHintsPopoverClose = () => {
    this.setState({ hintsAnchorEl: null });
  };

  onFeedbackChange = (feedbackConfig) => {
    const model = feedbackConfigToModel(feedbackConfig, this.props.model);
    this.props.onModelChanged(this.props.model);
  }

  render() {
    const { classes, model } = this.props;
    const { anchorReference, hintsAnchorEl } = this.state;
    const feedbackConfig = modelToFeedbackConfig(model);
    const hintsOpen = !!hintsAnchorEl;

    log('[render] model', model);

    debugger;

    return (
        <div>
          <Typography type="body1">
            <span>In Evaluate an Expression, a student submits a linear or polynomial expression to be evaluated.</span>
            <span className={classes.title}>Expression</span>
            <span>Enter the expression against which the the student&#39;s response will be evaluated. <br/>
              Note that <b><i> y </i></b>is the dependent variable and <b><i> f(x) </i></b> is some function
              where <b><i> x </i></b> is the independent variable. <br/>
              Expressions <b> must </b> be input using <b><i> x </i></b> and/or <b><i> y </i></b> variables.
            </span>
          </Typography>
          <div className={classes['equation-row-container']}>
            <Typography type="body1">
              <span className={classes['equation-label']}>y = </span>
            </Typography>
            <Input
              type="text"
              className="equation-input"
              onChange={this.onEquationChange}
              value={model.correctResponse.equation}
              placeholder="Enter the expression here."
            />
          </div>
          <Typography type="body1">
            <span>
              When the student submits an answer the answer will be evaluated against the expression by
              generating test points. The test points are created by replacing the <i>x</i> value within the
              function with random whole numbers within the domain. The <i>y</i> value is then determined by
              evaluating the equation using the javascript eval function. This is done many times (~50) in order
              to be sure of the correctness.
            </span>
          </Typography>
          <div className={classes['hints-control-row']}>
            <Checkbox
              className={classes['hints-checkbox']}
              checked={model.model.showFormattingHelp}
              onChange={this.onFormattingHelpChange}
              label=""
            />
            <Typography>
              <span>
                Show the student the formatting &nbsp;
                <span
                    onMouseOver={this.handleHintsPopoverOpen}
                    onMouseOut={this.handleHintsPopoverClose}
                >
                  <i><b>hints</b></i>
                </span>
                &nbsp; for constructing an answer
              </span>
            </Typography>
          </div>
          <HintsPopover
            hintsOpen={hintsOpen}
            hintsAnchorEl={hintsAnchorEl}
            anchorReference={anchorReference}
          />
          <ModelConfig config={model.model} onChange={this.onModelConfigChange} />
          <FeedbackConfig
              feedback={feedbackConfig}
              onChange={this.onFeedbackChange} />
        </div>
    )
  }
}

const ConfigureMain = withStyles(styles)(Configure);

class StateWrapper extends React.Component {
  static propTypes = {
    model: PropTypes.any,
    onModelChanged: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      model: props.model
    }

    this.onModelChanged = (m) => {
      this.setState({ model: m }, () => {
        this.props.onModelChanged(this.state.model);
      });
    }
  }

  render() {
    const { model } = this.state;
    return <ConfigureMain model={model} onModelChanged={this.onModelChanged}/>
  }
}

export default StateWrapper;
