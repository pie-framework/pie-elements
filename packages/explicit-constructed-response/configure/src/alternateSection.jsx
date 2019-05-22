import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import EditableHtml from '@pie-lib/editable-html';
import { InputContainer } from '@pie-lib/config-ui';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

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
  selectContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  }
});

export class AlternateSection extends React.Component {
  static propTypes = {
    choices: PropTypes.array,
    selectChoices: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    choiceChanged: PropTypes.func.isRequired,
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
    if (!this.state.choices || !isEqual(props.choices, this.props.choices)) {
      this.setState({
        choices: props.choices
      });
    }
  };

  handleSelect = e => {
    const { onSelect, selectChoices } = this.props;
    const { value } = e.target;

    onSelect(selectChoices.find(c => c.id === value));
  };

  onAddChoice = () => {
    const { choices } = this.state;

    if (choices.length && choices[choices.length - 1].label !== '') {
      this.setState({
        choices: [
          ...choices,
          {
            id: `${choices.length}`,
            label: ''
          }
        ]
      });
    }
  };

  onChoiceChanged = (choice, newVal) => {
    const { choiceChanged } = this.props;

    choiceChanged({
      ...choice,
      label: newVal
    });
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
            value={value}
          >
            <MenuItem value="">
              <em>
                {value ? 'Remove selection' : 'Select a response'}
              </em>
            </MenuItem>
            {selectChoices.map((c, index) => <MenuItem key={index} value={c.id}>{c.label}</MenuItem>)}
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
              <EditableHtml
                key={index}
                className={classes.prompt}
                markup={c.label}
                onChange={val => this.onChoiceChanged(c, val)}
                disableUnderline
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