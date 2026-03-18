import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const InputWrapper = styled('div')`
  width: 100%;
  height: 100%;
  input[type='number'] {
    -moz-appearance: textfield;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    fontSize: '16px',
    textAlign: 'center!important',
    padding: '0!important',
    margin: '5px 0',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'gray !important',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'green !important',
      borderWidth: '1px !important',
    },
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '16px',
    textAlign: 'center',
    padding: '0',
    margin: '5px 0',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px !important',
    borderColor: '#d6d6d6 !important',
  },
});

const NumericInput = (props) => {
  const { onFieldUpdate, name, placeholder, fieldValue } = props;

  const onFieldUpdateWrapper = (e) => {
    onFieldUpdate(e.target.value);
  };

  return (
    <InputWrapper>
      <StyledTextField
        name={name}
        value={fieldValue.value}
        inputRef={fieldValue.ref}
        type="number"
        placeholder={placeholder}
        onChange={onFieldUpdateWrapper}
        variant="outlined"
      />
    </InputWrapper>
  );
};

NumericInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  fieldValue: PropTypes.object.isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
};

export default NumericInput;
