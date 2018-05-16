import React from 'react';

const Comp = name => props => <div compName={name}>{name}</div>;

module.exports = {
  NumberTextField: Comp('NumberTextField'),
  InputRadio: Comp('InputRadio'),
  InputCheckbox: Comp('InputCheckbox'),
  TwoChoice: Comp('TwoChoice'),
  InputContainer: Comp('InputContainer'),
  FeedbackConfig: Comp('FeedbackConfig'),
  Tabs: Comp('Tabs'),
  Checkbox: Comp('Checkbox'),
  choiceUtils: {
    firstAvailableIndex: jest.fn(() => '1')
  }
};
