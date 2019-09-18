import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import max from 'lodash/max';

const styles = theme => ({
  altChoices: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    display: 'flex',
    padding: '20px 0 0 0',
    '& > *': {
      marginBottom: '20px',
      width: '100%'
    }
  },
  choice: {
    flex: '1',
    marginRight: '20px'
  },
  deleteBtn: {
    fill: 'gray'
  },
  selectContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }
});

const Choice = ({ classes, markup, onChange, onDelete }) => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <OutlinedInput
        className={classes.choice}
        value={markup}
        onChange={onChange}
        labelWidth={0}
        disableUnderline
      />
      <IconButton
        aria-label="delete"
        className={classes.deleteBtn}
        onClick={onDelete}
      >
        <Delete />
      </IconButton>
    </div>
  )
};

export class AlternateSection extends React.Component {
  static propTypes = {
    choices: PropTypes.array,
    selectChoices: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    choiceChanged: PropTypes.func.isRequired,
    choiceRemoved: PropTypes.func.isRequired,
    value: PropTypes.string
  };

  state = {};

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.updateChoicesIfNeeded(nextProps);
  }

  componentDidMount() {
    this.updateChoicesIfNeeded(this.props);
  }

  updateChoicesIfNeeded = props => {
    if (!this.state.choices
      || !isEqual(props.choices, this.state.choices)
      || !isEqual(props.choices, this.props.choices)
    ) {
      this.setState({
        choices: props.choices
      });
    }
  };

  handleSelect = e => {
    const { onSelect, selectChoices } = this.props;
    const { value } = e.target;

    onSelect(selectChoices.find(c => c.value === value));
  };

  onAddChoice = () => {
    const { choices } = this.state;

    if (choices.length && choices[choices.length - 1].label !== '') {
      const value = max(choices.map(c => parseInt(c.value)).filter(id => !isNaN(id))) || 0;

      this.setState({
        choices: [
          ...choices,
          {
            value: `${value + 1}`,
            label: ''
          }
        ]
      });
    }
  };

  onChoiceChanged = (choice, e) => {
    const { choiceChanged } = this.props;

    choiceChanged({
      ...choice,
      label: e.target.value
    });
  };

  onRemoveChoice = choice => {
    const { choiceRemoved } = this.props;

    choiceRemoved(choice.value);
  };

  render() {
    const {
      classes,
      selectChoices,
      value
    } = this.props;
    const { choices } = this.state;

    return (
      <div className={classes.design}>
        <div
          className={classes.selectContainer}
        >
          <Select
            className={classes.select}
            displayEmpty
            onChange={this.handleSelect}
            value={value || ''}
          >
            <MenuItem value="">
              <em>
                {value ? 'Remove selection' : 'Select a response'}
              </em>
            </MenuItem>
            {selectChoices.map((c, index) => <MenuItem key={index} value={c.value}>{c.label}</MenuItem>)}
          </Select>
          {
            choices && choices.length > 0 &&
            <Button
              className={classes.addButton}
              variant="contained"
              color="primary"
              onClick={this.onAddChoice}
            >
              Add
            </Button>
          }
        </div>
        <div
          className={classes.altChoices}
        >
          {
            choices &&
            choices.map((c, index) => index > 0 && (
              <Choice
                key={index}
                classes={classes}
                markup={c.label}
                onChange={val => this.onChoiceChanged(c, val)}
                onDelete={() => this.onRemoveChoice(c)}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

const Styled = withStyles(styles)(AlternateSection);

export default Styled;
