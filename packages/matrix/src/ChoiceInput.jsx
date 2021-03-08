import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import {color} from '@pie-lib/render-ui';
import Radio from '@material-ui/core/Radio';

const radioStyles = {
  root: {
    color: `var(--choice-input-color, ${color.text()})`
  },
  checked: {
    color: `var(--choice-input-selected-color, ${color.text()})`
  }
};

const ChoiceInput = withStyles(radioStyles)((props) => {
  const {disabled, checked, matrixKey, matrixValue, classes, onChange} = props;

  const onChangeWrapper = () => {
    if (disabled) {
      return;
    }
    onChange({
      matrixValue,
      matrixKey
    });
  };

  return (
    <Radio
      checked={checked}
      onChange={onChangeWrapper}
      disabled={disabled}
      classes={{
        root: classes.root,
        checked: classes.checked,
      }}
    />
  );
});

ChoiceInput.propTypes = {
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  matrixValue: PropTypes.number.isRequired,
  matrixKey: PropTypes.string.isRequired,
  classes: PropTypes.object,
  onChange: PropTypes.func.isRequired
};

ChoiceInput.defaultProps = {
  checked: false,
  disabled: false
};

export default ChoiceInput;
