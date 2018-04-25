import PropTypes from 'prop-types';
import React from 'react';
import { TwoChoice } from '@pie-lib/config-ui';

export const ChoiceType = props => {
  let choiceProps = {
    header: 'Response Type',
    defaultSelected: 'radio',
    value: props.value,
    onChange: props.onChange,
    one: {
      label: 'Radio',
      value: 'radio'
    },
    two: {
      label: 'Checkbox',
      value: 'checkbox'
    }
  };
  return <TwoChoice {...choiceProps} />;
};

export const KeyType = props => {
  let choiceProps = {
    header: 'Choice Labels',
    defaultSelected: 'numbers',
    value: props.value,
    onChange: props.onChange,
    one: {
      label: 'Numbers',
      value: 'numbers'
    },
    two: {
      label: 'Letters',
      value: 'letters'
    }
  };
  return <TwoChoice {...choiceProps} />;
};

KeyType.propTypes = ChoiceType.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
