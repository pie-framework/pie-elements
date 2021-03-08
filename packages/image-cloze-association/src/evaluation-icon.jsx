import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import { color } from '@pie-lib/render-ui';

const getCorrectnessClass = (isCorrect, filled) => {
  if (filled) {
    return isCorrect ? 'correctFilled' : 'incorrectFilled';
  }
  return isCorrect ? 'correctEmpty' : 'incorrectEmpty';
};

const EvaluationIcon = ({ classes, containerStyle, isCorrect, filled }) => {
  const Icon = isCorrect ? Check : Close;
  const showCorrectness = isCorrect !== undefined;
  const correctness = showCorrectness ? getCorrectnessClass(isCorrect, filled) : '';

  return showCorrectness
    ? (
      <Icon
        className={`${classes.icon} ${classes[correctness]}`}
        style={containerStyle}
      />
    ) : null
};

EvaluationIcon.propTypes = {
  classes: PropTypes.object,
  containerStyle: PropTypes.object,
  filled: PropTypes.bool,
  isCorrect: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ])
};

EvaluationIcon.defaultProps = {
  classes: {},
  containerStyle: {},
  filled: false,
  isCorrect: undefined
};

const styles = () => ({
  correctEmpty: {
    color: color.correct()
  },
  correctFilled: {
    color: color.background(),
    backgroundColor: color.correct()
  },
  incorrectEmpty: {
    color: color.incorrect()
  },
  incorrectFilled: {
    color: color.background(),
    backgroundColor: color.incorrect()
  }
});

export default withStyles(styles)(EvaluationIcon);
