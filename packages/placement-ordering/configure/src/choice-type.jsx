import React from 'react';
import PropTypes from 'prop-types';
import { TwoChoice } from '@pie-lib/config-ui';

export const ChoiceType = props => {
  let choiceProps = {
    header: props.header,
    defaultSelected: 'vertical',
    value: props.value,
    onChange: props.onChange,
    one: {
      label: 'Vertical',
      value: 'vertical'
    },
    two: {
      label: 'Horizontal',
      value: 'horizontal'
    }
  };

  return <TwoChoice {...choiceProps} />;
};

ChoiceType.propTypes = {
  header: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};