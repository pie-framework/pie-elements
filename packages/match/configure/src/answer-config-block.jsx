import * as React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { InputCheckbox } from '@pie-lib/config-ui';
import AddRow from './add-row';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column'
  },
  rowContainer: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },
  rowItem: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  deleteIcon: {
    flex: 0.5
  },
  questionText: {
    flex: 2,
    display: 'flex',
    justifyContent: 'flex-start'
  },
  rowTable: {
    display: 'flex',
    flexDirection: 'column'
  },
  separator: {
    marginTop: theme.spacing.unit * 2,
    border: 0,
    borderTop: '2px solid lightgray',
    width: '100%'
  },
  checkboxContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  optionsCheckbox: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  headerInput: {
    textAlign: 'center',
    maxWidth: '100px'
  }
});

class AnswerConfigBlock extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onDeleteRow: PropTypes.func.isRequired,
    onAddRow: PropTypes.func.isRequired
  };

  onChange = (name, isBoolean) => event => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    newModel[name] = isBoolean ? event.target.checked : event.target.value;

    onChange(newModel, name);
  };

  onDeleteRow = (idx) => () => {
    this.props.onDeleteRow(idx)
  };

  onRowValueChange = (rowIndex, rowValueIndex) => event => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    if (model.responseType === 'radio') {
      for (let i = 0; i < newModel.rows[rowIndex].values.length; i++) {
        newModel.rows[rowIndex].values[i] = false;
      }
    }

    newModel.rows[rowIndex].values[rowValueIndex] = event.target.checked;

    onChange(newModel);
  };

  onRowTitleChange = rowIndex => event => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    newModel.rows[rowIndex].title = event.target.value;

    onChange(newModel);
  };

  onHeaderChange = headerIndex => event => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    newModel.headers[headerIndex] = event.target.value;

    onChange(newModel);
  };

  render() {
    const { classes, model, onAddRow } = this.props;

    return (
      <div className={classes.container}>
        <Typography type="body1" component="div">
          Click on the labels to edit or remove. Set the correct answers by clicking each correct answer per row.
        </Typography>
        <div className={classes.rowTable}>
          <div className={classes.rowContainer}>
            {model.headers.map((header, idx) => (
              <div key={idx} className={cx(classes.rowItem, { [classes.questionText]: idx === 0 })}>
                <Input
                  type="text"
                  disableUnderline
                  classes={idx === 0 ? null : { input: classes.headerInput}}
                  onChange={this.onHeaderChange(idx)}
                  value={header}
                  placeholder="Enter Value"
                />
              </div>
            ))}
            <div className={classes.deleteIcon}>
              <Button disabled>
                <div />
              </Button>
            </div>
          </div>
          <hr className={classes.separator} />
          {model.rows.map((row, idx) => (
            <div key={idx}>
              <div className={classes.rowContainer}>
                  <div className={cx(classes.rowItem, classes.questionText)}>
                    <Input
                      type="text"
                      disableUnderline
                      onChange={this.onRowTitleChange(idx)}
                      value={row.title}
                      placeholder="Enter Value"
                    />
                  </div>
                  {row.values.map((rowValue, rowIdx) => (
                    <div key={rowIdx} className={classes.rowItem}>
                      {model.responseType === 'radio' ? (
                        <Radio
                          onChange={this.onRowValueChange(idx, rowIdx)}
                          checked={rowValue === true}
                        />
                      ) : (
                        <Checkbox
                          onChange={this.onRowValueChange(idx, rowIdx)}
                          checked={rowValue === true}
                        />
                      )}
                    </div>
                  ))}
                <div className={classes.deleteIcon}>
                  <Button onClick={this.onDeleteRow(idx)}>
                    <Delete className={classes.deleteIcon} />
                  </Button>
                </div>
              </div>
              <hr className={classes.separator} />
            </div>
          ))}
          <AddRow onAddClick={onAddRow} />
          <div className={classes.checkboxContainer}>
            <div className={classes.optionsCheckbox}>
              <InputCheckbox
                label="Shuffle Choices"
                checked={model.shuffled}
                onChange={this.onChange('shuffled', true)}/>
            </div>
            <div className={classes.optionsCheckbox}>
              <InputCheckbox
                label="Allow Partial Scoring"
                checked={model.allowPartialScoring}
                onChange={this.onChange('allowPartialScoring', true)}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AnswerConfigBlock);
