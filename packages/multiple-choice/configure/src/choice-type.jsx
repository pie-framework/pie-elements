import PropTypes from 'prop-types';
import React from 'react';
import { TwoChoice, NChoice } from '@pie-lib/config-ui';

export const ChoiceType = props => {
  let choiceProps = {
    header: props.header,
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
    header: props.header,
    defaultSelected: 'numbers',
    value: props.value,
    onChange: props.onChange,
    opts: [
      {
        label: 'Numbers',
        value: 'numbers'
      },
      {
        label: 'Letters',
        value: 'letters'
      },
      {
        label: 'None',
        value: 'none'
      }
    ]
  };
  return <NChoice {...choiceProps} />;
};

KeyType.propTypes = ChoiceType.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
