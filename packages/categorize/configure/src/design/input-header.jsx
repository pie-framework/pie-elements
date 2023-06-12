import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import EditableHtml from '@pie-lib/editable-html';

export class InputHeader extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    deleteFocusedEl: PropTypes.func,
    disabled: PropTypes.bool,
    focusedEl: PropTypes.number,
    index: PropTypes.number,
    label: PropTypes.string,
    maxImageWidth: PropTypes.object,
    maxImageHeight: PropTypes.object,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    toolbarOpts: PropTypes.object,
    error: PropTypes.string,
    spellCheck: PropTypes.bool,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { focusedEl, index } = this.props;
    if (focusedEl && index && focusedEl === index) {
      this.inputRef.focus('end', null, true);
    }
  }

  render() {
    const {
      onChange,
      label,
      classes,
      className,
      deleteFocusedEl,
      disabled,
      imageSupport,
      toolbarOpts,
      spellCheck,
      error,
      maxImageWidth,
      maxImageHeight,
      uploadSoundSupport,
      mathMlOptions
    } = this.props;
    const choicePlugins = {
      audio: { disabled: true },
      video: { disabled: true },
    };

    return (
      <div className={classNames(classes.inputHeader, className)}>
        <EditableHtml
          imageSupport={imageSupport}
          disabled={disabled}
          ref={(ref) => (this.inputRef = ref)}
          autoWidthToolbar
          label={'label'}
          markup={label}
          onChange={onChange}
          className={classes.editor}
          pluginProps={choicePlugins}
          toolbarOpts={toolbarOpts}
          spellCheck={spellCheck}
          error={error}
          maxImageWidth={maxImageWidth}
          maxImageHeight={maxImageHeight}
          uploadSoundSupport={uploadSoundSupport}
          languageCharactersProps={[
            { language: 'spanish' },
            { language: 'special' },
          ]}
          onDone={() => {
            deleteFocusedEl && deleteFocusedEl();
          }}
          mathMlOptions={mathMlOptions}
        />
      </div>
    );
  }
}
const styles = (theme) => ({
  editor: {
    flex: '1',
    paddingBottom: theme.spacing.unit,
  },
  iconButtonRoot: {
    width: 'auto',
    height: 'auto',
  },
  inputHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});
export default withStyles(styles)(InputHeader);
