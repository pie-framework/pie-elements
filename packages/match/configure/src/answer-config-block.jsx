import * as React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { InputCheckbox } from '@pie-lib/config-ui';
import AddRow from './add-row';
import Row from './row';
import { swap } from '@pie-lib/drag';
import debug from 'debug';

const log = debug('pie-elements:match:configure');

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
    flex: 0.5,
    minWidth: '88px',
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
    onAddRow: PropTypes.func.isRequired,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    })
  };

  moveRow = (from, to) => {
    const { model, onChange } = this.props;
    const newModel = { ...model };
    const rows = newModel.rows;

    log('[moveRow]: ', from, to);

    const update = swap(rows, from, to);

    log('update: ', update);

    newModel.rows = update;

    onChange(newModel);
  };

  onChange = (name, isBoolean) => event => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    newModel[name] = isBoolean ? event.target.checked : event.target.value;

    onChange(newModel, name);
  };

  onHeaderChange = headerIndex => event => {
    const { model, onChange } = this.props;
    const newModel = { ...model };

    newModel.headers[headerIndex] = event.target.value;

    onChange(newModel);
  };

  render() {
    const { classes, model, onAddRow, imageSupport } = this.props;

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
            <Row
              key={idx}
              model={model}
              row={row}
              idx={idx}
              onDeleteRow={this.props.onDeleteRow}
              onChange={this.props.onChange}
              onMoveRow={this.moveRow}
              imageSupport={imageSupport}
            />
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
