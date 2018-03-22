import { withStyles } from 'material-ui/styles';
import React from 'react';
import debug from 'debug';
import Input from 'material-ui/Input';
import ModelConfig from './model-config';

const log = debug('@pie-element:text-entry:configure');

const styles = theme => ({
  'equation-row-container': {
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
  },
  'equation-label': {
    'margin-right': theme.spacing.unit,
  },
  fraction: {
    display: 'inline-block',
    position: 'relative',
    'vertical-align': 'middle',
    'letter-spacing': '0.001em',
    'text-align': 'center',
    'margin-right': theme.spacing.unit,
  },
  'fraction-span': {
    display: 'block',
    padding: '0.1em',
  },
  'fraction-bottom': {
    'border-top': 'thin solid black',
  },
  'fraction-symbol': {
    display: 'none',
  },
  'radical-symbol': {
    'text-decoration': 'overline',
  },
  power: {
    'font-size': '12px',
    'vertical-align': '+50%',
    'margin-left': '2px',
  },
});

const Fraction = ({ classes, top, bottom }) => (
    <div className={classes.fraction}>
      <span><i>{top}</i></span>
      <span className={`${classes['fraction-span']} ${classes['fraction-symbol']}`}>/</span>
      <span className={`${classes['fraction-span']} ${classes['fraction-bottom']}`}><i>{bottom}</i></span>
    </div>
)

const Power = ({ classes, base, exponent }) => (
    <span>
      <i>{base}</i>
      <span className={classes.power}>{exponent}</span>
    </span>
)

const Radical = ({ classes, sqrt }) => (
    <span>
      &radic;
      <span className={classes['radical-symbol']}>
        <i>{sqrt}</i>&nbsp;
      </span>
    </span>
)

class Configure extends React.Component {
  onModelConfigChange = (cfg) => {
    this.props.model.model = cfg;
    this.props.onModelChanged(this.props.model);
  }

  onEquationChange = (event) => {
    this.props.model.correctResponse.equation = event.target.value;
    this.props.onModelChanged(this.props.model);
  }

  render() {
    const { classes, model } = this.props;

    log('[render] model', model);

    return (
        <div>
          <p>In Evaluate an Expression, a student submits a linear or polynomial expression to be evaluated.</p>
          <h5>Expression</h5>
          <p>Enter the expression against which the the student's response will be evaluated. <br/>
            Note that <b><i> y </i></b>is the dependent variable and <b><i> f(x) </i></b> is some function
            where <b><i> x </i></b> is the independent variable. <br/>
            Expressions <b> must </b> be input using <b><i> x </i></b> and/or <b><i> y </i></b> variables.
          </p>
          <div className={classes['equation-row-container']}>
            <span className={classes['equation-label']}>y = </span>
            <Input
              type="text"
              className="equation-input"
              onChange={this.onEquationChange}
              value={model.correctResponse.equation}
              placeholder="Enter the expression here."
            />
          </div>
          <p>
            When the student submits an answer the answer will be evaluated against the expression by
            generating test points. The test points are created by replacing the <i>x</i> value within the
            function with random whole numbers within the domain. The <i>y</i> value is then determined by
            evaluating the equation using the javascript eval function. This is done many times (~50) in order
            to be sure of the correctness.
          </p>
          <div className={classes['hint-popover']}>
            <ul>
              <li>For 2 &#8729; 2 enter 2*2</li>
              <li>For 3y enter 3y or 3*y</li>
              <li>For <Fraction top={1} bottom="x" classes={classes} /> enter 1/x</li>
              <li>For <Fraction top={1} bottom="xy" classes={classes} /> enter 1/(x*y)</li>
              <li>For <Fraction top={2} bottom="x+3" classes={classes} /> enter 2/(x+3)</li>
              <li>For <Power classes={classes} base="x" exponent="y" /> enter (x ^ y)</li>
              <li>For <Power classes={classes} base="x" exponent="2" /> enter (x ^ 2)</li>
              <li>For 1 <Fraction top="x" bottom="y" classes={classes} /> enter 1 x/y</li>
              <li>For <Radical classes={classes} sqrt="x" /> enter sqrt(x)</li>
            </ul>
          </div>
          <ModelConfig config={model.model} onChange={this.onModelConfigChange} />
        </div>
    )
  }
}

const ConfigureMain = withStyles(styles)(Configure);

class StateWrapper extends React.Component {
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

