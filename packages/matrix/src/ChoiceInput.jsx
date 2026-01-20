import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { color } from '@pie-lib/render-ui';
import Radio from '@mui/material/Radio';

const StyledRadio = styled(Radio)({
  '&.MuiRadio-root': {
    color: `var(--choice-input-color, ${color.text()})`,
  },
  '&.MuiRadio-root.Mui-checked': {
    color: `var(--choice-input-selected-color, ${color.primary()})`,
  },
  '&.MuiRadio-root.Mui-disabled': {
    color: `var(--choice-input-disabled-color, ${color.defaults.DISABLED})`,
  },
});

const ChoiceInput = (props) => {
  const { disabled, checked, matrixKey, matrixValue, onChange } = props;

  const onChangeWrapper = () => {
    if (disabled) {
      return;
    }
    onChange({
      matrixValue,
      matrixKey,
    });
  };

  return (
    <StyledRadio
      checked={checked}
      onChange={onChangeWrapper}
      disabled={disabled}
    />
  );
};

ChoiceInput.propTypes = {
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  matrixValue: PropTypes.number.isRequired,
  matrixKey: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

ChoiceInput.defaultProps = {
  checked: false,
  disabled: false,
};

export default ChoiceInput;
