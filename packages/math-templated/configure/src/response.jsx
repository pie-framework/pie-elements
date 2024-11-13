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
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import { color } from '@pie-lib/pie-toolbox/render-ui';

export class Response extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    defaultResponse: PropTypes.bool,
    error: PropTypes.object,
    mode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onResponseChange: PropTypes.func.isRequired,
    onResponseDone: PropTypes.func.isRequired,
    response: PropTypes.object.isRequired,
    cIgnoreOrder: PropTypes.object.isRequired,
    cAllowTrailingZeros: PropTypes.object.isRequired,
    responseKey: PropTypes.number.isRequired,
  };

  static defaultProps = {
    defaultResponse: false,
    mode: '8',
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
    const { response, onResponseChange, responseKey } = this.props;
    const newResponse = { ...response };

    newResponse[name] = evt.target.value;

    onResponseChange(newResponse, responseKey);
  };

  onConfigChanged = (name) => (evt) => {
    const { response, onResponseChange, responseKey } = this.props;
    const newResponse = { ...response };

    newResponse[name] = evt.target.checked;

    onResponseChange(newResponse, responseKey);
  };

  onLiteralOptionsChange = (name) => () => {
    const { response, onResponseChange, responseKey } = this.props;
    const newResponse = { ...response };

    newResponse[name] = !response[name];

    onResponseChange(newResponse, responseKey);
  };

  onAnswerChange = (answer) => {
    const { response, onResponseChange, responseKey } = this.props;
    const newResponse = { ...response };

    newResponse.answer = answer;

    onResponseChange(newResponse, responseKey);
  };

  onAlternateAnswerChange = (alternateId) => (answer) => {
    const { response, onResponseChange, responseKey } = this.props;
    const newResponse = { ...response };

    newResponse.alternates[alternateId] = answer;

    onResponseChange(newResponse, responseKey);
  };

  onAddAlternate = () => {
    const { response, onResponseChange, responseKey } = this.props;
    const { alternateIdCounter } = this.state;
    const newResponse = { ...response };

    if (!newResponse.alternates) {
      newResponse.alternates = {};
    }

    newResponse.alternates[alternateIdCounter] = '';

    onResponseChange(newResponse, responseKey);

    this.setState({
      alternateIdCounter: alternateIdCounter + 1,
    });
  };

  onRemoveAlternate = (alternateId) => () => {
    const { response, onResponseChange, responseKey } = this.props;
    const newResponse = { ...response };

    delete newResponse.alternates[alternateId];

    onResponseChange(newResponse, responseKey);

    this.setState((state) => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: !state.showKeypad[alternateId] ? state.showKeypad.openCount : state.showKeypad.openCount - 1,
      },
    }));
  };

  onDone = () => {
    const { onResponseDone } = this.props;
    this.setState((state) => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: state.showKeypad.openCount - 1,
        main: false,
      },
    }));

    onResponseDone();
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
    const { classes, mode, responseKey, response, cAllowTrailingZeros, cIgnoreOrder, error } = this.props;
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
    // add 1 to index to display R 1 instead of R 0
    const keyToDisplay = `R ${parseInt(responseKey) + 1}`;

    return (
      <Card className={classes.responseContainer} style={styles}>
        <CardContent className={classes.cardContent}>
          <div className={classes.titleBar}>
            <Typography className={classes.title} component="div">
              Response for <div className={classes.responseBox}>{keyToDisplay}</div>
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
                      onChange={this.onLiteralOptionsChange('ignoreOrder')}/>}
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
                <InputLabel>
                  Alternate
                  {Object.keys(alternates).length > 1 ? ` ${altIdx + 1}` : ''}
                </InputLabel>
                <div className={classes.alternateBar}>
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
                  <IconButton
                    className={classes.removeAlternateButton}
                    onClick={this.onRemoveAlternate(alternateId)}
                  >
                    <Delete/>
                  </IconButton>
                </div>
                {error && error[alternateId] ? <div className={classes.errorText}>{error[alternateId]}</div> : null}
              </div>
            ))}

          <Button className={classes.alternateButton} type="primary" onClick={this.onAddAlternate}>
            ADD ALTERNATE
          </Button>
        </CardContent>
      </Card>
    )
  }
}

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
    marginLeft: theme.spacing.unit,
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
  responseBox: {
    background: theme.palette.grey['A100'],
    color: theme.palette.grey['A700'],
    display: 'inline',
    minWidth: '50px',
    padding: '8px',
    border: '1px solid #C0C3CF',
  },
  alternateBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customColor: {
    color: `${color.tertiary()} !important`
  },
});

export default withStyles(styles)(Response);
