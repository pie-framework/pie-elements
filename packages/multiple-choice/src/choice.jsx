import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ChoiceInput from './choice-input';

export class Choice extends React.Component {
  onChange = (choice) => {
    const { disabled, onChoiceChanged } = this.props;

    if (!disabled) {
      onChoiceChanged(choice);
    }
  };

  render() {
    const {
      choice,
      index,
      choicesLength,
      showCorrect,
      isEvaluateMode,
      choiceMode,
      disabled,
      checked,
      correctness,
      displayKey,
      classes,
      choicesLayout,
      gridColumns,
    } = this.props;
    const choiceClass = 'choice' + (index === choicesLength - 1 ? ' last' : '');

    const feedback = !isEvaluateMode || showCorrect ? '' : choice.feedback;

    const choiceProps = {
      ...choice,
      checked,
      choiceMode,
      disabled,
      feedback,
      correctness,
      displayKey,
      choicesLayout,
      gridColumns,
      onChange: this.onChange,
      isEvaluateMode,
    };

    const names = classNames(classes.choice, {
      [classes.noBorder]:
        index === choicesLength - 1 || choicesLayout !== 'vertical',
    });

    return (
      <div className={choiceClass} key={index}>
        <ChoiceInput {...choiceProps} className={names} />
      </div>
    );
  }
}

Choice.propTypes = {
  choiceMode: PropTypes.oneOf(['radio', 'checkbox']),
  choice: PropTypes.object,
  disabled: PropTypes.bool.isRequired,
  onChoiceChanged: PropTypes.func,
  classes: PropTypes.object.isRequired,
  index: PropTypes.number,
  choicesLength: PropTypes.number,
  showCorrect: PropTypes.bool,
  isEvaluateMode: PropTypes.bool,
  checked: PropTypes.bool,
  correctness: PropTypes.string,
  displayKey: PropTypes.string,
  choicesLayout: PropTypes.oneOf(['vertical', 'grid', 'horizontal']),
  gridColumns: PropTypes.string,
};

export default withStyles({
  choice: {
    paddingTop: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #E0DEE0',
  },
  noBorder: {
    borderBottom: 'none',
  },
})(Choice);
