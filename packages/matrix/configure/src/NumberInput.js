import * as React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {TextField} from '@material-ui/core';

const InputWrapper = styled.div`
  width: 100%;
  height: 100%;
  input[type='number'] {
    -moz-appearance:textfield;
  }
  
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

const styles = {
  InputPropsClass: {
    fontSize: '16px',
    textAlign: 'center!important',
    padding: '0!important',
    margin: '5px 0',
    '&$cssFocused $notchedOutline': {
      borderColor: 'green !important',
      borderWidth: '1px !important',
    },
    '&:hover $notchedOutline': {
      borderColor: 'gray !important',
    }
  },
  inputPropsClass: {
    fontSize: '16px',
    textAlign: 'center',
    padding: '0',
    margin: '5px 0'
  },
  cssFocused: {},

  notchedOutline: {
    borderWidth: '1px !important',
    borderColor: '#d6d6d6 !important'
  },
};

const NumericInput = withStyles(styles)((props) => {
  const {
    classes,
    onFieldUpdate,
    name,
    placeholder,
    fieldValue
  } = props;

  const onFieldUpdateWrapper = (e) => {
    onFieldUpdate(e.target.value);
  };

  return (
    <InputWrapper>
      <TextField
        name={name}
        value={fieldValue.value}
        inputProps={{
          className: classes.inputPropsClass
        }}
        InputProps={{
          classes: {
            root: classes.InputPropsClass,
            focused: classes.cssFocused,
            notchedOutline: classes.notchedOutline
          }
        }}
        inputRef={fieldValue.ref}
        type='number'
        placeholder={placeholder}
        onChange={onFieldUpdateWrapper}
        variant="outlined"
      />
    </InputWrapper>
  );
});

NumericInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  fieldValue: PropTypes.object.isRequired,
  classes: PropTypes.object,

  onFieldUpdate: PropTypes.func.isRequired
};

export default NumericInput;
