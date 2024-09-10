import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

export class AnswerFraction extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    showCorrect: PropTypes.bool.isRequired,
    onAnswerChange: PropTypes.func.isRequired,
    answers: PropTypes.object.isRequired,
  };

  /**
   * Function to trigger when value change from number selection
   * @param {string} key contains event change object
   * @returns updated answer change object
   */
  onValueChange = (key) => (event) => {
    const { onAnswerChange, answers } = this.props;
    const newAnswers = { ...answers };

    newAnswers[key] = parseInt(event.target.value);
    onAnswerChange(newAnswers);
  };

  render() {
    const { model, classes, showCorrect, answers, disabled } = this.props;

    return (
      <div>
        {model.allowedStudentConfig && (
          <div className={classes.groupInline}>
            <div className={classes.group}>
              <label htmlFor={'preview_number-of-models'} className={classes.inputLabel}>
                Number of Models
              </label>
              <TextField
                className={classes.textField}
                id="preview_number-of-models"
                inputProps={{ min: 1, max: model.maxModelSelected }}
                name="preview_number-of-models"
                onChange={this.onValueChange('noOfModel')}
                type="number"
                variant="outlined"
                disabled={disabled}
                value={showCorrect ? model.maxModelSelected : answers.noOfModel}
              />
            </div>
            <div className={classes.group}>
              <label htmlFor={'preview_parts-per-model'} className={classes.inputLabel}>
                Parts per Model
              </label>
              <TextField
                className={classes.textField}
                id="preview_parts-per-model"
                inputProps={{ min: 1, max: 9 }}
                name="preview_parts-per-model"
                onChange={this.onValueChange('partsPerModel')}
                type="number"
                variant="outlined"
                disabled={disabled}
                value={showCorrect ? model.partsPerModel : answers.partsPerModel}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const styles = () => ({
  groupInline: {
    alignItems: 'center',
    display: 'flex',
    gap: '1.25rem',
  },
  group: {
    margin: '0.75rem 0',
  },
  inputLabel: {
    display: 'block',
    marginBottom: '0.25rem',
  },
  textField: {
    width: '120px',
    maxHeight: '40px',
    '& [class^="MuiInputBase-root"]': {
      height: 40,
      fontSize: '0.875rem',
    },
  },
});

export default withStyles(styles)(AnswerFraction);
