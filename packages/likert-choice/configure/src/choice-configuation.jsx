import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {InputContainer} from '@pie-lib/config-ui';
import EditableHtml from '@pie-lib/editable-html';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import ActionDelete from '@material-ui/icons/Delete';


const styles = theme => ({
  index: {
    transform: 'translate(-60%, 35%)'
  },
  choiceConfiguration: {},
  topRow: {
    display: 'flex'
  },
  value: {
    flex: '0.5',
    paddingRight: theme.spacing.unit
  },
  editorHolder: {
    marginTop: theme.spacing.unit * 2
  },
  deleteIcon: {
    margin: 0,
    padding: 0,
    width: 'inherit'
  },
  delete: {
    flex: '0 1 auto',
    paddingTop: theme.spacing.unit,
    paddingLeft: 0,
    marginLeft: 0
  },
  editableHtml: {
    width: '60%'
  }
});

const EditableHtmlContainer = withStyles(theme => ({
  labelContainer: {},
  editorHolder: {
    marginTop: theme.spacing.unit * 2
  }
}))(({ label, classes, onChange, value, className, imageSupport }) => {
  const names = classNames(classes.labelContainer, className);
  return (
    <InputContainer label={label} className={names}>
      <div className={classes.editorHolder}>
        <EditableHtml
          markup={value || ''}
          onChange={onChange}
          imageSupport={imageSupport}
          className={classes.editor}
        />
      </div>
    </InputContainer>
  );
});


class ChoiceConfiguration extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    mode: PropTypes.oneOf(['checkbox', 'radio']),
    data: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      correct: PropTypes.bool
    }),
    onDelete: PropTypes.func,
    onChange: PropTypes.func,
    index: PropTypes.number
  };

  static defaultProps = {
    index: -1
  };

  _changeFn = key => update => {
    const { data, onChange } = this.props;
    if (onChange) {
      onChange({ ...data, [key]: update });
    }
  };

  onLabelChange = this._changeFn('label');

  render(){

    const {
      data,
      classes,
      onChange,
      onDelete,
      index,
      className
    } = this.props;

    const names = classNames(classes.choiceConfiguration, className);

    return (
      <div className={names}>
        <div className={classes.topRow}>
          {index > 0 && (
            <Typography className={classes.index} type="title">
              {index}
            </Typography>
          )}
          <EditableHtmlContainer
            label={'Value'}
            value={data.value}
            onChange={onChange}
          />
          <EditableHtmlContainer
            label={'Label'}
            value={data.label}
            onChange={this.onLabelChange}
          />
          <InputContainer className={classes.delete} label="Delete">
            <IconButton
              aria-label="delete"
              className={classes.deleteIcon}
              onClick={onDelete}
            >
              <ActionDelete />
            </IconButton>
          </InputContainer>
        </div>
      </div>
    );
  }

}

export default withStyles(styles)(ChoiceConfiguration);