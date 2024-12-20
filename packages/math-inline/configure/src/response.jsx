import * as React from 'react';
import PropTypes from 'prop-types';
import { InputContainer } from '@pie-lib/pie-toolbox/config-ui';
import { MathToolbar } from '@pie-lib/pie-toolbox/math-toolbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { color } from '@pie-lib/pie-toolbox/render-ui';

// TODO once we support individual response correctness, we need to remove this constant
const INDIVIDUAL_RESPONSE_CORRECTNESS_SUPPORTED = false;

const styles = (theme) => ({
  responseContainer: {
    marginBottom: theme.spacing.unit * 2.5,
    width: '100%',
    minWidth: '548px',
    border: `1px solid ${theme.palette.grey[700]}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardContent: {
    paddingBottom: `${theme.spacing.unit * 2}px !important`,
  },
  title: {
    fontWeight: 700,
    fontSize: '1.2rem',
    flex: 3,
  },
  selectContainer: {
    flex: 2,
  },
  inputContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  responseEditor: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minWidth: '500px',
    maxWidth: '900px',
    height: 'auto',
    minHeight: '40px',
  },
  mathToolbar: {
    width: '100%',
  },
  alternateButton: {
    border: `1px solid ${theme.palette.grey['A100']}`,
  },
  removeAlternateButton: {
    marginLeft: theme.spacing.unit * 2,
    border: `1px solid ${theme.palette.grey['A100']}`,
    color: 'gray',
    fontSize: '0.8rem',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
  customColor: {
    color: `${color.tertiary()} !important`
  },
});

class Response extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    defaultResponse: PropTypes.bool,
    error: PropTypes.object,
    mode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    index: PropTypes.number,
    onResponseChange: PropTypes.func.isRequired,
    response: PropTypes.object.isRequired,
    cIgnoreOrder: PropTypes.object.isRequired,
    cAllowTrailingZeros: PropTypes.object.isRequired,
  };

  static defaultProps = {
    defaultResponse: false,
    mode: 'miscellaneous',
  };

  constructor(props) {
    super(props);

    const { response: { alternates } = {} } = props || {};
    const alternatesLength = Object.keys(alternates || {}).length;

    this.state = {
      alternateIdCounter: alternatesLength + 1,
      showKeypad: {
        openCount: 0,
        main: false,
      },
    };
  }

  onChange = (name) => (evt) => {
    const { response, onResponseChange, index } = this.props;
    const newResponse = { ...response };

    newResponse[name] = evt.target.value;

    onResponseChange(newResponse, index);
  };

  onConfigChanged = (name) => (evt) => {
    const { response, onResponseChange, index } = this.props;
    const newResponse = { ...response };

    newResponse[name] = evt.target.checked;

    onResponseChange(newResponse, index);
  };

  onLiteralOptionsChange = (name) => () => {
    const { response, onResponseChange, index } = this.props;
    const newResponse = { ...response };

    newResponse[name] = !response[name];

    onResponseChange(newResponse, index);
  };

  onAnswerChange = (answer) => {
    const { response, onResponseChange, index } = this.props;
    const newResponse = { ...response };

    newResponse.answer = answer;

    onResponseChange(newResponse, index);
  };

  onAlternateAnswerChange = (alternateId) => (answer) => {
    const { response, onResponseChange, index } = this.props;
    const newResponse = { ...response };

    newResponse.alternates[alternateId] = answer;

    onResponseChange(newResponse, index);
  };

  onAddAlternate = () => {
    const { response, onResponseChange, index } = this.props;
    const { alternateIdCounter } = this.state;
    const newResponse = { ...response };

    if (!newResponse.alternates) {
      newResponse.alternates = {};
    }

    newResponse.alternates[alternateIdCounter] = '';

    onResponseChange(newResponse, index);

    this.setState({
      alternateIdCounter: alternateIdCounter + 1,
    });
  };

  onRemoveAlternate = (alternateId) => () => {
    const { response, onResponseChange, index } = this.props;
    const newResponse = { ...response };

    delete newResponse.alternates[alternateId];

    onResponseChange(newResponse, index);

    this.setState((state) => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: !state.showKeypad[alternateId] ? state.showKeypad.openCount : state.showKeypad.openCount - 1,
      },
    }));
  };

  onDone = () => {
    this.setState((state) => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: state.showKeypad.openCount - 1,
        main: false,
      },
    }));
  };

  onFocus = () => {
    this.setState((state) => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: !state.showKeypad.main ? state.showKeypad.openCount + 1 : state.showKeypad.openCount,
        main: true,
      },
    }));
  };

  onAlternateFocus = (alternateId) => () => {
    this.setState((state) => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: !state.showKeypad[alternateId] ? state.showKeypad.openCount + 1 : state.showKeypad.openCount,
        [alternateId]: true,
      },
    }));
  };

  onAlternateDone = (alternateId) => () => {
    this.setState((state) => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: state.showKeypad.openCount - 1,
        [alternateId]: false,
      },
    }));
  };

  render() {
    const { classes, mode, defaultResponse, index, response, cAllowTrailingZeros, cIgnoreOrder, error } = this.props;

    const { showKeypad } = this.state;
    const { validation, answer, alternates, ignoreOrder, allowTrailingZeros } = response;
    const hasAlternates = Object.keys(alternates || {}).length > 0;
    const classNames = {
      editor: classes.responseEditor,
      mathToolbar: classes.mathToolbar,
    };
    const styles = {
      minHeight: `${showKeypad.openCount > 0 ? 430 : 230}px`,
    };

    return (
        <Card className={classes.responseContainer} style={styles}>
          <CardContent className={classes.cardContent}>
            <div className={classes.titleBar}>
              <Typography className={classes.title} component="div">
                Response {INDIVIDUAL_RESPONSE_CORRECTNESS_SUPPORTED ? (defaultResponse ? '' : index + 1) : ''}
              </Typography>

              <InputContainer label="Validation" className={classes.selectContainer}>
                <Select className={classes.select} onChange={this.onChange('validation')} value={validation || 'literal'}>
                  <MenuItem value="literal">Literal Validation</MenuItem>
                  <MenuItem value="symbolic">Symbolic Validation</MenuItem>
                </Select>
              </InputContainer>
            </div>

            {validation === 'literal' && (
                <div className={classes.flexContainer}>
                  {cAllowTrailingZeros.enabled && (
                      <FormControlLabel
                          label={cAllowTrailingZeros.label}
                          control={
                            <Checkbox
                                className={classes.customColor}
                                checked={allowTrailingZeros}
                                onChange={this.onLiteralOptionsChange('allowTrailingZeros')}
                            />
                          }
                      />
                  )}

                  {cIgnoreOrder.enabled && (
                      <FormControlLabel
                          label={cIgnoreOrder.label}
                          control={
                        <Checkbox 
                            className={classes.customColor} 
                            checked={ignoreOrder} 
                            onChange={this.onLiteralOptionsChange('ignoreOrder')} />}
                      />
                  )}
                </div>
            )}

            <div className={classes.inputContainer}>
              <InputLabel>Correct Answer</InputLabel>
              <MathToolbar
                  keypadMode={mode}
                  classNames={classNames}
                  controlledKeypad
                  showKeypad={showKeypad.main}
                  latex={answer || ''}
                  onChange={this.onAnswerChange}
                  onFocus={this.onFocus}
                  onDone={this.onDone}
                  error={error && error.answer}
              />
              {error && error.answer ? <div className={classes.errorText}>{error.answer}</div> : null}
            </div>

            {hasAlternates &&
                Object.keys(alternates).map((alternateId, altIdx) => (
                    <div className={classes.inputContainer} key={alternateId}>
                      <div className={classes.alternateBar}>
                        <InputLabel>
                          Alternate
                          {Object.keys(alternates).length > 1 ? ` ${altIdx + 1}` : ''}
                        </InputLabel>
                        <Button
                            className={classes.removeAlternateButton}
                            type="secondary"
                            onClick={this.onRemoveAlternate(alternateId)}
                        >
                          Remove
                        </Button>
                      </div>

                      <MathToolbar
                          classNames={classNames}
                          controlledKeypad
                          keypadMode={mode}
                          showKeypad={showKeypad[alternateId] || false}
                          latex={alternates[alternateId] || ''}
                          onChange={this.onAlternateAnswerChange(alternateId)}
                          onFocus={this.onAlternateFocus(alternateId)}
                          onDone={this.onAlternateDone(alternateId)}
                          error={error && error[alternateId]}
                      />
                      {error && error[alternateId] ? <div className={classes.errorText}>{error[alternateId]}</div> : null}
                    </div>
                ))}

            <Button className={classes.alternateButton} type="primary" onClick={this.onAddAlternate}>
              ADD ALTERNATE
            </Button>
          </CardContent>
        </Card>
    );
  }
}

export default withStyles(styles)(Response);
