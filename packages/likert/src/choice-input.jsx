import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import {color} from '@pie-lib/render-ui';
import Radio from '@material-ui/core/Radio';
import {LIKERT_ORIENTATION} from './likertEntities';

const radioStyles = {
  root: {
    color: `var(--choice-input-color, ${color.text()})`
  },
  checked: {
    color: `var(--choice-input-selected-color, ${color.text()})`
  },
};

export const RadioStyled = withStyles(radioStyles)((props) => {
  const {classes, checked, onChange, disabled} = props;

  return (
    <Radio
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      classes={{
        root: classes.root,
        checked: classes.checked,
      }}
    />
  );
});


const choiceInputStyles = () => ({
  labelRoot: {
    color: color.text(),
    textAlign: 'center',
    cursor: 'pointer'
  },
  checkboxHolderRoot: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    padding: '0 5px',
    '& label': {}
  },
  formControlLabelRoot: {
    margin: 0
  }
});


export class ChoiceInput extends React.Component {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    likertOrientation: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
    classes: PropTypes.object,
  };

  static defaultProps = {
    checked: false,
  };

  onToggleChoice = () => {
    this.props.onChange({
      value: this.props.value,
      selected: !this.props.checked,
    });
  };

  render() {
    const {
      disabled,
      label,
      checked,
      likertOrientation,
      classes
    } = this.props;
    const flexDirection = likertOrientation === LIKERT_ORIENTATION.vertical ? 'row': 'column' ;

    return (
      <div className={classes.checkboxHolderRoot} style={{flexDirection}}>
        <FormControlLabel
          disabled={disabled}
          className={classes.formControlLabelRoot}
          control={
            <RadioStyled
              checked={checked}
              onChange={this.onToggleChoice}
            />
          }
        />
        <p
          className={classes.labelRoot}
          onClick={this.onToggleChoice}
          dangerouslySetInnerHTML={{__html: label}}
        />
      </div>
    );
  }
}

export default withStyles(choiceInputStyles)(ChoiceInput);
