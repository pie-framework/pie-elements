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
      updateSession,
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
      updateSession,
      onChange: this.onChange,
      isEvaluateMode,
    };

    const names = classNames(classes.choice, {
      [classes.noBorder]: index === choicesLength - 1 || choicesLayout !== 'vertical',
      [classes.horizontalLayout]: choicesLayout === 'horizontal',
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

export default withStyles((theme) => ({
  choice: {
    paddingTop: theme.spacing.unit * 2.5,
    paddingBottom: theme.spacing.unit + 2,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  noBorder: {
    borderBottom: 'none',
  },
  horizontalLayout: {
    paddingRight: theme.spacing.unit * 2.5,
    '& label': {
      marginRight: theme.spacing.unit,
      // '& span:first-child': {
      //   paddingRight: 0
      // }
    },
  },
}))(Choice);
