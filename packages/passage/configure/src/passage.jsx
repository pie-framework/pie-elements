import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { InputContainer } from '@pie-lib/config-ui';
import EditableHtml, { ALL_PLUGINS } from '@pie-lib/editable-html';

export class PassageComponent extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    onModelChanged: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    imageSupport: PropTypes.object.isRequired,
    passageIndex: PropTypes.number.isRequired,
    uploadSoundSupport: PropTypes.object.isRequired,
  };

  static defaultProps = {
    passageIndex: 0,
  };

  constructor(props) {
    super(props);
  }

  handleChange = (fieldName, value) => {
    const { model, onModelChanged, passageIndex } = this.props;

    if (!model.passages || passageIndex < 0 || passageIndex >= model.passages.length) {
      return;
    }

    const updatedPassages = [...model.passages];
    updatedPassages[passageIndex] = { ...updatedPassages[passageIndex], [fieldName]: value };

    onModelChanged({ ...model, passages: updatedPassages });
  };

  render() {
    const { model, classes, configuration, imageSupport, passageIndex, uploadSoundSupport } = this.props;
    const {
      maxImageWidth = {},
      maxImageHeight = {},
      mathMlOptions = {},
      baseInputConfiguration = {},
      teacherInstructions = {},
      title = {},
      subtitle = {},
      text = {},
      author = {},
    } = configuration || {};
    const {
      errors = {},
      passages = [],
      teacherInstructionsEnabled,
      titleEnabled,
      subtitleEnabled,
      authorEnabled,
      textEnabled,
    } = model || {};

    const { passages: passagesErrors } = errors || {};
    const {
      teacherInstructions: teacherInstructionsError,
      title: titleError,
      subtitle: subtitleError,
      author: authorError,
      text: textError,
    } = (passagesErrors && passagesErrors[passageIndex]) || {};

    const defaultImageMaxWidth = maxImageWidth && maxImageWidth.prompt;
    const defaultImageMaxHeight = maxImageHeight && maxImageHeight.prompt;

    const getPluginProps = (customConfiguration) => ({ ...baseInputConfiguration, ...customConfiguration });

    return (
      <React.Fragment>
        {teacherInstructionsEnabled && (
          <InputContainer label={teacherInstructions.label} className={classes.inputContainer}>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              markup={passages[passageIndex].teacherInstructions || ''}
              onChange={(value) => this.handleChange('teacherInstructions', value)}
              nonEmpty={false}
              error={teacherInstructionsError}
              maxImageWidth={(maxImageWidth && maxImageWidth.teacherInstructions) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.teacherInstructions) || defaultImageMaxHeight}
              mathMlOptions={mathMlOptions}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              pluginProps={getPluginProps(teacherInstructions?.inputConfiguration)}
            />
            {teacherInstructionsError && <div className={classes.errorText}>{teacherInstructionsError}</div>}
          </InputContainer>
        )}

        {titleEnabled && (
          <InputContainer label={title.label} className={classes.inputContainer}>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              markup={passages[passageIndex].title || ''}
              onChange={(value) => this.handleChange('title', value)}
              nonEmpty={false}
              error={titleError}
              mathMlOptions={mathMlOptions}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              pluginProps={getPluginProps(title?.inputConfiguration)}
            />
            {titleError && <div className={classes.errorText}>{titleError}</div>}
          </InputContainer>
        )}

        {subtitleEnabled && (
          <InputContainer label={subtitle.label} className={classes.inputContainer}>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              markup={passages[passageIndex].subtitle || ''}
              onChange={(value) => this.handleChange('subtitle', value)}
              nonEmpty={false}
              error={subtitleError}
              mathMlOptions={mathMlOptions}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              pluginProps={getPluginProps(subtitle?.inputConfiguration)}
            />
            {subtitleError && <div className={classes.errorText}>{subtitleError}</div>}
          </InputContainer>
        )}

        {authorEnabled && (
          <InputContainer label={author.label} className={classes.inputContainer}>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              markup={passages[passageIndex].author || ''}
              onChange={(value) => this.handleChange('author', value)}
              nonEmpty={false}
              error={authorError}
              mathMlOptions={mathMlOptions}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              pluginProps={getPluginProps(author?.inputConfiguration)}
            />
            {authorError && <div className={classes.errorText}>{authorError}</div>}
          </InputContainer>
        )}

        {textEnabled && (
          <InputContainer label={text.label} className={classes.inputContainer}>
            <EditableHtml
              activePlugins={ALL_PLUGINS}
              markup={passages[passageIndex].text || ''}
              onChange={(value) => this.handleChange('text', value)}
              imageSupport={imageSupport}
              uploadSoundSupport={uploadSoundSupport}
              nonEmpty={false}
              error={textError}
              maxImageWidth={(maxImageWidth && maxImageWidth.text) || defaultImageMaxWidth}
              maxImageHeight={(maxImageHeight && maxImageHeight.text) || defaultImageMaxHeight}
              mathMlOptions={mathMlOptions}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              pluginProps={getPluginProps(text?.inputConfiguration)}
            />
            {textError && <div className={classes.errorText}>{textError}</div>}
          </InputContainer>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles((theme) => ({
  inputContainer: {
    paddingTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
  },
  errorText: {
    fontSize: theme.typography.fontSize - 2,
    color: theme.palette.error.main,
    paddingTop: theme.spacing.unit,
  },
}))(PassageComponent);
