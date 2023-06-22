import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import max from 'lodash/max';
import classnames from 'classnames';

import { getAdjustedLength } from './markupUtils';

const styles = (theme) => ({
  design: {
    marginBottom: theme.spacing.unit / 2,
  },
  altChoices: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    display: 'flex',
    paddingTop: theme.spacing.unit * 2.5,
    '& > *': {
      marginBottom: theme.spacing.unit * 2.5,
      width: '100%',
    },
  },
  choice: {
    flex: '1',
    marginRight: theme.spacing.unit * 2.5,
  },
  deleteBtn: {
    fill: theme.palette.grey[600],
  },
  selectContainer: {
    alignItems: 'flex-end',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  rightContainer: {
    alignItems: 'center',
    display: 'flex',
  },
  lengthField: {
    width: '230px',
    marginRight: theme.spacing.unit * 2.5,
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit / 2,
  },
  inputError: {
    border: `2px solid ${theme.palette.error.main}`,
    borderRadius: '6px',
  },
});

export class Choice extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    error: PropTypes.string,
    markup: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    value: PropTypes.string,
    spellCheck: PropTypes.bool,
  };

  state = {
    value: this.props.markup,
  };

  updateText = debounce(this.props.onChange, 300);

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.markup) {
      this.setState({ value: nextProps.markup });
    }
  }

  onChange = (e) => {
    const { value } = e.target;

    this.setState({ value });
    this.updateText(value);
  };

  render() {
    const { value } = this.state;
    const { classes, onDelete, spellCheck, error } = this.props;

    return (
      <React.Fragment>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <OutlinedInput
            className={classnames(classes.choice, error && classes.inputError)}
            value={value}
            onChange={this.onChange}
            labelWidth={0}
            disableUnderline
            spellCheck={spellCheck}
            inputProps={{
              maxLength: 25,
            }}
          />
          <IconButton aria-label="delete" className={classes.deleteBtn} onClick={onDelete}>
            <Delete />
          </IconButton>
        </div>
        {error && <div className={classes.errorText}>{error}</div>}
      </React.Fragment>
    );
  }
}

export class AlternateSection extends React.Component {
  static propTypes = {
    choices: PropTypes.array,
    selectChoices: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    errors: PropTypes.object,
    onSelect: PropTypes.func.isRequired,
    choiceChanged: PropTypes.func.isRequired,
    lengthChanged: PropTypes.func,
    choiceRemoved: PropTypes.func.isRequired,
    value: PropTypes.string,
    maxLength: PropTypes.number,
    showMaxLength: PropTypes.bool,
    spellCheck: PropTypes.bool,
  };

  state = {};

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.updateChoicesIfNeeded(nextProps);
  }

  componentDidMount() {
    this.updateChoicesIfNeeded(this.props);
  }

  updateChoicesIfNeeded = (props) => {
    if (
      !this.state.choices ||
      !isEqual(props.choices, this.state.choices) ||
      !isEqual(props.choices, this.props.choices)
    ) {
      this.setState({
        choices: props.choices,
      });
    }
  };

  handleSelect = (e) => {
    const { onSelect, selectChoices } = this.props;
    const { value } = e.target;

    onSelect(selectChoices.find((c) => c.value === value));
  };

  onAddChoice = () => {
    const { choices } = this.state;

    if (choices.length && choices[choices.length - 1].label !== '') {
      const value = max(choices.map((c) => parseInt(c.value)).filter((id) => !isNaN(id))) || 0;

      this.setState({
        choices: [
          ...choices,
          {
            value: `${value + 1}`,
            label: '',
          },
        ],
      });
    }
  };

  onChoiceChanged = (choice, value, index) => {
    const { choiceChanged, lengthChanged, maxLength, choices } = this.props;

    const labelLengthsArr = choices.map((choice) => (choice.label || '').length);
    labelLengthsArr[index] = value.length;

    const newLength = Math.max(...labelLengthsArr);

    choiceChanged({
      ...choice,
      label: value,
    });

    if (newLength > maxLength || newLength + 10 <= maxLength) {
      lengthChanged(getAdjustedLength(newLength));
    }
  };

  onRemoveChoice = (choice) => {
    const { choiceRemoved } = this.props;

    choiceRemoved(choice.value);
  };

  getChoicesMaxLength = () => {
    const { choices } = this.state;

    if (!choices) {
      return 1;
    }

    const labelLengthsArr = choices.map((choice) => (choice.label || '').length);

    return Math.max(...labelLengthsArr);
  };

  changeLength = (event) => {
    const { lengthChanged } = this.props;
    const numberValue = parseInt(event.target.value, 10);
    const minLength = this.getChoicesMaxLength();

    if (numberValue && numberValue >= minLength && numberValue <= minLength + 10) {
      lengthChanged(numberValue);
    }
  };

  render() {
    const { classes, selectChoices, maxLength, showMaxLength, value, spellCheck, errors } = this.props;
    const { choices } = this.state;
    const minLength = this.getChoicesMaxLength();

    return (
      <div className={classes.design}>
        <div className={classes.selectContainer}>
          <Select
            className={classes.select}
            displayEmpty
            onChange={this.handleSelect}
            value={value || ''}
            readOnly={showMaxLength}
          >
            <MenuItem value="">
              <em>{value ? 'Remove selection' : 'Select a response'}</em>
            </MenuItem>
            {selectChoices.map((c, index) => (
              <MenuItem key={index} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </Select>

          {choices && choices.length > 0 && (
            <div className={classes.rightContainer}>
              {maxLength && showMaxLength && (
                <TextField
                  className={classes.lengthField}
                  label="Maximum length (characters)"
                  type="number"
                  inputProps={{
                    min: minLength,
                    max: minLength + 10,
                  }}
                  value={maxLength}
                  onChange={this.changeLength}
                />
              )}
              <Button className={classes.addButton} variant="contained" color="primary" onClick={this.onAddChoice}>
                Add
              </Button>
            </div>
          )}
        </div>
        {errors && errors[0] && <div className={classes.errorText}>{errors[0]}</div>}

        <div className={classes.altChoices}>
          {choices &&
            choices.map(
              (c, index) =>
                index > 0 && (
                  <Choice
                    key={index}
                    classes={classes}
                    markup={c.label}
                    onChange={(val) => this.onChoiceChanged(c, val, index)}
                    onDelete={() => this.onRemoveChoice(c)}
                    spellCheck={spellCheck}
                    error={errors && errors[index]}
                  />
                ),
            )}
        </div>
      </div>
    );
  }
}

const Styled = withStyles(styles)(AlternateSection);

export default Styled;
