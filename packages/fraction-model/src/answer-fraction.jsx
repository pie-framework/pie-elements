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
    let value = parseInt(event.target.value);
    const { model, onAnswerChange, answers } = this.props;
    const newAnswers = { ...answers };
    let min = 1;
    let max = (key === 'noOfModel') ? model.maxModelSelected : 9;
    if(value > max) {
      value = max;
    } else if(value < min) {
      value = min;
    }
    newAnswers[key] = value;
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
    gap: '20px',
  },
  group: {
    margin: '12px 0',
  },
  inputLabel: {
    display: 'block',
    marginBottom: '4px',
  },
  textField: {
    width: '120px',
    maxHeight: '40px',
    '& [class^="MuiInputBase-root"]': {
      height: 40,
      fontSize: '14px',
    },
  },
});

export default withStyles(styles)(AnswerFraction);
