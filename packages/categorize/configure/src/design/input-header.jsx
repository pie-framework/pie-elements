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
      delete: PropTypes.func.isRequired,
    }),
    uploadSoundSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    toolbarOpts: PropTypes.object,
    error: PropTypes.string,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { focusedEl, index } = this.props;
    console.log('inputRef', this.inputRef);
    if (focusedEl && index && focusedEl === index) {
      this.inputRef.focus('end');
    }
  }

  render() {
    const {
      onChange,
      label,
      classes,
      className,
      deleteFocusedEl,
      imageSupport,
      toolbarOpts,
      spellCheck,
      error,
      maxImageWidth,
      maxImageHeight,
      uploadSoundSupport,
    } = this.props;
    const choicePlugins = {
      audio: { disabled: true },
      video: { disabled: true },
    };

    return (
      <div className={classNames(classes.inputHeader, className)}>
        <EditableHtml
          imageSupport={imageSupport}
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
