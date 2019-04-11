import * as React from 'react';
import PropTypes from 'prop-types';
import { InputContainer } from '@pie-lib/config-ui';
import { MathToolbar } from '@pie-lib/math-toolbar';
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

const styles = theme => ({
  responseContainer: {
    marginTop: theme.spacing.unit * 2,
    width: '100%',
    border: '1px solid darkgray',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardContent: {
    paddingBottom: `${theme.spacing.unit}px !important`,
  },
  title: {
    fontWeight: 700,
    fontSize: '1.2rem',
    flex: 3
  },
  selectContainer: {
    flex: 2,
  },
  inputContainer: {
    marginTop: theme.spacing.unit
  },
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  responseEditor: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    minWidth: '500px',
    maxWidth: '900px',
    height: 'auto',
    minHeight: '40px'
  },
  configPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  alternateButton: {
    border: '1px solid lightgrey'
  },
  removeAlternateButton: {
    marginLeft: theme.spacing.unit * 2,
    border: '1px solid lightgrey',
    color: 'gray',
    fontSize: '0.8rem'
  },
  checkboxContainer: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  configLabel: {
    marginRight: 'auto'
  }
});

class Response extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    defaultResponse: PropTypes.bool,
    mode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    index: PropTypes.number,
    onResponseChange: PropTypes.func.isRequired,
    response: PropTypes.object.isRequired
  };

  static defaultProps = {
    defaultResponse: false,
    mode: 'everything'
  };

  constructor(props) {
    super(props);

    this.state = {
      alternateIdCounter: 1,
      showKeypad: {
        openCount: 0,
        main: false
      }
    };
  }

  onChange = name => evt => {
    const { response, onResponseChange, index } = this.props;
    const newResponse = { ...response };

    newResponse[name] = evt.target.value;

    onResponseChange(newResponse, index);
  };

  onConfigChanged = name => evt => {
    const { response, onResponseChange, index } = this.props;
    const newResponse = { ...response };

    newResponse[name] = evt.target.checked;

    onResponseChange(newResponse, index);
  };

  onAnswerChange = answer => {
    const { response, onResponseChange, index } = this.props;
    const newResponse = { ...response };

    newResponse.answer = answer;

    onResponseChange(newResponse, index);
  };

  onAlternateAnswerChange = alternateId => answer => {
    const { response, onResponseChange, index } = this.props;
    const newResponse = { ...response };

    newResponse.alternates[alternateId].answer = answer;

    onResponseChange(newResponse, index);
  };

  onAddAlternate = () => {
    const { response, onResponseChange, index } = this.props;
    const { alternateIdCounter } = this.state;
    const newResponse = { ...response };

    if (!newResponse.alternates) {
      newResponse.alternates = {}
    }

    newResponse.alternates[alternateIdCounter] = { id: alternateIdCounter, answer: '' };

    onResponseChange(newResponse, index);

    this.setState({
      alternateIdCounter: alternateIdCounter + 1
    });
  };

  onRemoveAlternate = alternateId => () => {
    const { response, onResponseChange, index } = this.props;
    const newResponse = { ...response };

    delete newResponse.alternates[alternateId];

    onResponseChange(newResponse, index);
  };

  onDone = () => {
    this.setState(state => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: state.showKeypad.openCount - 1,
        main: false
      }
    }));
  };

  onFocus = () => {
    this.setState(state => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: !state.showKeypad.main ? state.showKeypad.openCount + 1 : state.showKeypad.openCount,
        main: true
      }
    }));
  };

  onAlternateFocus = alternateId => () => {
    this.setState(state => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: !state.showKeypad[alternateId] ? state.showKeypad.openCount + 1 : state.showKeypad.openCount,
        [alternateId]: true
      }
    }));
  };

  onAlternateDone = alternateId => () => {
    this.setState(state => ({
      showKeypad: {
        ...state.showKeypad,
        openCount: state.showKeypad.openCount - 1,
        [alternateId]: false
      }
    }));
  };

  render() {
    const { classes, mode, defaultResponse, index, response } = this.props;
    const { showKeypad } = this.state;
    const { validation, answer, alternates, allowDecimals, allowSpaces } = response;
    const hasAlternates = Object.keys(alternates || {}).length > 0;
    const classNames = {
      editor: classes.responseEditor
    };
    const styles = {
      minHeight: `${showKeypad.openCount > 0 ? 430 : 230}px`
    };

    return (
      <Card className={classes.responseContainer} style={styles}>
        <CardContent className={classes.cardContent}>
          <div className={classes.titleBar}>
            <Typography className={classes.title} component="h2">Response {defaultResponse ? '' : index + 1}</Typography>
            <InputContainer label="Validation" className={classes.selectContainer}>
              <Select
                className={classes.select}
                onChange={this.onChange('validation')}
                value={validation}
              >
                <MenuItem value="literal">Literal Validation</MenuItem>
                <MenuItem value="symbolic">Symbolic Validation</MenuItem>
              </Select>
            </InputContainer>
          </div>
          <div className={classes.inputContainer}>
            <InputLabel>Correct Answer</InputLabel>
            <MathToolbar
              keypadMode={mode}
              classNames={classNames}
              controlledKeypad
              noDecimal={!allowDecimals}
              showKeypad={showKeypad.main}
              latex={answer || ''}
              onChange={this.onAnswerChange}
              onFocus={this.onFocus}
              onDone={this.onDone}
            />
          </div>
          {hasAlternates && Object.keys(alternates).map((alternateId, altIdx) => (
            <div className={classes.inputContainer} key={alternateId}>
              <div className={classes.alternateBar}>
                <InputLabel>Alternate{Object.keys(alternates).length > 1 ? ` ${altIdx + 1}` : ''}</InputLabel>
                <Button className={classes.removeAlternateButton} type="secondary" onClick={this.onRemoveAlternate(alternateId)}>
                  Remove
                </Button>
              </div>
              <MathToolbar
                classNames={classNames}
                controlledKeypad
                keypadMode={mode}
                showKeypad={showKeypad[alternateId] || false}
                latex={alternates[alternateId].answer || ''}
                noDecimal={!allowDecimals}
                onChange={this.onAlternateAnswerChange(alternateId)}
                onFocus={this.onAlternateFocus(alternateId)}
                onDone={this.onAlternateDone(alternateId)}
              />
            </div>
          ))}
          <div className={classes.configPanel}>
            {validation === 'literal' && (
              <Button className={classes.alternateButton} type="primary" onClick={this.onAddAlternate}>
                ADD ALTERNATE
              </Button>
            ) || <div />}
            <div className={classes.checkboxContainer}>
              {validation === 'symbolic' && (
                <FormControlLabel
                  classes={{ root: classes.configLabel }}
                  label="Allow Decimals"
                  control={
                    <Checkbox
                      checked={allowDecimals}
                      onChange={this.onConfigChanged('allowDecimals')}
                    />
                  }
                />
              )}
              {validation === 'literal' && (
                <FormControlLabel
                  classes={{ root: classes.configLabel }}
                  label="Allow Extra Spaces"
                  control={
                    <Checkbox
                      checked={allowSpaces}
                      onChange={this.onConfigChanged('allowSpaces')}
                    />
                  }
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Response);
