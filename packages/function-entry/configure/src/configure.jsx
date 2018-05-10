import { withStyles } from 'material-ui/styles';
import { FeedbackConfig, Checkbox } from '@pie-lib/config-ui';
import { Hints } from '@pie-ui/function-entry';
import React from 'react';
import PropTypes from 'prop-types';
import Input from 'material-ui/Input';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  title: {
    fontSize: '1.1rem',
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit
  },
  equationRowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  equationLabel: {
    marginRight: theme.spacing.unit
  },
  hintsControlRow: {
    display: 'flex',
    alignItems: 'center'
  },
  hintsCheckbox: {
    display: 'inline-block'
  },
  hints: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class Configure extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object,
    onModelChanged: PropTypes.func.isRequired
  };

  changeEquation = event => {
    const { model, onModelChanged } = this.props;
    model.equation = event.target.value;
    onModelChanged(model);
  };

  toggleFormattingHelp = event => {
    const { onModelChanged, model } = this.props;
    model.showFormattingHelp = event.target.checked;
    onModelChanged(model);
  };

  changeFeedback = feedback => {
    const { onModelChanged, model } = this.props;
    model.feedback = feedback;
    onModelChanged(model);
  };

  render() {
    const { classes, model } = this.props;

    return (
      <div>
        <Typography component="div" type="body1">
          <p>
            In Evaluate an Expression, a student submits a linear or polynomial
            expression to be evaluated.
          </p>
          <p className={classes.title}>Expression</p>
          <p>
            Enter the expression against which the the student&#39;s response
            will be evaluated. <br />
            Note that{' '}
            <b>
              <i> y </i>
            </b>is the dependent variable and{' '}
            <b>
              <i> f(x) </i>
            </b>{' '}
            is some function where{' '}
            <b>
              <i> x </i>
            </b>{' '}
            is the independent variable. <br />
            Expressions <b> must </b> be input using{' '}
            <b>
              <i> x </i>
            </b>{' '}
            and/or{' '}
            <b>
              <i> y </i>
            </b>{' '}
            variables.
          </p>
        </Typography>
        <div className={classes.equationRowContainer}>
          <Typography type="body1">
            <span className={classes.equationLabel}>y = </span>
          </Typography>
          <Input
            type="text"
            className="equation-input"
            onChange={this.changeEquation}
            value={model.equation}
            placeholder="Enter the expression here."
          />
        </div>
        <Typography type="body1">
          <span>
            When the student submits an answer the answer will be evaluated
            against the expression by generating test points. The test points
            are created by replacing the <i>x</i> value within the function with
            random whole numbers within the domain. The <i>y</i> value is then
            determined by evaluating the equation using the javascript eval
            function. This is done many times (~50) in order to be sure of the
            correctness.
          </span>
        </Typography>
        <div className={classes.hintsControlRow}>
          <Checkbox
            className={classes.hintsCheckbox}
            checked={model.showFormattingHelp}
            onChange={this.toggleFormattingHelp}
            label=""
          />
          <Typography component="span">
            Show the student the formatting hints for constructing an answer
          </Typography>
        </div>
        {model.showFormattingHelp && <Hints className={classes.hints} />}
        <FeedbackConfig
          allowPartial={false}
          feedback={model.feedback}
          onChange={this.changeFeedback}
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

    this.onModelChanged = model => {
      this.setState({ model }, () => {
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
