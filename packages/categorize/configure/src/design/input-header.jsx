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
    onDelete: PropTypes.func,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    })
  };

  static defaultProps = {};
  render() {
    const { onChange, label, classes, className, imageSupport } = this.props;
    const choicePlugins = {
      audio: { disabled: true },
      video: { disabled: true }
    };

    return (
      <div className={classNames(classes.inputHeader, className)}>
        <EditableHtml
          imageSupport={imageSupport}
          autoWidthToolbar
          label={'label'}
          markup={label}
          onChange={onChange}
          className={classes.editor}
          pluginProps={choicePlugins}
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
