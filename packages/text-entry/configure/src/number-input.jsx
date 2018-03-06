import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input from 'material-ui/Input';
import { Typography, TextField } from 'material-ui';

const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      suffix="%"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default class NumberInput extends React.Component {

  onChange = (e) => {
    const v = parseInt(e.target.value, 10);
    const percent = Math.min(100, Math.max(0, v));
    this.props.onChange(percent);
  }

  render() {
    const { label, value, className, placeholder } = this.props;
    return (
      <Input
        className={className}
        placeholder={placeholder}
        value={value.toString()}
        onChange={this.onChange}
        inputComponent={NumberFormatCustom}
        inputProps={{
          'aria-label': 'Description',
        }}
      />
    );
  }
}
