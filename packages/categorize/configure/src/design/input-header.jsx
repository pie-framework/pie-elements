import { getPluginProps } from './utils';
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import EditableHtml from '@pie-lib/editable-html';

const StyledEditableHtml = styled(EditableHtml)(({ theme }) => ({
  flex: '1',
  paddingBottom: theme.spacing(1),
  maxWidth: '100%',
}));

const InputHeaderContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
});

export class InputHeader extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    configuration: PropTypes.object.isRequired,
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
      configuration,
      label,
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
      mathMlOptions = {},
    } = this.props;

    const { headers, baseInputConfiguration } = configuration;

    return (
      <InputHeaderContainer className={className}>
        <StyledEditableHtml
          imageSupport={imageSupport}
          disabled={disabled}
          ref={(ref) => (this.inputRef = ref)}
          autoWidthToolbar
          label={'label'}
          markup={label}
          onChange={onChange}
          pluginProps={getPluginProps(headers?.inputConfiguration, baseInputConfiguration)}
          toolbarOpts={toolbarOpts}
          spellCheck={spellCheck}
          error={error}
          maxImageWidth={maxImageWidth}
          maxImageHeight={maxImageHeight}
          uploadSoundSupport={uploadSoundSupport}
          languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
          onDone={() => {
            deleteFocusedEl && deleteFocusedEl();
          }}
          mathMlOptions={mathMlOptions}
        />
      </InputHeaderContainer>
    );
  }
}

export default InputHeader;
