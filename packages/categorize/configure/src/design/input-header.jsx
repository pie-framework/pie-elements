import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import EditableHtml from '@pie-lib/editable-html';

export class InputHeader extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onDelete: PropTypes.func
  };

  static defaultProps = {};
  render() {
    const { onChange, label, classes, className } = this.props;
    return (
      <div className={classNames(classes.inputHeader, className)}>
        <EditableHtml
          autoWidthToolbar
          label={'label'}
          markup={label}
          onChange={onChange}
          className={classes.editor}
        />
      </div>
    );
  }
}
const styles = theme => ({
  editor: {
    flex: '1',
    paddingBottom: theme.spacing.unit
  },
  iconButtonRoot: {
    width: 'auto',
    height: 'auto'
  },
  inputHeader: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});
export default withStyles(styles)(InputHeader);
